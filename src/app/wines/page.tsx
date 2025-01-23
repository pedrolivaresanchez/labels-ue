'use client';

import { useState, useEffect } from 'react';
import { WinesTable } from "@/components/WinesTable";
import { WinesTableSkeleton } from "@/components/WinesTableSkeleton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { generateQRCode } from "@/utils/qr";
import type { Wine } from "@/components/WinesTable";
import Link from "next/link";
import { PlusCircle, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function WinesPage() {
  const [wines, setWines] = useState<Wine[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; wineId: string | null }>({
    isOpen: false,
    wineId: null
  });
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const handleDeleteClick = (id: string) => {
    setDeleteDialog({ isOpen: true, wineId: id });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.wineId) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/wines/${deleteDialog.wineId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Error al eliminar el vino');
      }

      // Update the UI state
      setWines(prevWines => prevWines.filter(wine => wine.id !== deleteDialog.wineId));
      
      // Close the dialog
      setDeleteDialog({ isOpen: false, wineId: null });
    } catch (error) {
      console.error('Error deleting wine:', error);
      alert(error instanceof Error ? error.message : 'Error al eliminar el vino');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDuplicate = async (wine: Wine) => {
    setDuplicatingId(wine.id);
    try {
      // Remove id and timestamps from the wine object
      const { 
        id, 
        created_at, 
        updated_at, 
        ingredients,
        certifications,
        production_variants,
        disclaimer_icons,
        ...wineData 
      } = wine;
      
      // Create the new wine
      const { data: newWine, error } = await supabase
        .from('wines')
        .insert([{ ...wineData, name: `${wine.name} (copia)` }])
        .select('*')
        .single();

      if (error) throw error;

      // Create all related records in parallel
      const relatedPromises = [];

      if (ingredients?.length > 0) {
        const newIngredients = ingredients.map(i => ({
          wine_id: newWine.id,
          ingredient_name: i.ingredient_name,
          is_allergen: i.is_allergen
        }));
        relatedPromises.push(
          supabase.from('ingredients').insert(newIngredients)
        );
      }

      if (production_variants?.length > 0) {
        const newVariants = production_variants.map(v => ({
          wine_id: newWine.id,
          variant_name: v.variant_name
        }));
        relatedPromises.push(
          supabase.from('production_variants').insert(newVariants)
        );
      }

      if (disclaimer_icons?.length > 0) {
        const newIcons = disclaimer_icons.map(d => ({
          wine_id: newWine.id,
          icon_name: d.icon_name
        }));
        relatedPromises.push(
          supabase.from('disclaimer_icons').insert(newIcons)
        );
      }

      if (certifications?.length > 0) {
        const newCertifications = certifications.map(c => ({
          wine_id: newWine.id,
          certification_name: c.certification_name
        }));
        relatedPromises.push(
          supabase.from('certifications').insert(newCertifications)
        );
      }

      // Wait for all related records to be created
      await Promise.all(relatedPromises);

      // Fetch the complete new wine with all relations
      const { data: completeWine, error: fetchError } = await supabase
        .from('wines')
        .select(`
          *,
          ingredients (
            id, wine_id, ingredient_name, is_allergen
          ),
          certifications (
            id, wine_id, certification_name
          ),
          production_variants (
            id, wine_id, variant_name
          ),
          disclaimer_icons (
            id, wine_id, icon_name
          )
        `)
        .eq('id', newWine.id)
        .single();

      if (fetchError) throw fetchError;

      // Add the new wine to the list
      setWines(prevWines => [...prevWines, completeWine]);
      
      // Show success toast
      toast({
        title: "Etiqueta duplicada",
        description: `Se ha duplicado la etiqueta ${wine.name} correctamente`,
      });
    } catch (error) {
      console.error('Error duplicating wine:', error);
      toast({
        title: "Error",
        description: "Error al duplicar el vino",
        variant: "destructive",
      });
    } finally {
      setDuplicatingId(null);
    }
  };

  const handleQRDownload = async (wine: Wine) => {
    const qrData = await generateQRCode(wine.id);
    return {
      dataUrl: qrData,
      fileName: `qr-${wine.name.toLowerCase().replace(/\s+/g, '-')}.png`
    };
  };

  useEffect(() => {
    async function fetchWines() {
      try {
        setLoading(true);
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/login');
          return;
        }

        // Fetch wines for current user
        const { data: wines, error } = await supabase
          .from('wines')
          .select(`
            *,
            ingredients (
              id,
              ingredient_name,
              is_allergen
            ),
            production_variants (
              id,
              variant_name
            ),
            certifications (
              id,
              certification_name
            ),
            disclaimer_icons (
              id,
              icon_name
            )
          `)
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        console.log('Raw wines data:', wines); // Debug log
        
        // Transform the data to match the Wine type
        const transformedWines = wines?.map(wine => ({
          ...wine,
          ingredients: wine.ingredients || [],
          production_variants: wine.production_variants || [],
          certifications: wine.certifications || [],
          disclaimer_icons: wine.disclaimer_icons || []
        })) || [];

        console.log('Transformed wines:', transformedWines); // Debug log
        setWines(transformedWines);
      } catch (error) {
        console.error('Error fetching wines:', error);
        setWines([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    }

    fetchWines();
  }, [router, supabase]);

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Etiquetas</h1>
          <Button asChild>
            <Link href="/wines/new" className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              Crear etiqueta
            </Link>
          </Button>
        </div>
        {loading ? (
          <WinesTableSkeleton />
        ) : (
          <WinesTable 
            data={wines} 
            onDelete={handleDeleteClick}
            onQRDownload={handleQRDownload}
            onDuplicate={handleDuplicate}
            duplicatingId={duplicatingId}
          />
        )}
      </div>

      <Dialog open={deleteDialog.isOpen} onOpenChange={(isOpen) => 
        !isDeleting && setDeleteDialog(prev => ({ ...prev, isOpen }))
      }>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar este vino? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ isOpen: false, wineId: null })}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                'Eliminar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}