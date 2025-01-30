import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import Stripe from "stripe";

let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  console.log("[STRIPE_INIT] Using Stripe key starting with:", process.env.STRIPE_SECRET_KEY.substring(0, 8));
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-12-18.acacia",
  });
}

export async function POST() {
  try {
    if (!stripe) {
      console.error("[STRIPE_INIT_ERROR] Stripe client not initialized. Check STRIPE_SECRET_KEY");
      return NextResponse.json(
        { error: "Stripe configuration missing" },
        { status: 500 }
      );
    }

    console.log("[CREATE_PORTAL] Starting portal session creation");
    
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Get user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      console.error("[AUTH_ERROR] No user session found");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("[CREATE_PORTAL] User authenticated:", session.user.id);

    // Get user's stripe customer id from subscriptions table
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id, status')
      .eq('user_id', session.user.id)
      .single();

    console.log("[CREATE_PORTAL] Subscription data:", subscriptionData);
    if (subscriptionError) {
      console.error("[STRIPE_CUSTOMER_ERROR] Database error:", subscriptionError);
      return NextResponse.json(
        { error: "Error retrieving subscription data" },
        { status: 500 }
      );
    }

    if (!subscriptionData?.stripe_customer_id) {
      console.error("[STRIPE_CUSTOMER_ERROR] No customer ID found for user:", session.user.id);
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 }
      );
    }

    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      console.error("[CONFIG_ERROR] NEXT_PUBLIC_BASE_URL is not set");
      return NextResponse.json(
        { error: "Missing return URL configuration" },
        { status: 500 }
      );
    }

    console.log("[CREATE_PORTAL] Creating portal session with config:", {
      customerId: subscriptionData.stripe_customer_id,
      returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/wines`,
      configId: process.env.STRIPE_PORTAL_CONFIGURATION_ID || 'No config ID set'
    });

    try {
      // Create a Stripe Portal Session
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: subscriptionData.stripe_customer_id,
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/wines`,
        configuration: process.env.STRIPE_PORTAL_CONFIGURATION_ID
      });

      console.log("[CREATE_PORTAL] Portal session created successfully:", portalSession.id);
      return NextResponse.json({ url: portalSession.url });
    } catch (stripeError) {
      console.error("[STRIPE_API_ERROR] Error creating portal session:", {
        error: stripeError instanceof Error ? stripeError.message : stripeError,
        type: stripeError instanceof Stripe.errors.StripeError ? stripeError.type : 'unknown'
      });
      return NextResponse.json(
        { error: "Error creating Stripe portal session" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[STRIPE_PORTAL_SESSION_ERROR] Detailed error:", {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}