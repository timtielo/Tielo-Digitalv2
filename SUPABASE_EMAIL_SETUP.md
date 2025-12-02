# Supabase Email Configuration Guide

This guide explains how to configure the email templates in Supabase to work correctly with the password reset, email confirmation, and magic link features.

## Email Template Configuration

In the Supabase dashboard, go to **Authentication > Email Templates** and configure the following templates:

### 1. Confirm Sign Up Template

**Subject:** Bevestig je email adres

**Message Body:**
```html
<h2>Bevestig je email adres</h2>
<p>Klik op deze link om je email adres te bevestigen:</p>
<p><a href="{{ .ConfirmationURL }}">Bevestig Email</a></p>
```

**Important:** The `{{ .ConfirmationURL }}` will redirect to `/login` which will automatically handle the confirmation token and redirect to the dashboard.

### 2. Magic Link Template

**Subject:** Inloggen bij Tielo Digital

**Message Body:**
```html
<h2>Inloggen</h2>
<p>Klik op deze link om in te loggen:</p>
<p><a href="{{ .ConfirmationURL }}">Inloggen</a></p>
```

**Important:** The `{{ .ConfirmationURL }}` will redirect to `/login` (or `/dashboard` based on the `emailRedirectTo` option) which will automatically handle the magic link token.

### 3. Reset Password Template

**Subject:** Reset Wachtwoord

**Message Body:**
```html
<h2>Reset Wachtwoord</h2>
<p>Klik op deze link om je wachtwoord te resetten:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Wachtwoord</a></p>
```

**CRITICAL FIX:** The `{{ .ConfirmationURL }}` should automatically use the `redirectTo` parameter passed in the code. However, if you're seeing the email redirect to the root URL (`https://www.tielo-digital.nl/`) instead of `/reset-password`, you need to check:

1. Make sure `https://www.tielo-digital.nl/reset-password` is in the **Redirect URLs allow list**
2. The Site URL should be `https://www.tielo-digital.nl/` (with trailing slash)
3. In the email template editor, do NOT manually set a redirect URL - let it use `{{ .ConfirmationURL }}`

The code is already configured to pass `/reset-password` as the redirect URL, but Supabase might be ignoring it if it's not in the allow list.

### 4. Change Email Address Template

**Subject:** Bevestig je nieuwe email adres

**Message Body:**
```html
<h2>Bevestig je nieuwe email adres</h2>
<p>Klik op deze link om je nieuwe email adres te bevestigen:</p>
<p><a href="{{ .ConfirmationURL }}">Bevestig Email Wijziging</a></p>
```

## Authentication Settings

Make sure these settings are configured correctly in **Authentication > Settings**:

### Email Settings

1. **Enable Email Provider**: ✅ Enabled
2. **Confirm Email**: ✅ Enabled (if you want users to confirm their email)
3. **Secure Email Change**: ✅ Enabled (recommended)
4. **Secure Password Change**: Your choice

### Site URL Configuration

In **Authentication > URL Configuration**:

1. **Site URL**: `https://www.tielo-digital.nl/`
2. **Redirect URLs**: Add these URLs to the allow list:
   - `https://www.tielo-digital.nl/**`
   - `https://www.tielo-digital.nl/dashboard`
   - `https://www.tielo-digital.nl/reset-password`
   - `https://www.tielo-digital.nl/login`

## How It Works

### Password Reset Flow
1. User clicks "Wachtwoord vergeten?" on login page
2. Enters email and receives reset email
3. Clicks link in email → redirected to `/reset-password`
4. Sets new password
5. Redirected to `/login`

### Email Confirmation Flow (New Users)
1. New user signs up
2. Receives confirmation email
3. Clicks link in email → redirected to `/login`
4. Login page automatically handles the token and redirects to `/dashboard`

### Magic Link Flow
1. User requests magic link (if implemented in UI)
2. Receives magic link email
3. Clicks link in email → redirected to `/login` or `/dashboard`
4. Page automatically handles the token and logs user in

## Testing

To test the email flows:

1. **Password Reset**: Use the "Wachtwoord vergeten?" link on the login page
2. **Email Confirmation**: Create a new user account (if sign-up is enabled)
3. **Magic Link**: Call `signInWithOtp(email)` from the AuthContext

## Troubleshooting

### If Password Reset Emails Redirect to Root URL

If you click the password reset link and it goes to `https://www.tielo-digital.nl/#error=access_denied&error_code=otp_expired` or just the root URL:

1. **Add Redirect URL to Allow List**: Go to **Authentication > URL Configuration** and make sure `https://www.tielo-digital.nl/reset-password` is in the **Redirect URLs** list
2. **Check Site URL**: Make sure Site URL is set to `https://www.tielo-digital.nl/` (with trailing slash)
3. **Fallback Handler**: The code now includes a fallback - even if the email redirects to the root URL, the homepage will automatically redirect to `/reset-password` with the token intact

### If Tokens Are Expired

The error `otp_expired` or `Email link is invalid or has expired` means:
- The token has expired (default: 1 hour)
- The token was already used
- Request a new password reset email

### General Troubleshooting

If emails are not working:

1. Check that email provider is enabled in Supabase
2. Verify the redirect URLs are in the allow list
3. Check the email templates use the correct variables
4. Look at the browser console for any errors
5. Check Supabase logs for authentication errors
6. Try requesting a new reset email (tokens expire after some time)

## Important Notes

- All email links use URL fragments (`#access_token=...`) which are handled by the frontend
- The `/reset-password` page extracts the token from the URL and sets up a session
- The `/login` page handles confirmation and magic link tokens automatically
- Tokens expire after a certain time (configured in Supabase settings)
