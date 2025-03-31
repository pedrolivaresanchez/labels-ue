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
  hasEstimationSign: boolean;
  ingredients: { 
    name: string;
    isAllergen: boolean;
  }[];
  productionVariants: { variantName: string }[];
  disclaimerIcons: { iconName: string }[];
  certifications: Array<{
    certificationName: string;
    description?: string;
  }>;
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
  optional_labelling: string | null;
  has_glass_bottle: boolean;
  has_brown_glass_bottle: boolean;
  has_green_glass_bottle: boolean;
  has_paper_label: boolean;
  has_plastic_label: boolean;
  has_aluminum_cap: boolean;
  has_pvc_cap: boolean;
  has_polystyrene_cap: boolean;
  has_cork_stopper: boolean;
  has_plastic_cork: boolean;
  has_cardboard_box: boolean;
  has_plastic_wrapper: boolean;
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
        certificationName: await translateText(cert.certificationName, targetLanguage),
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
    hasEstimationSign: wine.has_estimation_sign,
    ingredients: Array.isArray(wine.ingredients) 
      ? wine.ingredients.map((i: any) => ({
          name: i.ingredient_name || i.name,
          isAllergen: i.is_allergen !== undefined ? i.is_allergen : i.isAllergen
        })) 
      : [],
    productionVariants: Array.isArray(wine.production_variants) 
      ? wine.production_variants.map((v: any) => ({
          variantName: v.variant_name || v.variantName
        })) 
      : [],
    certifications: Array.isArray(wine.certifications) 
      ? wine.certifications
          .filter((c: any) => c && (c.certification_name || c.certificationName))
          .map((c: any) => ({
            certificationName: c.certification_name || c.certificationName
          })) 
      : [],
    disclaimerIcons: [], // No hay tabla disclaimer_icons
    image_url: wine.image_url,
    countryOfOrigin: wine.country_of_origin,
    placeOfOrigin: wine.place_of_origin,
    winery_information: wine.winery_information,
    instructionsForUse: wine.instructions_for_use,
    conservationConditions: wine.conservation_conditions,
    drainedWeightGrams: wine.drained_weight_grams,
    operatorName: wine.operator_name,
    operatorAddress: wine.operator_address,
    registrationNumber: wine.registration_number,
    optional_labelling: wine.optional_labelling,
    has_glass_bottle: wine.has_glass_bottle || false,
    has_brown_glass_bottle: wine.has_brown_glass_bottle || false,
    has_green_glass_bottle: wine.has_green_glass_bottle || false,
    has_paper_label: wine.has_paper_label || false,
    has_plastic_label: wine.has_plastic_label || false,
    has_aluminum_cap: wine.has_aluminum_cap || false,
    has_pvc_cap: wine.has_pvc_cap || false,
    has_polystyrene_cap: wine.has_polystyrene_cap || false,
    has_cork_stopper: wine.has_cork_stopper || false,
    has_plastic_cork: wine.has_plastic_cork || false,
    has_cardboard_box: wine.has_cardboard_box || false,
    has_plastic_wrapper: wine.has_plastic_wrapper || false
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