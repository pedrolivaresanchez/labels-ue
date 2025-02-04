import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = [
  '/login',
  '/payment/success',
  '/payment/cancel',
  '/terms',
  '/privacy',
  '/public/wines',
]

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  const isPublicPath = PUBLIC_PATHS.some(path => req.nextUrl.pathname.startsWith(path))

  if (!session && !isPublicPath) {
    const redirectUrl = new URL('/login', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

// Specify which routes should be handled by the middleware
export const config = {
  matcher: ['/wines/:path*', '/login', '/payment'],
} 