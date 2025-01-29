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

export type Labels = {
  reference: string;
  nutritionalInfo: string;
  additionalDetails: string;
  name: string;
  eanCode: string;
  foodName: string;
  ingredients: string;
  netQuantity: string;
  alcohol: string;
  energyValue: string;
  fats: string;
  saturatedFats: string;
  carbohydrates: string;
  sugars: string;
  proteins: string;
  salt: string;
  countryOfOrigin: string;
  placeOfOrigin: string;
  productionVariants: string;
  certifications: string;
  instructionsForUse: string;
  conservationConditions: string;
  drainedWeight: string;
  operatorData: string;
  operatorName: string;
  operatorAddress: string;
  registration: string;
  grams: string;
  centiliters: string;
}

export const languageOptions = {
  es: 'Español',
  ca: 'Català/Valencià',
  eu: 'Euskara',
  gl: 'Galego',
  bg: 'Български',
  cs: 'Čeština',
  da: 'Dansk',
  de: 'Deutsch',
  el: 'Ελληνικά',
  en: 'English',
  et: 'Eesti keel',
  fi: 'Suomi',
  fr: 'Français',
  ga: 'Gaeilge',
  hr: 'Hrvatski',
  it: 'Italiano',
  lv: 'Latviešu valoda',
  lt: 'Lietuvių kalba',
  hu: 'Magyar',
  mt: 'Malti',
  nl: 'Nederlands',
  pl: 'Polski',
  pt: 'Português',
  ro: 'Română',
  sk: 'Slovenčina',
  sl: 'Slovenščina',
  sv: 'Svenska'
};

export type SupportedLanguage = keyof typeof languageOptions;

