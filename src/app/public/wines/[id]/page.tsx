import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { WinePublicView } from "@/components/wine-public-view";
import { PublicNavbar } from "@/components/public-navbar";
import { getUILabels, translateWine, languageOptions, type SupportedLanguage } from "@/lib/translate";

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

  // Validate the language parameter
  const lang = (searchParams.lang || 'es') as SupportedLanguage;
  const isValidLang = lang in languageOptions;
  const validLang = isValidLang ? lang : 'es';

  // Get translated content
  const translatedWine = await translateWine(wine, validLang);
  const labels = await getUILabels(validLang);

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="mb-4">
          <select 
            className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            onChange={(e) => {
              const newLang = e.target.value;
              const url = new URL(window.location.href);
              url.searchParams.set('lang', newLang);
              window.location.href = url.toString();
            }}
            value={validLang}
          >
            {Object.entries(languageOptions).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <WinePublicView wine={translatedWine} labels={labels} />
      </main>
    </div>
  );
}