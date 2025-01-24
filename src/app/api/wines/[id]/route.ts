import { NextResponse } from "next/server";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

type Ingredient = {
  ingredient_name: string;
  is_allergen: boolean;
};

type Certification = {
  certification_name: string;
};

type ProductionVariant = {
  variant_name: string;
};

type DisclaimerIcon = {
  icon_name: string;
};

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

    const { data: wine, error } = await supabase
      .from('wines')
      .select(`
        *,
        ingredients (
          id,
          wine_id,
          ingredient_name,
          is_allergen
        ),
        certifications (
          id,
          wine_id,
          certification_name
        ),
        production_variants (
          id,
          wine_id,
          variant_name
        ),
        disclaimer_icons (
          id,
          wine_id,
          icon_name
        )
      `)
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single();

    if (error || !wine) {
      console.error("[WINE_GET] Error:", error);
      return new NextResponse("Not found", { status: 404 });
    }

    // Transform the data to match the expected format
    const transformedWine = {
      ...wine,
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
      alcoholPercentage: wine.alcohol_percentage,
      optionalLabelling: wine.optional_labelling,
      countryOfOrigin: wine.country_of_origin,
      placeOfOrigin: wine.place_of_origin,
      wineryInformation: wine.winery_information,
      instructionsForUse: wine.instructions_for_use,
      conservationConditions: wine.conservation_conditions,
      drainedWeightGrams: wine.drained_weight_grams,
      operatorName: wine.operator_name,
      operatorAddress: wine.operator_address,
      registrationNumber: wine.registration_number,
      imageUrl: wine.image_url,
      ingredients: wine.ingredients?.map((i: Ingredient) => ({
        ingredientName: i.ingredient_name,
        isAllergen: i.is_allergen
      })) || [],
      certifications: wine.certifications?.map((c: Certification) => ({
        certificationName: c.certification_name
      })) || [],
      productionVariants: wine.production_variants?.map((v: ProductionVariant) => ({
        variantName: v.variant_name
      })) || [],
      disclaimerIcons: wine.disclaimer_icons?.map((d: DisclaimerIcon) => ({
        iconName: d.icon_name
      })) || []
    };

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

    const body = await req.json();

    // Transform camelCase to snake_case
    const transformedData = {
      name: body.name,
      ean_code: body.eanCode,
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
      registration_number: body.registrationNumber,
      image_url: body.imageUrl
    };

    // Update the wine
    const { data: wine, error } = await supabase
      .from('wines')
      .update(transformedData)
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select()
      .single();

    if (error || !wine) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Handle ingredients update
    if (body.ingredients) {
      // First delete existing ingredients
      await supabase
        .from('ingredients')
        .delete()
        .eq('wine_id', id);

      // Then insert new ones
      const ingredients = body.ingredients
        .filter((i: any) => i.ingredientName.trim())
        .map((i: any) => ({
          wine_id: id,
          ingredient_name: i.ingredientName,
          is_allergen: i.isAllergen
        }));

      if (ingredients.length > 0) {
        await supabase.from('ingredients').insert(ingredients);
      }
    }

    // Handle production variants update
    if (body.productionVariants) {
      // First delete existing variants
      await supabase
        .from('production_variants')
        .delete()
        .eq('wine_id', id);

      // Then insert new ones
      const variants = body.productionVariants
        .filter((v: any) => v.variantName.trim())
        .map((v: any) => ({
          wine_id: id,
          variant_name: v.variantName
        }));

      if (variants.length > 0) {
        await supabase.from('production_variants').insert(variants);
      }
    }

    // Handle certifications update
    if (body.certifications) {
      // First delete existing certifications
      await supabase
        .from('certifications')
        .delete()
        .eq('wine_id', id);

      // Then insert new ones
      const certifications = body.certifications
        .filter((c: any) => c.certificationName.trim())
        .map((c: any) => ({
          wine_id: id,
          certification_name: c.certificationName
        }));

      if (certifications.length > 0) {
        await supabase.from('certifications').insert(certifications);
      }
    }

    // Handle disclaimer icons update
    if (body.disclaimerIcons) {
      // First delete existing icons
      await supabase
        .from('disclaimer_icons')
        .delete()
        .eq('wine_id', id);

      // Then insert new ones
      const icons = body.disclaimerIcons
        .filter((d: any) => d.iconName.trim())
        .map((d: any) => ({
          wine_id: id,
          icon_name: d.iconName
        }));

      if (icons.length > 0) {
        await supabase.from('disclaimer_icons').insert(icons);
      }
    }

    // Fetch the complete updated wine with all relations
    const { data: completeWine, error: fetchError } = await supabase
      .from('wines')
      .select(`
        *,
        ingredients (
          id, wine_id, ingredient_name, is_allergen
        ),
        certifications (
          id, wine_id, certification_name
        ),
        production_variants (
          id, wine_id, variant_name
        ),
        disclaimer_icons (
          id, wine_id, icon_name
        )
      `)
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error("[WINE_PUT_FETCH]", fetchError);
      return new NextResponse("Error fetching updated wine", { status: 500 });
    }

    return NextResponse.json(completeWine);
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

    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;

    if (!id) {
      return new NextResponse("Wine ID is required", { status: 400 });
    }

    // Delete related records first
    const deletePromises = [
      supabase.from('ingredients').delete().eq('wine_id', id),
      supabase.from('production_variants').delete().eq('wine_id', id),
      supabase.from('disclaimer_icons').delete().eq('wine_id', id),
      supabase.from('certifications').delete().eq('wine_id', id)
    ];

    await Promise.all(deletePromises);

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
