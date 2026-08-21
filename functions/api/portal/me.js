import { bearerToken, verifyFirebaseIdToken } from "../../_lib/firebaseAuth.js";

// Client portal (userid login) is not launched yet — see index.html "coming
// soon" modal. This placeholder confirms auth works end-to-end without
// exposing forms/templates yet.
export async function onRequestGet({ request, env }) {
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
