import { NextResponse } from "next/server";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Ingredient, ProductionVariant, Certification, DisclaimerIcon } from '@/types/wine';
import type { NextRequest } from 'next/server';

export async function POST(
  request: Request,
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
      return new NextResponse("Wine ID is required", { status: 400 });
    }

    // Fetch the original wine with all its related data
    const { data: originalWine, error: fetchError } = await supabase
      .from('wines')
      .select('*')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single();

    if (fetchError || !originalWine) {
      console.error("[WINE_DUPLICATE_FETCH]", fetchError);
      return new NextResponse("Wine not found", { status: 404 });
    }

    // Create new wine data without relations
    const newWineData = {
      user_id: session.user.id,
      name: `${originalWine.name} (copy)`,
      ean_code: originalWine.ean_code,
      food_name: originalWine.food_name,
      energy_kj: originalWine.energy_kj,
      energy_kcal: originalWine.energy_kcal,
      fat: originalWine.fat,
      saturated_fat: originalWine.saturated_fat,
      carbohydrate: originalWine.carbohydrate,
      sugars: originalWine.sugars,
      protein: originalWine.protein,
      salt: originalWine.salt,
      net_quantity_cl: originalWine.net_quantity_cl,
      has_estimation_sign: originalWine.has_estimation_sign,
      alcohol_percentage: originalWine.alcohol_percentage,
      optional_labelling: originalWine.optional_labelling,
      country_of_origin: originalWine.country_of_origin,
      place_of_origin: originalWine.place_of_origin,
      winery_information: originalWine.winery_information,
      instructions_for_use: originalWine.instructions_for_use,
      conservation_conditions: originalWine.conservation_conditions,
      drained_weight_grams: originalWine.drained_weight_grams,
      operator_name: originalWine.operator_name,
      operator_address: originalWine.operator_address,
      registration_number: originalWine.registration_number,
      image_url: originalWine.image_url,
      ingredients: originalWine.ingredients,
      production_variants: originalWine.production_variants,
      certifications: originalWine.certifications
    };

    // Insert the new wine
    const { data: newWine, error: insertError } = await supabase
      .from('wines')
      .insert(newWineData)
      .select()
      .single();

    if (insertError || !newWine) {
      console.error("[WINE_DUPLICATE_INSERT]", insertError);
      return new NextResponse("Error creating duplicate wine", { status: 500 });
    }

    return NextResponse.json(newWine);
  } catch (error) {
    console.error("[WINE_DUPLICATE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}