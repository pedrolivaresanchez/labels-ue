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
      image_url: body.imageUrl,
      ingredients: body.ingredients,
      production_variants: body.productionVariants,
      certifications: body.certifications
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

    return NextResponse.json(wine);
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
