// Vercel Function: triggers a fresh build after an admin saves content, so the prerendered
// pages (scripts/prerender.js) carry the new settings instead of the ones from the last deploy.
// Only signed-in admins can trigger it; the deploy hook URL never reaches the browser.
//
// Needs these Vercel environment variables:
//   VERCEL_DEPLOY_HOOK_URL — Project Settings → Git → Deploy Hooks (branch: main)
//   VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY — already set for the site

export async function POST(request) {
  const hookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
  if (!hookUrl || !supabaseUrl || !anonKey) {
    return new Response("Rebuild is not configured", { status: 500 });
  }

  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return new Response("Not signed in", { status: 401 });

  // Same admin check the database uses for writes (public.is_admin() in supabase_setup.sql)
  const check = await fetch(`${supabaseUrl}/rest/v1/rpc/is_admin`, {
    method: "POST",
    headers: { apikey: anonKey, Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: "{}",
  });
  if (!check.ok || (await check.json()) !== true) {
    return new Response("Not allowed", { status: 403 });
  }

  const hook = await fetch(hookUrl, { method: "POST" });
  if (!hook.ok) return new Response("Deploy hook failed", { status: 502 });
  return new Response("Rebuild started", { status: 202 });
}