export const uiLabels: Partial<Record<SupportedLanguage, Labels>> = {
  es: {
    reference: 'Referencia',
    nutritionalInfo: 'Información nutricional',
    additionalDetails: 'Detalles adicionales',
    name: 'Nombre',
    eanCode: 'Código EAN',
    foodName: 'Nombre del alimento',
    ingredients: 'Ingredientes',
    netQuantity: 'Cantidad neta',
    alcohol: 'Alcohol',
    energyValue: 'Valor energético',
    fats: 'Grasas',
    saturatedFats: 'Grasas saturadas',
    carbohydrates: 'Carbohidratos',
    sugars: 'Azúcares',
    proteins: 'Proteínas',
    salt: 'Sal',
    countryOfOrigin: 'País de origen',
    placeOfOrigin: 'Lugar de origen',
    productionVariants: 'Variantes de producción',
    certifications: 'Certificaciones',
    instructionsForUse: 'Instrucciones de uso',
    conservationConditions: 'Condiciones de conservación',
    drainedWeight: 'Peso escurrido',
    operatorData: 'Datos del operador',
    operatorName: 'Nombre del operador',
    operatorAddress: 'Dirección del operador',
    registration: 'Registro',
    grams: 'gramos',
    centiliters: 'centilitros'
  },
  en: {
    reference: 'Reference',
    nutritionalInfo: 'Nutritional Information',
    additionalDetails: 'Additional Details',
    name: 'Name',
    eanCode: 'EAN Code',
    foodName: 'Food Name',
    ingredients: 'Ingredients',
    netQuantity: 'Net Quantity',
    alcohol: 'Alcohol',
    energyValue: 'Energy Value',
    fats: 'Fats',
    saturatedFats: 'Saturated Fats',
    carbohydrates: 'Carbohydrates',
    sugars: 'Sugars',
    proteins: 'Proteins',
    salt: 'Salt',
    countryOfOrigin: 'Country of Origin',
    placeOfOrigin: 'Place of Origin',
    productionVariants: 'Production Variants',
    certifications: 'Certifications',
    instructionsForUse: 'Instructions for Use',
    conservationConditions: 'Conservation Conditions',
    drainedWeight: 'Drained Weight',
    operatorData: 'Operator Data',
    operatorName: 'Operator Name',
    operatorAddress: 'Operator Address',
    registration: 'Registration',
    grams: 'grams',
    centiliters: 'centiliters'
  },
  fr: {
    reference: 'Référence',
    nutritionalInfo: 'Information Nutritionnelle',
    additionalDetails: 'Détails Supplémentaires',
    name: 'Nom',
    eanCode: 'Code EAN',
    foodName: 'Nom de l\'aliment',
    ingredients: 'Ingrédients',
    netQuantity: 'Quantité Nette',
    alcohol: 'Alcool',
    energyValue: 'Valeur Énergétique',
    fats: 'Matières grasses',
    saturatedFats: 'Acides gras saturés',
    carbohydrates: 'Glucides',
    sugars: 'Sucres',
    proteins: 'Protéines',
    salt: 'Sel',
    countryOfOrigin: 'Pays d\'origine',
    placeOfOrigin: 'Lieu d\'origine',
    productionVariants: 'Variantes de Production',
    certifications: 'Certifications',
    instructionsForUse: 'Mode d\'emploi',
    conservationConditions: 'Conditions de Conservation',
    drainedWeight: 'Poids égoutté',
    operatorData: 'Données de l\'opérateur',
    operatorName: 'Nom de l\'opérateur',
    operatorAddress: 'Adresse de l\'opérateur',
    registration: 'Enregistrement',
    grams: 'grammes',
    centiliters: 'centilitres'
  },
  de: {
    reference: 'Referenz',
    nutritionalInfo: 'Nährwertinformationen',
    additionalDetails: 'Zusätzliche Details',
    name: 'Name',
    eanCode: 'EAN-Code',
    foodName: 'Lebensmittelname',
    ingredients: 'Zutaten',
    netQuantity: 'Nettomenge',
    alcohol: 'Alkohol',
    energyValue: 'Energiewert',
    fats: 'Fette',
    saturatedFats: 'Gesättigte Fettsäuren',
    carbohydrates: 'Kohlenhydrate',
    sugars: 'Zucker',
    proteins: 'Proteine',
    salt: 'Salz',
    countryOfOrigin: 'Herkunftsland',
    placeOfOrigin: 'Herkunftsort',
    productionVariants: 'Produktionsvarianten',
    certifications: 'Zertifizierungen',
    instructionsForUse: 'Gebrauchsanweisung',
    conservationConditions: 'Aufbewahrungsbedingungen',
    drainedWeight: 'Abtropfgewicht',
    operatorData: 'Betreiberdaten',
    operatorName: 'Name des Betreibers',
    operatorAddress: 'Adresse des Betreibers',
    registration: 'Registrierung',
    grams: 'Gramm',
    centiliters: 'Zentiliter'
  },
  it: {
    reference: 'Riferimento',
    nutritionalInfo: 'Informazioni Nutrizionali',
    additionalDetails: 'Dettagli Aggiuntivi',
    name: 'Nome',
    eanCode: 'Codice EAN',
    foodName: 'Nome dell\'alimento',
    ingredients: 'Ingredienti',
    netQuantity: 'Quantità Netta',
    alcohol: 'Alcol',
    energyValue: 'Valore Energetico',
    fats: 'Grassi',
    saturatedFats: 'Acidi grassi saturi',
    carbohydrates: 'Carboidrati',
    sugars: 'Zuccheri',
    proteins: 'Proteine',
    salt: 'Sale',
    countryOfOrigin: 'Paese di origine',
    placeOfOrigin: 'Luogo di origine',
    productionVariants: 'Varianti di Produzione',
    certifications: 'Certificazioni',
    instructionsForUse: 'Istruzioni per l\'uso',
    conservationConditions: 'Condizioni di Conservazione',
    drainedWeight: 'Peso sgocciolato',
    operatorData: 'Dati dell\'operatore',
    operatorName: 'Nome dell\'operatore',
    operatorAddress: 'Indirizzo dell\'operatore',
    registration: 'Registrazione',
    grams: 'grammi',
    centiliters: 'centilitri'
  },
  bg: {} as Labels,
  ca: {} as Labels,
  cs: {} as Labels,
  da: {} as Labels,
  el: {} as Labels,
  et: {} as Labels,
  eu: {} as Labels,
  fi: {} as Labels,
  ga: {} as Labels,
  gl: {} as Labels,
  hr: {} as Labels,
  hu: {} as Labels,
  lt: {} as Labels,
  lv: {} as Labels,
  mt: {} as Labels,
  nl: {} as Labels,
  pl: {} as Labels,
  pt: {} as Labels,
  ro: {} as Labels,
  sk: {} as Labels,
  sl: {} as Labels,
  sv: {} as Labels,
};

export async function translateText(text: string, targetLanguage: SupportedLanguage) {
  if (targetLanguage === 'es' || !text) return text;
  
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

export async function translateWine(wine: any, targetLanguage: SupportedLanguage) {
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
  if (wine.wineryInformation) {
    translatedWine.wineryInformation = await translateText(wine.wineryInformation, targetLanguage);
  }

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

  // Translate certifications
  if (wine.certifications?.length > 0) {
    translatedWine.certifications = await Promise.all(
      wine.certifications.map(async (cert: any) => ({
        ...cert,
        name: await translateText(cert.name, targetLanguage),
      }))
    );
  }

  return translatedWine;
}

export async function getUILabels(targetLanguage: SupportedLanguage): Promise<Labels> {
  if (Object.keys(uiLabels[targetLanguage] || {}).length > 0) {
    return uiLabels[targetLanguage] as Labels;
  }

  const spanishLabels = uiLabels.es as Labels;
  const translatedLabels: Partial<Labels> = {};

  for (const [key, value] of Object.entries(spanishLabels)) {
    translatedLabels[key as keyof Labels] = await translateText(value, targetLanguage);
  }

  return translatedLabels as Labels;
} 