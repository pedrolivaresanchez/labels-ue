import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { WinePublicView } from "@/components/wine-public-view";
import { PublicNavbar } from "@/components/public-navbar";
import { uiLabels } from "@/lib/translate";
import { TranslationServiceClient } from '@google-cloud/translate';

// Initialize translation client
const translationClient = new TranslationServiceClient({
  credentials: {
    client_email: process.env.GOOGLE_TRANSLATE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_TRANSLATE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  projectId: process.env.GOOGLE_TRANSLATE_PROJECT_ID,
});

const projectId = process.env.GOOGLE_TRANSLATE_PROJECT_ID!;
const location = 'global';

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

async function translateText(text: string, targetLanguage: string) {
  if (targetLanguage === 'es') return text;
  if (!text) return text;
  
  try {
    const request = {
      parent: `projects/${projectId}/locations/${location}`,
      contents: [text],
      mimeType: 'text/plain',
      sourceLanguageCode: 'es',
      targetLanguageCode: targetLanguage,
    };

    const [response] = await translationClient.translateText(request);
    return response.translations?.[0]?.translatedText || text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}

async function translateWine(wine: Wine, targetLanguage: string) {
  if (targetLanguage === 'es') return wine;

  const translatedWine = { ...wine };

  // Translate basic fields except for specific ones
  // Do not translate: name, operatorName, placeOfOrigin, operatorAddress
  translatedWine.foodName = await translateText(wine.foodName, targetLanguage);
  if (wine.instructionsForUse) {
    translatedWine.instructionsForUse = await translateText(wine.instructionsForUse, targetLanguage);
  }
  if (wine.conservationConditions) {
    translatedWine.conservationConditions = await translateText(wine.conservationConditions, targetLanguage);
  }
  translatedWine.countryOfOrigin = await translateText(wine.countryOfOrigin, targetLanguage);
  if (wine.winery_information) {
    translatedWine.winery_information = await translateText(wine.winery_information, targetLanguage);
  }

  // Translate ingredients
  if (wine.ingredients?.length > 0) {
    translatedWine.ingredients = await Promise.all(
      wine.ingredients.map(async (ingredient) => ({
        ...ingredient,
        name: await translateText(ingredient.name, targetLanguage),
      }))
    );
  }

  // Translate production variants
  if (wine.productionVariants?.length > 0) {
    translatedWine.productionVariants = await Promise.all(
      wine.productionVariants.map(async (variant) => ({
        ...variant,
        variantName: await translateText(variant.variantName, targetLanguage),
      }))
    );
  }

  // Translate certifications
  if (wine.certifications?.length > 0) {
    translatedWine.certifications = await Promise.all(
      wine.certifications.map(async (cert) => ({
        ...cert,
        name: await translateText(cert.name, targetLanguage),
      }))
    );
  }

  return translatedWine;
}

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

  const lang = searchParams.lang || 'es';
  const translatedWine = await translateWine(wine, lang);
  const labels = uiLabels[lang as keyof typeof uiLabels] || uiLabels.es;

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <WinePublicView wine={translatedWine} labels={labels} />
      </main>
    </div>
  );
}