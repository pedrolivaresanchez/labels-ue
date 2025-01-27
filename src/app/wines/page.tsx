'use client';

import { useState, useEffect } from 'react';
import { WinesTable } from "@/components/WinesTable";
import { WinesTableSkeleton } from "@/components/WinesTableSkeleton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { generateQRCode } from "@/utils/qr";
import type { Wine } from "@/types/wine";
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
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; wineId: string | null }>({ isOpen: false, wineId: null });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  useEffect(() => {
    const fetchWines = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          router.push('/login');
          return;
        }

        const { data: wines, error } = await supabase
          .from('wines')
          .select(`
            *,
            ingredients (id, wine_id, ingredient_name, is_allergen),
            certifications (id, wine_id, certification_name),
            production_variants (id, wine_id, variant_name),
            disclaimer_icons (id, wine_id, icon_name)
          `)
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setWines(wines || []);
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "Error al cargar las etiquetas",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWines();
  }, [supabase, router, toast]);

  const handleDeleteClick = (id: string) => {
    setDeleteDialog({ isOpen: true, wineId: id });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.wineId) return;
    try {
      setDeletingId(deleteDialog.wineId);
      await fetch(`/api/wines/${deleteDialog.wineId}`, { method: 'DELETE' });
      setWines(prev => prev.filter(wine => wine.id !== deleteDialog.wineId));
      setDeleteDialog({ isOpen: false, wineId: null });
      toast({
        variant: "default",
        title: "¡Éxito!",
        description: "La etiqueta se ha eliminado correctamente",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al eliminar la etiqueta",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleQRDownload = async (wine: Wine) => {
    const qrData = await generateQRCode(wine.id);
    return {
      dataUrl: qrData,
      fileName: `qr-${wine.name.toLowerCase().replace(/\s+/g, '-')}.png`
    };
  };

  const handleDuplicate = async (wine: Wine) => {
    try {
      const response = await fetch(`/api/wines/${wine.id}/duplicate`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Error al duplicar la etiqueta');
      }

      const newWine = await response.json();
      setWines(prev => [newWine, ...prev]);

      toast({
        variant: "default",
        title: "¡Éxito!",
        description: "La etiqueta se ha duplicado correctamente",
      });

      router.refresh();
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ha ocurrido un error al duplicar la etiqueta",
      });
    }
  };

  if (loading) {
    return <WinesTableSkeleton />;
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-8 mb-8">
        <h1 className="text-3xl font-bold">Mis Etiquetas</h1>
        <Button asChild>
          <Link href="/wines/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva Etiqueta
          </Link>
        </Button>
      </div>

      <WinesTable
        data={wines}
        onDelete={handleDeleteClick}
        onQRDownload={handleQRDownload}
        onDuplicate={handleDuplicate}
      />

      <Dialog 
        open={deleteDialog.isOpen} 
        onOpenChange={(open) => !open && setDeleteDialog({ isOpen: false, wineId: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás seguro?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ isOpen: false, wineId: null })}
              disabled={!!deletingId}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={!!deletingId}
            >
              {deletingId === deleteDialog.wineId ? (
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