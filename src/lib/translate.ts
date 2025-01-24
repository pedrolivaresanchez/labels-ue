import { TranslationServiceClient } from '@google-cloud/translate';

const translationClient = new TranslationServiceClient({
  credentials: {
    client_email: process.env.GOOGLE_TRANSLATE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_TRANSLATE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  projectId: process.env.GOOGLE_TRANSLATE_PROJECT_ID,
});

const projectId = process.env.GOOGLE_TRANSLATE_PROJECT_ID!;
const location = 'global';

export async function translateText(text: string, targetLanguage: string) {
  if (targetLanguage === 'es') return text;
  
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

export async function translateWine(wine: any, targetLanguage: string) {
  if (targetLanguage === 'es') return wine;

  const translatedWine = { ...wine };

  // Translate basic fields
  translatedWine.name = await translateText(wine.name, targetLanguage);
  translatedWine.foodName = await translateText(wine.foodName, targetLanguage);
  if (wine.instructionsForUse) {
    translatedWine.instructionsForUse = await translateText(wine.instructionsForUse, targetLanguage);
  }
  if (wine.conservationConditions) {
    translatedWine.conservationConditions = await translateText(wine.conservationConditions, targetLanguage);
  }
  translatedWine.countryOfOrigin = await translateText(wine.countryOfOrigin, targetLanguage);
  translatedWine.placeOfOrigin = await translateText(wine.placeOfOrigin, targetLanguage);

  // Translate ingredients
  if (wine.ingredients?.length > 0) {
    translatedWine.ingredients = await Promise.all(
      wine.ingredients.map(async (ingredient: any) => ({
        ...ingredient,
        name: await translateText(ingredient.name, targetLanguage),
      }))
    );
  }

  // Translate production variants
  if (wine.productionVariants?.length > 0) {
    translatedWine.productionVariants = await Promise.all(
      wine.productionVariants.map(async (variant: any) => ({
        ...variant,
        variantName: await translateText(variant.variantName, targetLanguage),
      }))
    );
  }

  return translatedWine;
} 