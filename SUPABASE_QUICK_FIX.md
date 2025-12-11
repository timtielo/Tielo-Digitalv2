# Quick Fix for Password Reset Email Issue

## The Problem
Password reset emails are redirecting to `https://www.tielo-digital.nl/` instead of `https://www.tielo-digital.nl/reset-password`, causing an "otp_expired" error.

## The Solution

### Step 1: Add Redirect URLs to Allow List

Go to **Supabase Dashboard → Authentication → URL Configuration**

Add these URLs to the **Redirect URLs** list:

```
https://www.tielo-digital.nl/**
https://www.tielo-digital.nl/reset-password
https://www.tielo-digital.nl/login
https://www.tielo-digital.nl/dashboard
```

### Step 2: Verify Site URL

Make sure **Site URL** is set to:
```
https://www.tielo-digital.nl/
```
(with the trailing slash)

### Step 3: Check Email Template

Go to **Authentication → Email Templates → Reset Password**

Make sure the template uses:
```html
<h2>Reset Wachtwoord</h2>
<p>Klik op deze link om je wachtwoord te resetten:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Wachtwoord</a></p>
```

**Important:** Use `{{ .ConfirmationURL }}` - this variable will automatically use the redirect URL from the code.

### Step 4: Test Again

1. Request a new password reset (old tokens expire)
2. Click the link in the email
3. You should now land on `/reset-password` page
4. If it still goes to root URL, the fallback will redirect automatically

## How It Works Now

The code has been updated with a **fallback mechanism**:

1. **Primary**: Email should redirect directly to `/reset-password`
2. **Fallback**: If email redirects to root URL, the homepage will detect the recovery token and redirect to `/reset-password` automatically
3. **Token Handling**: `/reset-password` page extracts the token and allows password change

## Common Issues

### "otp_expired" Error
- Token has expired (request new reset email)
- Token was already used (request new reset email)
- Old tokens don't work - always request fresh ones

### Email Goes to Wrong URL
- Add `/reset-password` to Redirect URLs allow list
- Check Site URL has trailing slash
- Even if wrong, fallback will catch it

### Still Not Working?
1. Clear browser cache
2. Request a completely new reset email (don't reuse old links)
3. Check browser console for errors
4. Check Supabase logs for authentication errors
