import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { WinePublicView } from "@/components/wine-public-view";
import { PublicNavbar } from "@/components/public-navbar";

export type Ingredient = {
  id: string;
  wine_id: string;
  ingredient_name: string;
  is_allergen: boolean;
};

export type ProductionVariant = {
  id: string;
  wine_id: string;
  variant_name: string;
};

export type DisclaimerIcon = {
  id: string;
  wine_id: string;
  icon_name: string;
};

export type Wine = {
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
  alcoholPercentage: number;
  ingredients: { 
    name: string;
    isAllergen: boolean;
  }[];
  productionVariants: { variantName: string }[];
  disclaimerIcons: { iconName: string }[];
  certifications: { name: string }[];
  image_url?: string;
  countryOfOrigin: string;
  placeOfOrigin: string;
  winery_information: string | null;
  instructionsForUse: string | null;
  conservationConditions: string | null;
  drainedWeightGrams: number | null;
  operatorName: string;
  operatorAddress: string;
  registrationNumber: string;
};

async function getWine(id: string): Promise<Wine | null> {
  const { data: wine, error } = await supabase
    .from('wines')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !wine) {
    console.error("[PUBLIC_WINE_GET]", error);
    return null;
  }

  return {
    id: wine.id,
    name: wine.name,
    eanCode: wine.ean_code,
    foodName: wine.food_name,
    energyKj: wine.energy_kj,
    energyKcal: wine.energy_kcal,
    fat: wine.fat,
    saturatedFat: wine.saturated_fat,
    carbohydrate: wine.carbohydrate,
    sugars: wine.sugars,
    protein: wine.protein,
    salt: wine.salt,
    netQuantityCl: wine.net_quantity_cl,
    alcoholPercentage: wine.alcohol_percentage,
    ingredients: wine.ingredients || [],
    productionVariants: wine.production_variants || [],
    disclaimerIcons: wine.disclaimer_icons || [],
    certifications: wine.certifications || [],
    image_url: wine.image_url,
    countryOfOrigin: wine.country_of_origin,
    placeOfOrigin: wine.place_of_origin,
    winery_information: wine.winery_information,
    instructionsForUse: wine.instructions_for_use,
    conservationConditions: wine.conservation_conditions,
    drainedWeightGrams: wine.drained_weight_grams,
    operatorName: wine.operator_name,
    operatorAddress: wine.operator_address,
    registrationNumber: wine.registration_number
  };
}

export const revalidate = 3600; // Revalidate every hour

async function getTranslatedData(wine: Wine, lang: string) {
  const baseUrl = process.env.VERCEL_URL ? 
    `https://${process.env.VERCEL_URL}` : 
    'http://localhost:3000';

  const response = await fetch(`${baseUrl}/api/translate?lang=${lang}`, {
    method: 'POST',
    body: JSON.stringify(wine),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    console.error('Translation failed:', await response.text());
    return { wine, labels: {} };
  }

  return response.json();
}

export default async function PublicWineViewPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { lang?: string };
}) {
  const wine = await getWine(params.id);

  if (!wine) {
    notFound();
  }

  const lang = searchParams.lang || 'es';
  const { wine: translatedWine, labels } = await getTranslatedData(wine, lang);

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <WinePublicView wine={translatedWine} labels={labels} />
      </main>
    </div>
  );
}