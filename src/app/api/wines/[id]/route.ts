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

    return NextResponse.json(wine);
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
      .select(`
        *,
        ingredients (
          id,
          ingredient_name,
          is_allergen
        ),
        production_variants (
          id,
          variant_name
        ),
        certifications (
          id,
          certification_name
        )
      `)
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single();

    if (existingWineError || !existingWine) {
      console.error("[WINE_GET]", existingWineError);
      return new NextResponse("Wine not found", { status: 404 });
    }

    const body = await req.json();

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
      image_url: body.image_url
    };

    // Update the wine
    const { data: wine, error: wineError } = await supabase
      .from('wines')
      .update(wineData)
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select(`
        *,
        ingredients (
          id,
          ingredient_name,
          is_allergen
        ),
        production_variants (
          id,
          variant_name
        ),
        certifications (
          id,
          certification_name
        )
      `)
      .single();

    if (wineError) {
      console.error("[WINE_UPDATE]", wineError);
      return new NextResponse("Error updating wine", { status: 400 });
    }

    // Delete existing relationships
    const deletePromises = [
      supabase.from('ingredients').delete().eq('wine_id', id),
      supabase.from('production_variants').delete().eq('wine_id', id),
      supabase.from('certifications').delete().eq('wine_id', id)
    ];

    await Promise.all(deletePromises);

    // Handle ingredients
    if (body.ingredients?.length > 0) {
      const ingredients = body.ingredients
        .filter((i: { ingredientName?: string; isAllergen?: boolean }) => 
          i && i.ingredientName && typeof i.ingredientName === 'string' && typeof i.isAllergen === 'boolean'
        )
        .map((i: { ingredientName: string; isAllergen: boolean }) => ({
          wine_id: wine.id,
          ingredient_name: i.ingredientName,
          is_allergen: i.isAllergen
        }));

      if (ingredients.length > 0) {
        const { error: ingredientsError } = await supabase
          .from('ingredients')
          .insert(ingredients);

        if (ingredientsError) {
          console.error("[INGREDIENTS_UPDATE]", ingredientsError);
        }
      }
    }

    // Handle production variants
    if (body.productionVariants?.length > 0) {
      const variants = body.productionVariants
        .filter((v: { variantName?: string }) => 
          v?.variantName && typeof v.variantName === 'string'
        )
        .map((v: { variantName: string }) => ({
          wine_id: wine.id,
          variant_name: v.variantName
        }));

      if (variants.length > 0) {
        const { error: variantsError } = await supabase
          .from('production_variants')
          .insert(variants);

        if (variantsError) {
          console.error("[VARIANTS_UPDATE]", variantsError);
        }
      }
    }

    // Handle certifications
    if (body.certifications?.length > 0) {
      const certifications = body.certifications
        .filter((c: { certificationName?: string }) => 
          c?.certificationName && typeof c.certificationName === 'string'
        )
        .map((c: { certificationName: string }) => ({
          wine_id: wine.id,
          certification_name: c.certificationName
        }));

      if (certifications.length > 0) {
        const { error: certificationsError } = await supabase
          .from('certifications')
          .insert(certifications);

        if (certificationsError) {
          console.error("[CERTIFICATIONS_UPDATE]", certificationsError);
        }
      }
    }

    // Get the final wine with all relationships
    const { data: finalWine, error: finalError } = await supabase
      .from('wines')
      .select(`
        *,
        ingredients (
          id,
          ingredient_name,
          is_allergen
        ),
        production_variants (
          id,
          variant_name
        ),
        certifications (
          id,
          certification_name
        )
      `)
      .eq('id', id)
      .single();

    if (finalError) {
      console.error("[WINE_GET_FINAL]", finalError);
      return new NextResponse("Error getting updated wine", { status: 400 });
    }

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
