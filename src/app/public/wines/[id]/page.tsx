import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import { WinePublicView } from "@/components/wine-public-view";
import { PublicNavbar } from "@/components/public-navbar";
import { translateWine } from "@/lib/translate";

// Create a single supabase client for interacting with your database
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
  ingredients: { name: string }[];
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
    .select(`
      *,
      ingredients (
        id, wine_id, ingredient_name, is_allergen
      ),
      production_variants (
        id, wine_id, variant_name
      ),
      disclaimer_icons (
        id, wine_id, icon_name
      )
    `)
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
    ingredients: wine.ingredients?.map((i: Ingredient) => ({
      name: i.ingredient_name
    })) || [],
    productionVariants: wine.production_variants?.map((v: ProductionVariant) => ({
      variantName: v.variant_name
    })) || [],
    disclaimerIcons: wine.disclaimer_icons?.map((d: DisclaimerIcon) => ({
      iconName: d.icon_name
    })) || [],
    certifications: [],
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

  // Translate the wine data if a language is specified
  const translatedWine = await translateWine(wine, searchParams.lang || 'es');

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <WinePublicView wine={translatedWine} />
      </main>
    </div>
  );
} 