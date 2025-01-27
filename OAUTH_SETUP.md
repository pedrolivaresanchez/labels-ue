# OAuth Configuration Guide

## Google Cloud Platform (GCP) Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and OAuth consent screen:
   - Go to "APIs & Services" > "OAuth consent screen"
   - Choose "External" user type
   - Fill in the required information (app name, support email, etc.)
   - Add the following scopes: `.../auth/userinfo.email`, `.../auth/userinfo.profile`

4. Create OAuth 2.0 Client ID:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add these Authorized JavaScript origins:
     ```
     http://localhost:3000
     https://your-production-domain.com
     ```
   - Add these Authorized redirect URIs:
     ```
     http://localhost:3000/auth/callback
     https://your-production-domain.com/auth/callback
     ```
   - Save and note down the Client ID and Client Secret

## Supabase Configuration

1. Go to your Supabase project dashboard
2. Navigate to "Authentication" > "Providers"
3. Find and enable "Google" provider
4. Enter the OAuth credentials from GCP:
   - Client ID: [Your GCP Client ID]
   - Client Secret: [Your GCP Client Secret]

5. Configure Redirect URLs in Supabase:
   - Go to "Authentication" > "URL Configuration"
   - Set Site URL: `https://your-production-domain.com` (or `http://localhost:3000` for local development)
   - Add Redirect URLs:
     ```
     http://localhost:3000/auth/callback
     https://your-production-domain.com/auth/callback
     ```

## Environment Variables

Make sure these environment variables are set in your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Common Issues

1. Redirect Loop: If you're experiencing a redirect loop back to the login page:
   - Verify that the redirect URIs match exactly in both GCP and Supabase
   - Check that your site URL is correctly set in Supabase
   - Ensure your environment variables are properly configured

2. Invalid Redirect URI: If you get an "invalid redirect URI" error:
   - Double-check that all URLs are exactly the same in both GCP and Supabase
   - Make sure there are no trailing slashes in the URLs
   - Verify that the protocol (http/https) matches your development/production environment

3. Session Not Persisting: If the session isn't persisting after login:
   - Verify that cookies are being set correctly
   - Check that your Supabase client is properly initialized
   - Ensure your middleware is configured correctly for auth