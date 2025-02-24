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
      image_url: body.image_url,
      ingredients: body.ingredients,
      production_variants: body.production_variants,
      certifications: body.certifications,
      has_glass_bottle: body.has_glass_bottle,
      has_aluminum_cap: body.has_aluminum_cap,
      has_cardboard_box: body.has_cardboard_box,
      has_cork_stopper: body.has_cork_stopper
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
