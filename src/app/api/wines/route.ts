import { NextResponse } from "next/server";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

type Ingredient = {
  id?: string;
  name?: string;
  isAllergen?: boolean;
  ingredientName?: string;
  is_allergen?: boolean;
};

type ProductionVariant = {
  id: string;
  variant_name: string;
};

type Certification = {
  id: string;
  certification_name: string;
};

type DisclaimerIcon = {
  id: string;
  icon_name: string;
};

type Wine = {
  id: string;
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
  instructions_for_use: string | null;
  conservation_conditions: string | null;
  drained_weight_grams: number | null;
  operator_name: string;
  operator_address: string;
  registration_number: string;
  image_url: string | null;
  ingredients: Ingredient[];
  production_variants: ProductionVariant[];
  certifications: Certification[];
  disclaimer_icons: DisclaimerIcon[];
};

type WineFormData = {
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
  winery_information: string;
  instructions_for_use: string | null;
  conservation_conditions: string | null;
  drained_weight_grams: number | null;
  operator_name: string;
  operator_address: string;
  registration_number: string;
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
  image_url: string | null;
  ingredients: Ingredient[];
  productionVariants: { variantName: string }[];
  certifications: { certificationName: string }[];
};

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ 
      cookies: () => cookieStore 
    });

    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json() as WineFormData;

    // Transform camelCase to snake_case and add user_id
    const wineData = {
      user_id: session.user.id,
      name: body.name,
      ean_code: body.ean_code,
      food_name: body.food_name,
      energy_kj: body.energy_kj,
      energy_kcal: body.energy_kcal,
      fat: body.fat,
      saturated_fat: body.saturated_fat,
      carbohydrate: body.carbohydrate,
      sugars: body.sugars,
      protein: body.protein,
      salt: body.salt,
      net_quantity_cl: body.net_quantity_cl,
      has_estimation_sign: body.has_estimation_sign,
      alcohol_percentage: body.alcohol_percentage,
      optional_labelling: body.optional_labelling,
      country_of_origin: body.country_of_origin,
      place_of_origin: body.place_of_origin,
      winery_information: body.winery_information,
      instructions_for_use: body.instructions_for_use,
      conservation_conditions: body.conservation_conditions,
      drained_weight_grams: body.drained_weight_grams,
      operator_name: body.operator_name,
      operator_address: body.operator_address,
      registration_number: body.registration_number,
      has_glass_bottle: body.has_glass_bottle,
      has_brown_glass_bottle: body.has_brown_glass_bottle,
      has_green_glass_bottle: body.has_green_glass_bottle,
      has_paper_label: body.has_paper_label,
      has_plastic_label: body.has_plastic_label,
      has_aluminum_cap: body.has_aluminum_cap,
      has_pvc_cap: body.has_pvc_cap,
      has_polystyrene_cap: body.has_polystyrene_cap,
      has_cork_stopper: body.has_cork_stopper,
      has_plastic_cork: body.has_plastic_cork,
      has_cardboard_box: body.has_cardboard_box,
      has_plastic_wrapper: body.has_plastic_wrapper,
      image_url: body.image_url,
      // Add JSONB fields
      ingredients: body.ingredients && Array.isArray(body.ingredients) ? 
        body.ingredients.map(i => ({
          ingredient_name: i.ingredientName || i.name,
          is_allergen: i.isAllergen !== undefined ? i.isAllergen : (i.is_allergen || false)
        })) : [],
      production_variants: body.productionVariants && Array.isArray(body.productionVariants) ?
        body.productionVariants.map(v => ({
          variant_name: v.variantName
        })) : [],
      certifications: body.certifications && Array.isArray(body.certifications) ?
        body.certifications.map(c => ({
          certificationName: c.certificationName
        })) : []
    };

    console.log("Ingredients to save:", wineData.ingredients);
    console.log("Certifications to save:", wineData.certifications);

    // Insert the wine
    const { data: wine, error: wineError } = await supabase
      .from('wines')
      .insert(wineData)
      .select()
      .single();

    if (wineError) {
      console.error("[WINE_CREATE]", wineError);
      return new NextResponse("Error creating wine", { status: 400 });
    }

    return NextResponse.json(wine);
  } catch (error) {
    console.error("[WINE_CREATE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ 
      cookies: () => cookieStore 
    });

    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get wines filtered by user_id
    const { data: wines, error } = await supabase
      .from('wines')
      .select(`
        *,
        ingredients (
          id,
          name,
          is_allergen
        ),
        production_variants (
          id,
          variant_name
        ),
        certifications (
          id,
          certification_name
        ),
        disclaimer_icons (
          id,
          icon_name
        )
      `)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Transform the data
    const transformedWines = wines.map((wine: Wine) => ({
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
      hasEstimationSign: wine.has_estimation_sign,
      alcoholPercentage: wine.alcohol_percentage,
      optionalLabelling: wine.optional_labelling,
      countryOfOrigin: wine.country_of_origin,
      placeOfOrigin: wine.place_of_origin,
      instructionsForUse: wine.instructions_for_use,
      conservationConditions: wine.conservation_conditions,
      drainedWeightGrams: wine.drained_weight_grams,
      operatorName: wine.operator_name,
      operatorAddress: wine.operator_address,
      registrationNumber: wine.registration_number,
      imageUrl: wine.image_url,
      ingredients: wine.ingredients?.map((ingredient: Ingredient) => ({
        id: ingredient.id,
        ingredientName: ingredient.name,
        isAllergen: ingredient.is_allergen
      })) || [],
      productionVariants: wine.production_variants?.map((variant: ProductionVariant) => ({
        id: variant.id,
        variantName: variant.variant_name
      })) || [],
      certifications: wine.certifications?.map((cert: Certification) => ({
        id: cert.id,
        certificationName: cert.certification_name
      })) || [],
      disclaimerIcons: wine.disclaimer_icons?.map((icon: DisclaimerIcon) => ({
        id: icon.id,
        iconName: icon.icon_name
      })) || []
    }));

    return NextResponse.json(transformedWines);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error al obtener los vinos' },
      { status: 500 }
    );
  }
}