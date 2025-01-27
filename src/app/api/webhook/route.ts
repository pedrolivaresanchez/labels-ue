import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize Stripe conditionally
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
    })
  : null;

// Initialize Supabase conditionally
const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )
  : null;

// This is your Stripe webhook secret for testing your endpoint locally.
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  // Enable CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type, stripe-signature',
      },
    });
  }

  try {
    // Check if required services are initialized
    if (!stripe || !supabase || !webhookSecret) {
      console.error('Webhook: Required configuration is missing');
      return NextResponse.json(
        { error: 'Service not configured' },
        { status: 501 }
      );
    }
    console.log('Webhook: Received request');
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature')!;

    console.log('Webhook: Got signature', signature ? 'Yes' : 'No');

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
      console.log('Webhook: Event constructed successfully', event.type);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        try {
          const session = event.data.object as Stripe.Checkout.Session;
          console.log('Webhook: Processing checkout.session.completed', {
            sessionId: session.id,
            clientReferenceId: session.client_reference_id,
            customerId: session.customer,
            subscriptionId: session.subscription
          });
          
          if (!session.client_reference_id) {
            console.error('Webhook: No client_reference_id found in session');
            return NextResponse.json(
              { error: 'No client_reference_id found' },
              { status: 400 }
            );
          }

          // Retrieve the subscription details from Stripe
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          console.log('Webhook: Retrieved subscription', {
            id: subscription.id,
            status: subscription.status
          });
          
          // Get the customer
          const customer = await stripe.customers.retrieve(session.customer as string);
          console.log('Webhook: Retrieved customer', {
            id: customer.id,
            email: (customer as Stripe.Customer).email
          });
          
          // Add the subscription to our database
          const { data, error } = await supabase
            .from('subscriptions')
            .upsert({
              user_id: session.client_reference_id,
              stripe_subscription_id: subscription.id,
              stripe_customer_id: customer.id,
              status: subscription.status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            }, {
              onConflict: 'user_id'
            })
            .select();

          if (error) {
            console.error('Webhook: Error inserting subscription:', error);
            throw error;
          }

          console.log('Webhook: Successfully saved subscription', data);
          return NextResponse.json({ received: true });
        } catch (error) {
          console.error('Error processing checkout.session.completed:', error);
          return NextResponse.json(
            { error: 'Error processing webhook' },
            { status: 500 }
          );
        }
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Update the subscription in our database
        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000),
            current_period_end: new Date(subscription.current_period_end * 1000),
            canceled_at: subscription.canceled_at 
              ? new Date(subscription.canceled_at * 1000)
              : null,
          })
          .eq('stripe_subscription_id', subscription.id);

        if (error) {
          console.error('Error updating subscription:', error);
          return NextResponse.json(
            { error: 'Error updating subscription' },
            { status: 500 }
          );
        }
        break;
      }

      // Return early for other events we're not handling yet
      default:
        return NextResponse.json({ received: true });
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}