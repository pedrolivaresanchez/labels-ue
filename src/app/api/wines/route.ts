import { NextResponse } from "next/server";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

type Ingredient = {
  id: string;
  name: string;
  is_allergen: boolean;
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
  optionalLabelling: string | null;
  countryOfOrigin: string;
  placeOfOrigin: string;
  wineryInformation: string;
  instructionsForUse: string | null;
  conservationConditions: string | null;
  drainedWeightGrams: number | null;
  operatorName: string;
  operatorAddress: string;
  registrationNumber: string;
  ingredients: { ingredientName: string; isAllergen: boolean }[];
  productionVariants: { variantName: string }[];
  certifications: { certificationName: string }[];
  disclaimerIcons: { iconName: string }[];
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
      ean_code: body.eanCode || 'N/A',
      food_name: body.foodName,
      energy_kj: body.energyKj,
      energy_kcal: body.energyKcal,
      fat: body.fat,
      saturated_fat: body.saturatedFat,
      carbohydrate: body.carbohydrate,
      sugars: body.sugars,
      protein: body.protein,
      salt: body.salt,
      net_quantity_cl: body.netQuantityCl,
      has_estimation_sign: body.hasEstimationSign,
      alcohol_percentage: body.alcoholPercentage,
      optional_labelling: body.optionalLabelling,
      country_of_origin: body.countryOfOrigin,
      place_of_origin: body.placeOfOrigin,
      winery_information: body.wineryInformation,
      instructions_for_use: body.instructionsForUse,
      conservation_conditions: body.conservationConditions,
      drained_weight_grams: body.drainedWeightGrams,
      operator_name: body.operatorName,
      operator_address: body.operatorAddress,
      registration_number: body.registrationNumber
    };

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

    // Handle ingredients
    if (body.ingredients?.length > 0) {
      const ingredients = body.ingredients
        .filter(i => i && i.ingredientName && typeof i.ingredientName === 'string' && typeof i.isAllergen === 'boolean')
        .map(i => ({
          wine_id: wine.id,
          ingredient_name: i.ingredientName,
          is_allergen: i.isAllergen
        }));

      if (ingredients.length > 0) {
        const { error: ingredientsError } = await supabase
          .from('ingredients')
          .insert(ingredients);

        if (ingredientsError) {
          console.error("[INGREDIENTS_CREATE]", ingredientsError);
        }
      }
    }

    // Handle production variants
    if (body.productionVariants?.length > 0) {
      const variants = body.productionVariants
        .filter(v => v?.variantName && typeof v.variantName === 'string')
        .map(v => ({
          wine_id: wine.id,
          variant_name: v.variantName
        }));

      if (variants.length > 0) {
        const { error: variantsError } = await supabase
          .from('production_variants')
          .insert(variants);

        if (variantsError) {
          console.error("[VARIANTS_CREATE]", variantsError);
        }
      }
    }

    // Handle certifications
    if (body.certifications?.length > 0) {
      const certifications = body.certifications
        .filter(c => c?.certificationName && typeof c.certificationName === 'string')
        .map(c => ({
          wine_id: wine.id,
          certification_name: c.certificationName
        }));

      if (certifications.length > 0) {
        const { error: certificationsError } = await supabase
          .from('certifications')
          .insert(certifications);

        if (certificationsError) {
          console.error("[CERTIFICATIONS_CREATE]", certificationsError);
        }
      }
    }

    // Handle disclaimer icons
    if (body.disclaimerIcons?.length > 0) {
      const icons = body.disclaimerIcons
        .filter(d => d?.iconName && typeof d.iconName === 'string')
        .map(d => ({
          wine_id: wine.id,
          icon_name: d.iconName
        }));

      if (icons.length > 0) {
        const { error: iconsError } = await supabase
          .from('disclaimer_icons')
          .insert(icons);

        if (iconsError) {
          console.error("[ICONS_CREATE]", iconsError);
        }
      }
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