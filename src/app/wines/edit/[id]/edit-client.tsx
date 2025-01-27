'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { WineForm } from '@/components/WineForm';
import { Loader2 } from "lucide-react";

type Wine = {
  id: string;
  name: string;
  eanCode: string;
  foodName: string;
  energyKj: number;
  energyKcal: number;
  fat: number;
  saturatedFat: number;
  carbohydrate: number;
  sugars: number;
  protein: number;
  salt: number;
  netQuantityCl: number;
  hasEstimationSign: boolean;
  alcoholPercentage: number;
  optionalLabelling: string | null;
  countryOfOrigin: string;
  placeOfOrigin: string;
  wineryInformation: string;
  instructionsForUse: string | null;
  conservationConditions: string | null;
  drainedWeightGrams: number | null;
  operatorName: string;
  operatorAddress: string;
  registrationNumber: string;
  ingredients: { ingredientName: string; isAllergen: boolean }[];
  productionVariants: { variantName: string }[];
  certifications: { certificationName: string }[];
  disclaimerIcons: { iconName: string }[];
  image_url?: string;
};

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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Editar Etiqueta</h1>
      </div>
      
      {wine && <WineForm initialData={wine} isEditing={true} />}
    </div>
  );
}