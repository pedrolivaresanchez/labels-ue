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
      .select(`
        *,
        ingredients (id, wine_id, ingredient_name, is_allergen),
        certifications (id, wine_id, certification_name),
        production_variants (id, wine_id, variant_name),
        disclaimer_icons (id, wine_id, icon_name)
      `)
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
      image_url: originalWine.image_url
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

    // Duplicate related data
    const duplicatePromises = [];

    // Duplicate ingredients
    if (originalWine.ingredients?.length > 0) {
      const ingredients = originalWine.ingredients.map((i: Ingredient) => ({
        wine_id: newWine.id,
        ingredient_name: i.ingredient_name,
        is_allergen: i.is_allergen
      }));
      duplicatePromises.push(
        supabase.from('ingredients').insert(ingredients)
      );
    }

    // Duplicate production variants
    if (originalWine.production_variants?.length > 0) {
      const variants = originalWine.production_variants.map((v: ProductionVariant) => ({
        wine_id: newWine.id,
        variant_name: v.variant_name
      }));
      duplicatePromises.push(
        supabase.from('production_variants').insert(variants)
      );
    }

    // Duplicate certifications
    if (originalWine.certifications?.length > 0) {
      const certifications = originalWine.certifications.map((c: Certification) => ({
        wine_id: newWine.id,
        certification_name: c.certification_name
      }));
      duplicatePromises.push(
        supabase.from('certifications').insert(certifications)
      );
    }

    // Duplicate disclaimer icons
    if (originalWine.disclaimer_icons?.length > 0) {
      const icons = originalWine.disclaimer_icons.map((d: DisclaimerIcon) => ({
        wine_id: newWine.id,
        icon_name: d.icon_name
      }));
      duplicatePromises.push(
        supabase.from('disclaimer_icons').insert(icons)
      );
    }

    // Wait for all duplications to complete
    await Promise.all(duplicatePromises);

    // Fetch the complete duplicated wine with all relations
    const { data: completeWine, error: finalFetchError } = await supabase
      .from('wines')
      .select(`
        *,
        ingredients (id, wine_id, ingredient_name, is_allergen),
        certifications (id, wine_id, certification_name),
        production_variants (id, wine_id, variant_name),
        disclaimer_icons (id, wine_id, icon_name)
      `)
      .eq('id', newWine.id)
      .single();

    if (finalFetchError) {
      console.error("[WINE_DUPLICATE_FINAL_FETCH]", finalFetchError);
      return new NextResponse("Error fetching duplicated wine", { status: 500 });
    }

    return NextResponse.json(completeWine);
  } catch (error) {
    console.error("[WINE_DUPLICATE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}