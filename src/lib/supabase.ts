import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('Supabase environment variables are missing. Using fallback values for development.');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Type definitions for our database schema
export type UUID = string;

export type Wine = {
  id: UUID;
  created_at: string;
  updated_at: string;
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
  optional_labelling?: string;
  country_of_origin: string;
  place_of_origin: string;
  winery_information: string;
  instructions_for_use?: string;
  conservation_conditions?: string;
  drained_weight_grams?: number;
  operator_name: string;
  operator_address: string;
  registration_number: string;
  ingredients: Ingredient[];
  production_variants: ProductionVariant[];
  certifications: Certification[];
  disclaimer_icons: DisclaimerIcon[];
};

export type Ingredient = {
  id: UUID;
  wine_id: UUID;
  ingredient_name: string;
  is_allergen: boolean;
};

export type ProductionVariant = {
  id: UUID;
  wine_id: UUID;
  variant_name: string;
};

export type Certification = {
  id: UUID;
  wine_id: UUID;
  certification_name: string;
};

export type DisclaimerIcon = {
  id: UUID;
  wine_id: UUID;
  icon_name: string;
};