'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { WineForm } from '@/components/WineForm';
import { Loader2 } from "lucide-react";
import type { Wine } from '@/types/wine';
import { Card, CardContent } from "@/components/ui/card";

interface EditWineClientProps {
  id: string;
}

export function EditWineClient({ id }: EditWineClientProps) {
  const router = useRouter();
  const [wine, setWine] = useState<Wine | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWine = async () => {
      try {
        const response = await fetch(`/api/wines/${id}`);
        if (!response.ok) {
          throw new Error('Wine not found');
        }
        const data = await response.json();
        setWine(data);
      } catch (error) {
        console.error('Error fetching wine:', error);
        router.push('/wines');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWine();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Editar Etiqueta</h1>
            <p className="text-sm text-muted-foreground">Modifica los detalles de tu etiqueta.</p>
          </div>
        </CardContent>
      </Card>
      
      {wine && <WineForm initialData={wine} isEditing={true} />}
    </div>
  );
}