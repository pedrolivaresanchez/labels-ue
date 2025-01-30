import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import Stripe from "stripe";

let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-12-18.acacia",
  });
}

export async function POST() {
  try {
    if (!stripe) {
      console.error("[STRIPE_INIT_ERROR] Stripe client not initialized");
      return new NextResponse("Stripe configuration missing", { status: 500 });
    }
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Get user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get user's stripe customer id from subscriptions table
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', session.user.id)
      .single();

    if (subscriptionError || !subscriptionData?.stripe_customer_id) {
      console.error("[STRIPE_CUSTOMER_ERROR]", subscriptionError);
      return new NextResponse("No active subscription found", { status: 404 });
    }

    try {
      // Create a Stripe Portal Session
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: subscriptionData.stripe_customer_id,
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/wines`,
      });

      return NextResponse.json({ url: portalSession.url });
    } catch (stripeError: any) {
      // Check if this is a test mode vs live mode error
      if (stripeError.type === 'StripeInvalidRequestError' && 
          stripeError.raw?.message?.includes('test mode')) {
        // Delete the test mode subscription from the database
        await supabase
          .from('subscriptions')
          .delete()
          .eq('user_id', session.user.id);

        return new NextResponse(
          JSON.stringify({
            error: "Your subscription needs to be renewed for the live environment",
            code: "TEST_MODE_SUBSCRIPTION"
          }), 
          { status: 400 }
        );
      }
      
      throw stripeError; // Re-throw other errors to be caught by the outer catch block
    }
  } catch (error) {
    console.error("[STRIPE_PORTAL_SESSION_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}