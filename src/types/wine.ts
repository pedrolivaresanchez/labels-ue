export interface Ingredient {
  isAllergen: any;
  id?: string;
  wine_id?: string;
  ingredient_name: string;
  is_allergen: boolean;
}

export interface ProductionVariant {
  id?: string;
  wine_id?: string;
  variant_name: string;
}

export interface Certification {
  certificationName: any;
  id?: string;
  wine_id?: string;
  certification_name: string;
}

export interface DisclaimerIcon {
  id?: string;
  wine_id?: string;
  icon_name: string;
}

export interface Wine {
  id?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  name: string;
  ean_code: string;
  food_name: string;
  energy_kj: number;
  energy_kcal: number;
  fat: number;
  saturated_fat: number;
  carbohydrate: number;
  sugars: number;
  protein: number;
  salt: number;
  net_quantity_cl: number;
  has_estimation_sign: boolean;
  alcohol_percentage: number;
  optional_labelling: string | null;
  country_of_origin: string;
  place_of_origin: string;
  winery_information?: string | null;
  instructions_for_use: string | null;
  conservation_conditions: string | null;
  drained_weight_grams: number | null;
  operator_name: string;
  operator_address: string;
  registration_number: string;
  image_url: string | null;
  ingredients: Array<{
    name: string;
    isAllergen: boolean;
  }>;
  productionVariants: Array<{
    variantName: string;
  }>;
  certifications: Array<{
    certificationName: string;
    description?: string;
  }>;
  production_variants?: Array<{
    variant_name: string;
  }>;
  disclaimer_icons?: Array<{ icon_name: string }>;
}

export interface WineFormData {
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
  optionalLabelling: string;
  countryOfOrigin: string;
  placeOfOrigin: string;
  wineryInformation?: string | null;
  instructionsForUse: string;
  conservationConditions: string;
  drainedWeightGrams: number;
  operatorName: string;
  operatorAddress: string;
  registrationNumber: string;
  imageUrl: string | null;
  ingredients: Array<{
    name: string;
    isAllergen: boolean;
  }>;
  productionVariants: Array<{
    variantName: string;
  }>;
  certifications: Array<{
    certificationName: string;
  }>;
}