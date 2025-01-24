import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.log('Check subscription: No user found');
      return NextResponse.json(
        { hasSubscription: false },
        { status: 401 }
      );
    }

    console.log('Check subscription: Checking for user', user.id);
    
    // Check if user has an active subscription
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.log('Check subscription: Error', error);
    }

    console.log('Check subscription: Found subscription', subscription);

    return NextResponse.json({
      hasSubscription: subscription?.status === 'active'
    });
  } catch (error) {
    console.error('Error checking subscription:', error);
    return NextResponse.json(
      { error: 'Error checking subscription' },
      { status: 500 }
    );
  }
} 