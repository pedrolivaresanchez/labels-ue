import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
}) : null;

export async function POST() {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe configuration is missing' },
        { status: 500 }
      );
    }

    const headersList = await headers();
    const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_BASE_URL;
    
    // Get the user ID from Supabase auth
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const params: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      customer_email: user.email,
      line_items: [
        {
          price: 'price_1QmqlTBu0lOkGmq12ahCB8bZ',
          quantity: 1,
        },
      ],
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment/cancel`,
      client_reference_id: user.id,
      billing_address_collection: 'required',
      tax_id_collection: { enabled: true },
      customer_update: {
        address: 'auto',
        name: 'auto',
      },
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: 'Suscripción Anual VinoVeo',
          rendering_options: {
            amount_tax_display: 'include_inclusive_tax'
          },
          footer: 'VinoVeo - Etiquetado de vinos conforme a la normativa UE',
        }
      },
      phone_number_collection: {
        enabled: true
      },
      custom_fields: [
        {
          key: 'tax_id_type',
          label: {
            type: 'custom',
            custom: 'Tipo de identificación fiscal'
          },
          type: 'dropdown',
          dropdown: {
            options: [
              { label: 'NIF/CIF', value: 'nif' },
              { label: 'NIE', value: 'nie' }
            ]
          }
        }
      ]
    };

    const session = await stripe.checkout.sessions.create(params);

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}