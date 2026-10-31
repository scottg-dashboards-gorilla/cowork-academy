import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Admin passphrase lives in the ADMIN_PASSPHRASE Edge Function secret, never in this repo.
// NOTE: the version deployed on 2026-10-30 still compares against an inline SHA-256 hash;
// set the secret, then deploy this file (verify_jwt: false) to switch over.

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-admin-key",
};

async function sha256(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const secret = Deno.env.get("ADMIN_PASSPHRASE");
    if (!secret) return json({ error: "admin passphrase not configured" }, 500);
    let key = req.headers.get("x-admin-key") || "";
    if (!key) {
      try { const b = await req.json(); key = (b && b.key) || ""; } catch (_) { /* ignore */ }
    }
    // Compare hashes so the check takes the same time whatever the input.
    if (!key || (await sha256(key)) !== (await sha256(secret))) return json({ error: "unauthorized" }, 401);
    const url = Deno.env.get("SUPABASE_URL");
    const svc = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const r = await fetch(`${url}/rest/v1/academy_users?select=email,name,progress,created_at,last_active&order=last_active.desc`, {
      headers: { apikey: svc!, Authorization: `Bearer ${svc}` },
    });
    const rows = await r.json();
    return json({ ok: true, count: Array.isArray(rows) ? rows.length : 0, users: rows });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
