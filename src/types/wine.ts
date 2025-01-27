export interface Ingredient {
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
  id: string;
  user_id: string;
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
  optional_labelling?: string | null;
  country_of_origin: string;
  place_of_origin: string;
  winery_information: string;
  instructions_for_use?: string | null;
  conservation_conditions?: string | null;
  drained_weight_grams?: number | null;
  operator_name: string;
  operator_address: string;
  registration_number: string;
  image_url?: string | null;
  created_at?: string;
  updated_at?: string;
  ingredients?: Ingredient[];
  certifications?: Certification[];
  production_variants?: ProductionVariant[];
  disclaimer_icons?: DisclaimerIcon[];
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
  optionalLabelling?: string | null;
  countryOfOrigin: string;
  placeOfOrigin: string;
  wineryInformation: string;
  instructionsForUse?: string | null;
  conservationConditions?: string | null;
  drainedWeightGrams?: number | null;
  operatorName: string;
  operatorAddress: string;
  registrationNumber: string;
  imageUrl?: string | null;
  ingredients: { ingredientName: string; isAllergen: boolean }[];
  productionVariants: { variantName: string }[];
  certifications: { certificationName: string }[];
  disclaimerIcons?: { iconName: string }[];
}