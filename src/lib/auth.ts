import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { type Provider } from '@supabase/supabase-js'

export type AuthError = {
  message: string
}

// Create a Supabase client for auth operations
export const createClient = () => {
  return createClientComponentClient()
}

// Sign in with OTP (Email magic link)
export async function signInWithOtp(email: string) {
  const supabase = createClient()
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  return { error }
}

// Sign in with OAuth provider (Google)
export async function signInWithOAuth(provider: Provider) {
  const supabase = createClient()
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  return { error }
}

// Sign out
export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Get current session
export async function getSession() {
  const supabase = createClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

// Get current user
export async function getUser() {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
} 