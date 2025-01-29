import { TranslationServiceClient } from '@google-cloud/translate';
import { NextResponse } from 'next/server';
import { uiLabels } from '@/lib/translate';

const translationClient = new TranslationServiceClient({
  credentials: {
    client_email: process.env.GOOGLE_TRANSLATE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_TRANSLATE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  projectId: process.env.GOOGLE_TRANSLATE_PROJECT_ID,
});

const projectId = process.env.GOOGLE_TRANSLATE_PROJECT_ID!;
const location = 'global';

async function translateText(text: string, targetLanguage: string) {
  if (targetLanguage === 'es') return text;
  if (!text) return text;
  
  try {
    console.log(`Translating text to ${targetLanguage}:`, text);

    const request = {
      parent: `projects/${projectId}/locations/${location}`,
      contents: [text],
      mimeType: 'text/plain',
      sourceLanguageCode: 'es',
      targetLanguageCode: targetLanguage,
    };

    const [response] = await translationClient.translateText(request);
    const translatedText = response.translations?.[0]?.translatedText || text;
    
    console.log('Translation result:', {
      original: text,
      translated: translatedText,
      language: targetLanguage
    });

    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'es';

  console.log('GET /api/translate - Returning labels for language:', lang);

  // Return UI labels for the requested language
  return NextResponse.json({
    labels: uiLabels[lang as keyof typeof uiLabels] || uiLabels.es
  });
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'es';
    
    console.log('POST /api/translate - Processing request for language:', lang);

    const wine = await request.json();

    if (!wine) {
      console.error('No wine data provided');
      return NextResponse.json({ error: 'No wine data provided' }, { status: 400 });
    }

    if (lang === 'es') {
      console.log('Returning original Spanish content');
      return NextResponse.json({ wine, labels: uiLabels.es });
    }

    console.log('Starting translation process for wine:', {
      id: wine.id,
      name: wine.name,
      language: lang
    });

    const translatedWine = { ...wine };

    // Translate basic fields except for specific ones
    // Do not translate: name, operatorName, placeOfOrigin, operatorAddress
    translatedWine.foodName = await translateText(wine.foodName, lang);
    if (wine.instructionsForUse) {
      translatedWine.instructionsForUse = await translateText(wine.instructionsForUse, lang);
    }
    if (wine.conservationConditions) {
      translatedWine.conservationConditions = await translateText(wine.conservationConditions, lang);
    }
    translatedWine.countryOfOrigin = await translateText(wine.countryOfOrigin, lang);
    if (wine.wineryInformation) {
      translatedWine.wineryInformation = await translateText(wine.wineryInformation, lang);
    }

    // Translate ingredients
    if (wine.ingredients?.length > 0) {
      console.log('Translating ingredients:', wine.ingredients);
      translatedWine.ingredients = await Promise.all(
        wine.ingredients.map(async (ingredient: any) => ({
          ...ingredient,
          name: await translateText(ingredient.name, lang),
        }))
      );
    }

    // Translate production variants
    if (wine.productionVariants?.length > 0) {
      console.log('Translating production variants:', wine.productionVariants);
      translatedWine.productionVariants = await Promise.all(
        wine.productionVariants.map(async (variant: any) => ({
          ...variant,
          variantName: await translateText(variant.variantName, lang),
        }))
      );
    }

    // Translate certifications
    if (wine.certifications?.length > 0) {
      console.log('Translating certifications:', wine.certifications);
      translatedWine.certifications = await Promise.all(
        wine.certifications.map(async (cert: any) => ({
          ...cert,
          name: await translateText(cert.name, lang),
        }))
      );
    }

    console.log('Translation completed successfully');

    return NextResponse.json({
      wine: translatedWine,
      labels: uiLabels[lang as keyof typeof uiLabels] || uiLabels.es
    });
  } catch (error) {
    console.error('Translation process failed:', error);
    return NextResponse.json(
      { error: 'Translation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 