import { createRemoteJWKSet, jwtVerify } from "jose";

// Verifies Firebase ID tokens the edge-safe way: check the RS256 signature
// against Google's published JWKS, plus issuer/audience/expiry. No service
// account or private key needed for this — that's only required for
// privileged admin operations (minting custom tokens, admin writes), not
// for verifying a token a client already has.
const JWKS = createRemoteJWKSet(
  new URL(
    "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"
  )
);

export function bearerToken(request) {
  const header = request.headers.get("authorization") || "";
  return header.startsWith("Bearer ") ? header.slice(7) : null;
}

export async function verifyFirebaseIdToken(token, projectId) {
  const { payload } = await jwtVerify(token, JWKS, {
    issuer: `https://securetoken.google.com/${projectId}`,
    audience: projectId,
  });
  return payload;
}
