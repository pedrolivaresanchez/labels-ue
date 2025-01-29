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

// Add translations for UI labels
export const uiLabels: Record<string, Record<string, string>> = {
  es: {
    reference: 'Referencia',
    nutritionalInfo: 'Información nutricional',
    additionalDetails: 'Detalles adicionales',
    name: 'Nombre',
    eanCode: 'Código EAN',
    foodName: 'Denominación del alimento',
    ingredients: 'Lista de ingredientes',
    netQuantity: 'Cantidad neta',
    alcohol: 'Alcohol',
    energyValue: 'valor energético',
    fats: 'grasas',
    saturatedFats: 'de las cuales saturadas',
    carbohydrates: 'hidratos de carbono',
    sugars: 'de los cuales azúcares',
    proteins: 'proteínas',
    salt: 'sal',
    countryOfOrigin: 'País de origen',
    placeOfOrigin: 'Lugar de procedencia',
    productionVariants: 'Variantes de producción',
    certifications: 'Certificaciones',
    instructionsForUse: 'Modo de empleo',
    conservationConditions: 'Condiciones de conservación',
    drainedWeight: 'Peso escurrido',
    operatorData: 'Datos del operador',
    operatorName: 'Nombre del operador / importador',
    operatorAddress: 'Dirección del operador / importador',
    registration: 'Registro',
    grams: 'Gramos',
    centiliters: 'Centilitros'
  },
  en: {
    reference: 'Reference',
    nutritionalInfo: 'Nutritional Information',
    additionalDetails: 'Additional Details',
    name: 'Name',
    eanCode: 'EAN Code',
    foodName: 'Food Name',
    ingredients: 'List of Ingredients',
    netQuantity: 'Net Quantity',
    alcohol: 'Alcohol',
    energyValue: 'energy value',
    fats: 'fats',
    saturatedFats: 'of which saturates',
    carbohydrates: 'carbohydrates',
    sugars: 'of which sugars',
    proteins: 'proteins',
    salt: 'salt',
    countryOfOrigin: 'Country of Origin',
    placeOfOrigin: 'Place of Origin',
    productionVariants: 'Production Variants',
    certifications: 'Certifications',
    instructionsForUse: 'Instructions for Use',
    conservationConditions: 'Storage Conditions',
    drainedWeight: 'Drained Weight',
    operatorData: 'Operator Data',
    operatorName: 'Operator / Importer Name',
    operatorAddress: 'Operator / Importer Address',
    registration: 'Registration',
    grams: 'Grams',
    centiliters: 'Centiliters'
  },
  fr: {
    reference: 'Référence',
    nutritionalInfo: 'Information Nutritionnelle',
    additionalDetails: 'Détails Supplémentaires',
    name: 'Nom',
    eanCode: 'Code EAN',
    foodName: 'Dénomination de l\'aliment',
    ingredients: 'Liste des ingrédients',
    netQuantity: 'Quantité nette',
    alcohol: 'Alcool',
    energyValue: 'valeur énergétique',
    fats: 'matières grasses',
    saturatedFats: 'dont acides gras saturés',
    carbohydrates: 'glucides',
    sugars: 'dont sucres',
    proteins: 'protéines',
    salt: 'sel',
    countryOfOrigin: 'Pays d\'origine',
    placeOfOrigin: 'Lieu de provenance',
    productionVariants: 'Variantes de production',
    certifications: 'Certifications',
    instructionsForUse: 'Mode d\'emploi',
    conservationConditions: 'Conditions de conservation',
    drainedWeight: 'Poids égoutté',
    operatorData: 'Données de l\'opérateur',
    operatorName: 'Nom de l\'opérateur / importateur',
    operatorAddress: 'Adresse de l\'opérateur / importateur',
    registration: 'Enregistrement',
    grams: 'Grammes',
    centiliters: 'Centilitres'
  },
  de: {
    reference: 'Referenz',
    nutritionalInfo: 'Nährwertinformation',
    additionalDetails: 'Zusätzliche Details',
    name: 'Name',
    eanCode: 'EAN-Code',
    foodName: 'Lebensmittelbezeichnung',
    ingredients: 'Zutatenliste',
    netQuantity: 'Nettomenge',
    alcohol: 'Alkohol',
    energyValue: 'Energiewert',
    fats: 'Fett',
    saturatedFats: 'davon gesättigte Fettsäuren',
    carbohydrates: 'Kohlenhydrate',
    sugars: 'davon Zucker',
    proteins: 'Eiweiß',
    salt: 'Salz',
    countryOfOrigin: 'Ursprungsland',
    placeOfOrigin: 'Herkunftsort',
    productionVariants: 'Produktionsvarianten',
    certifications: 'Zertifizierungen',
    instructionsForUse: 'Gebrauchsanweisung',
    conservationConditions: 'Aufbewahrungsbedingungen',
    drainedWeight: 'Abtropfgewicht',
    operatorData: 'Betreiberdaten',
    operatorName: 'Name des Betreibers / Importeurs',
    operatorAddress: 'Adresse des Betreibers / Importeurs',
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
    foodName: 'Denominazione dell\'alimento',
    ingredients: 'Lista degli ingredienti',
    netQuantity: 'Quantità netta',
    alcohol: 'Alcol',
    energyValue: 'valore energetico',
    fats: 'grassi',
    saturatedFats: 'di cui acidi grassi saturi',
    carbohydrates: 'carboidrati',
    sugars: 'di cui zuccheri',
    proteins: 'proteine',
    salt: 'sale',
    countryOfOrigin: 'Paese di origine',
    placeOfOrigin: 'Luogo di provenienza',
    productionVariants: 'Varianti di produzione',
    certifications: 'Certificazioni',
    instructionsForUse: 'Istruzioni per l\'uso',
    conservationConditions: 'Condizioni di conservazione',
    drainedWeight: 'Peso sgocciolato',
    operatorData: 'Dati dell\'operatore',
    operatorName: 'Nome dell\'operatore / importatore',
    operatorAddress: 'Indirizzo dell\'operatore / importatore',
    registration: 'Registrazione',
    grams: 'Grammi',
    centiliters: 'Centilitri'
  }
}; 