import { NextResponse } from "next/server";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Wine } from "@/types/wine";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return new NextResponse("Wine id is required", { status: 400 });
    }

    // Solo necesitamos una consulta porque los ingredientes, variantes y certificaciones
    // son campos JSONB en la tabla wines
    const { data: wine, error } = await supabase
      .from('wines')
      .select('*')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single();

    if (error || !wine) {
      console.error("[WINE_GET] Error:", error);
      return new NextResponse("Not found", { status: 404 });
    }

    // Transform the relations to the expected format but keep original properties
    const transformedWine = {
      ...wine,
      // Add camelCase aliases
      eanCode: wine.ean_code,
      foodName: wine.food_name,
      energyKj: wine.energy_kj,
      energyKcal: wine.energy_kcal,
      saturatedFat: wine.saturated_fat,
      netQuantityCl: wine.net_quantity_cl,
      alcoholPercentage: wine.alcohol_percentage,
      optionalLabelling: wine.optional_labelling,
      countryOfOrigin: wine.country_of_origin, 
      placeOfOrigin: wine.place_of_origin,
      operatorName: wine.operator_name,
      operatorAddress: wine.operator_address,
      registrationNumber: wine.registration_number,
      hasEstimationSign: wine.has_estimation_sign,
      drainedWeightGrams: wine.drained_weight_grams,
      instructionsForUse: wine.instructions_for_use,
      conservationConditions: wine.conservation_conditions,
    };

    // Transformar el campo JSONB ingredients
    if (wine.ingredients && Array.isArray(wine.ingredients)) {
      transformedWine.ingredients = wine.ingredients.map((i: any) => ({
        ...i,
        name: i.ingredient_name || i.name,
        isAllergen: i.is_allergen !== undefined ? i.is_allergen : i.isAllergen
      }));
    } else {
      transformedWine.ingredients = [];
    }

    // Transformar el campo JSONB production_variants
    if (wine.production_variants && Array.isArray(wine.production_variants)) {
      transformedWine.productionVariants = wine.production_variants.map((v: any) => ({
        ...v,
        variantName: v.variant_name || v.variantName
      }));
    } else {
      transformedWine.productionVariants = [];
    }

    // Transformar el campo JSONB certifications
    if (wine.certifications && Array.isArray(wine.certifications)) {
      transformedWine.certifications = wine.certifications
        .filter((c: any) => c && (c.certification_name || c.certificationName))
        .map((c: any) => ({
          ...c,
          certificationName: c.certification_name || c.certificationName
        }));
    } else {
      transformedWine.certifications = [];
    }

    // No hay tabla disclaimer_icons
    transformedWine.disclaimerIcons = [];

    return NextResponse.json(transformedWine);
  } catch (error) {
    console.error("[WINE_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return new NextResponse("Wine id is required", { status: 400 });
    }

    // First check if the wine exists
    const { data: existingWine, error: existingWineError } = await supabase
      .from('wines')
      .select('*')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single();

    if (existingWineError || !existingWine) {
      console.error("[WINE_GET]", existingWineError);
      return new NextResponse("Wine not found", { status: 404 });
    }

    const body = await req.json();

    // Actualizar el wine con los campos JSONB
    const wineData = {
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
      // Agregar campos JSONB
      ingredients: body.ingredients && Array.isArray(body.ingredients) ? 
        body.ingredients.map((i: any) => ({
          ingredient_name: i.ingredientName || i.name,
          is_allergen: i.isAllergen !== undefined ? i.isAllergen : (i.is_allergen || false)
        })) : [],
      production_variants: body.productionVariants && Array.isArray(body.productionVariants) ? 
        body.productionVariants.map((v: any) => ({
          variant_name: v.variantName
        })) : [],
      certifications: body.certifications && Array.isArray(body.certifications) ? 
        body.certifications.map((c: any) => ({
          certificationName: c.certificationName || c.certification_name
        })) : []
    };

    console.log("Ingredients to save:", wineData.ingredients);
    console.log("Certifications to save:", wineData.certifications);

    // Update the wine
    const { data: wine, error: wineError } = await supabase
      .from('wines')
      .update(wineData)
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select('*')
      .single();

    if (wineError) {
      console.error("[WINE_UPDATE]", wineError);
      return new NextResponse("Error updating wine", { status: 400 });
    }

    // No necesitamos hacer consultas adicionales para obtener relaciones
    // porque ya están en los campos JSONB

    // Transformar datos para la respuesta
    const finalWine = {
      ...wine,
      ingredients: wine.ingredients || [],
      production_variants: wine.production_variants || [],
      certifications: wine.certifications || [],
      // Agregar alias camelCase
      eanCode: wine.ean_code,
      foodName: wine.food_name,
      energyKj: wine.energy_kj,
      energyKcal: wine.energy_kcal,
      saturatedFat: wine.saturated_fat,
      netQuantityCl: wine.net_quantity_cl,
      alcoholPercentage: wine.alcohol_percentage,
      optionalLabelling: wine.optional_labelling,
      countryOfOrigin: wine.country_of_origin,
      placeOfOrigin: wine.place_of_origin,
      operatorName: wine.operator_name,
      operatorAddress: wine.operator_address,
      registrationNumber: wine.registration_number,
      hasEstimationSign: wine.has_estimation_sign,
      drainedWeightGrams: wine.drained_weight_grams,
      instructionsForUse: wine.instructions_for_use,
      conservationConditions: wine.conservation_conditions,
      // Transformaciones para mantener compatibilidad
      productionVariants: wine.production_variants ? wine.production_variants.map((v: any) => ({
        variantName: v.variant_name
      })) : []
    };

    return NextResponse.json(finalWine);
  } catch (error) {
    console.error("[WINE_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ 
      cookies: () => cookieStore 
    });

    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return new NextResponse("Wine ID is required", { status: 400 });
    }

    // Delete the wine
    const { error } = await supabase
      .from('wines')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id);

    if (error) {
      return new NextResponse(error.message, { status: 400 });
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("[WINE_DELETE]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
