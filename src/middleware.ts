import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response })

  // Refresh session if expired - required for Server Components
  await supabase.auth.getSession()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Auth condition for protected routes
  const isAuthPage = request.nextUrl.pathname.startsWith('/login')
  const isPaymentPage = request.nextUrl.pathname.startsWith('/payment')
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/wines')

  if (!user && (isProtectedRoute || isPaymentPage)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user) {
    // Check if user has paid
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', user.id)
      .single()

    const hasValidSubscription = subscription?.status === 'active'

    if (isAuthPage) {
      // After login, redirect to payment if no subscription, otherwise to wines
      return NextResponse.redirect(new URL(hasValidSubscription ? '/wines' : '/payment', request.url))
    }

    if (!hasValidSubscription && isProtectedRoute) {
      // If trying to access protected routes without subscription, redirect to payment
      return NextResponse.redirect(new URL('/payment', request.url))
    }

    if (hasValidSubscription && isPaymentPage) {
      // If trying to access payment page with active subscription, redirect to wines
      return NextResponse.redirect(new URL('/wines', request.url))
    }
  }

  return response
}

// Specify which routes should be handled by the middleware
export const config = {
  matcher: ['/wines/:path*', '/login', '/payment'],
} 