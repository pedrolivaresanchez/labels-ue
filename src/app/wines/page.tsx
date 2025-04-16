'use client';

import { useState, useEffect } from 'react';
import { WinesTable } from "@/components/WinesTable";
import { WinesTableSkeleton } from "@/components/WinesTableSkeleton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { generateQRCode, QRFormat } from "@/utils/qr";
import type { Wine } from "@/types/wine";
import Link from "next/link";
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { QRFormatDialog } from "@/components/QRFormatDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

export default function WinesPage() {
  const [wines, setWines] = useState<Wine[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; wineId: string | null }>({ isOpen: false, wineId: null });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [qrDialog, setQrDialog] = useState<{ isOpen: boolean; wine: Wine | null }>({ isOpen: false, wine: null });
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
          .select('*')
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

  const handleQRClick = (wine: Wine) => {
    setQrDialog({ isOpen: true, wine });
  };

  const handleQRDownload = async (format: QRFormat) => {
    if (!qrDialog.wine?.id) return;
    
    try {
      // Generar el QR en el formato seleccionado
      const dataUrl = await generateQRCode(qrDialog.wine.id, format);
      
      // Crear el nombre de archivo basado en el nombre del vino y el formato
      const fileExtension = format === 'png' ? 'png' : format === 'svg' ? 'svg' : 'pdf';
      const fileName = `qr-${qrDialog.wine.name.toLowerCase().replace(/\s+/g, '-')}.${fileExtension}`;
      
      // Crear un enlace temporal y simular clic para descargar
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        variant: "default",
        title: "¡Éxito!",
        description: `El código QR se ha descargado en formato ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Error descargando QR:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al descargar el código QR",
      });
    }
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
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Mis Etiquetas</h1>
              <p className="text-sm text-muted-foreground mt-1">Gestiona tus etiquetas de vino</p>
            </div>
            <Link href="/wines/new" className="sm:flex-shrink-0">
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Etiqueta
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <WinesTable
        data={wines}
        onDelete={handleDeleteClick}
        onQRDownload={handleQRClick}
        onDuplicate={handleDuplicate}
      />

      <Dialog open={deleteDialog.isOpen} onOpenChange={(open) => setDeleteDialog({ isOpen: open, wineId: null })}>
        <DialogContent className="sm:max-w-[425px] p-6 gap-6">
          <DialogHeader>
            <DialogTitle>¿Estás seguro?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. La etiqueta será eliminada permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ isOpen: false, wineId: null })}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={!!deletingId}
              className="w-full sm:w-auto"
            >
              {deletingId ? (
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

      <QRFormatDialog 
        open={qrDialog.isOpen}
        onOpenChange={(open) => setQrDialog({ isOpen: open, wine: open ? qrDialog.wine : null })}
        onDownload={handleQRDownload}
      />
    </>
  );
}