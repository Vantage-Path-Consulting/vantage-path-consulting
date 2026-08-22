import { bearerToken, verifyFirebaseIdToken } from "./lib/firebaseAuth.js";

function handleHealth() {
  return Response.json({ ok: true });
}

// Client portal (userid login) is not launched yet — see index.html "coming
// soon" modal. This placeholder confirms auth works end-to-end without
// exposing forms/templates yet.
async function handlePortalMe(request, env) {
  const token = bearerToken(request);
  if (!token) {
    return Response.json({ error: "Missing bearer token" }, { status: 401 });
  }

  if (!env.FIREBASE_PROJECT_ID) {
    return Response.json(
      { error: "Server misconfigured: FIREBASE_PROJECT_ID not set" },
      { status: 500 }
    );
  }

  try {
    const payload = await verifyFirebaseIdToken(token, env.FIREBASE_PROJECT_ID);
    return Response.json({
      uid: payload.sub,
      email: payload.email || null,
      status: "coming_soon",
    });
  } catch (err) {
    return Response.json({ error: "Invalid or expired token" }, { status: 401 });
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") return handleHealth();
    if (url.pathname === "/api/portal/me") return handlePortalMe(request, env);

    return env.ASSETS.fetch(request);
  },
};
