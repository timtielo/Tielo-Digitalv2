import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface ExchangeRequest {
  impersonation_token: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const body: ExchangeRequest = await req.json();

    if (!body.impersonation_token) {
      return new Response(
        JSON.stringify({ error: 'impersonation_token is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Look up the token
    const { data: tokenData, error: tokenError } = await supabaseAdmin
      .from('impersonation_tokens')
      .select('user_id, used, expires_at')
      .eq('token', body.impersonation_token)
      .maybeSingle();

    if (tokenError || !tokenData) {
      console.error('Token lookup error:', tokenError);
      return new Response(
        JSON.stringify({ error: 'Invalid impersonation token' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Check if token is already used
    if (tokenData.used) {
      return new Response(
        JSON.stringify({ error: 'Token already used' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Check if token is expired
    if (new Date(tokenData.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ error: 'Token expired' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Mark token as used
    const { error: updateError } = await supabaseAdmin
      .from('impersonation_tokens')
      .update({ used: true })
      .eq('token', body.impersonation_token);

    if (updateError) {
      console.error('Error marking token as used:', updateError);
    }

    // Get the user details
    const { data: targetUser, error: userError } = await supabaseAdmin.auth.admin.getUserById(tokenData.user_id);

    if (userError || !targetUser.user) {
      console.error('User lookup error:', userError);
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Use the admin createSession method to generate a valid session
    // This creates a session without requiring a password or email verification
    const response = await fetch(`${supabaseUrl}/auth/v1/admin/generate_link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey,
      },
      body: JSON.stringify({
        type: 'magiclink',
        email: targetUser.user.email,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Generate link error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Failed to generate session' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const linkData = await response.json();
    console.log('Link data:', JSON.stringify(linkData));

    // Now verify the OTP using the hashed_token from the link generation
    const verifyResponse = await fetch(`${supabaseUrl}/auth/v1/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
      },
      body: JSON.stringify({
        type: 'magiclink',
        token_hash: linkData.hashed_token,
      }),
    });

    if (!verifyResponse.ok) {
      const errorData = await verifyResponse.text();
      console.error('Verify error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Failed to verify session', details: errorData }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const sessionData = await verifyResponse.json();
    console.log('Session data:', JSON.stringify(sessionData));

    if (!sessionData.access_token || !sessionData.refresh_token) {
      console.error('No tokens in session data');
      return new Response(
        JSON.stringify({ error: 'Failed to get tokens from session' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        access_token: sessionData.access_token,
        refresh_token: sessionData.refresh_token,
        user: sessionData.user,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in exchange-impersonation-token function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});