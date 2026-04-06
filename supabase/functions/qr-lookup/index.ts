import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const AIRTABLE_BASE = "appppVhjjG2Wl1fWN";
const AIRTABLE_TABLE = "tblcRhTIcKyu1h5l3";
const FIELD_REDIRECT_URL = "redirectUrl";
const FIELD_STATUS = "status";
const FIELD_SCANNED_AT = "scannedAt";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("AIRTABLE_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing API key" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const code = (body.code || "").trim().toUpperCase();

    if (!code) {
      return new Response(JSON.stringify({ error: "No code provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const formula = encodeURIComponent(`{accessCode}="${code}"`);
    const lookupUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${AIRTABLE_TABLE}?filterByFormula=${formula}`;

    const lookupRes = await fetch(lookupUrl, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!lookupRes.ok) {
      return new Response(JSON.stringify({ error: "Airtable lookup failed" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await lookupRes.json();
    const record = data.records?.[0];

    if (!record) {
      return new Response(JSON.stringify({ error: "Code not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const redirectUrl = record.fields[FIELD_REDIRECT_URL] as string;

    if (!redirectUrl) {
      return new Response(JSON.stringify({ error: "No redirect URL configured" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${AIRTABLE_TABLE}/${record.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          [FIELD_STATUS]: "gescand",
          [FIELD_SCANNED_AT]: new Date().toISOString(),
        },
      }),
    }).catch(() => {});

    return new Response(JSON.stringify({ redirectUrl }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
