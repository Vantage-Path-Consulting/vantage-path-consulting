import "dotenv/config";
import cors from "cors";
import express from "express";
import { auth } from "./firebase.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// Verifies a Firebase ID token sent as "Authorization: Bearer <token>".
// Used by future client-portal routes to identify the logged-in user.
async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing bearer token" });

  try {
    req.user = await auth.verifyIdToken(token);
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

// Client portal (userid login) is not launched yet — see index.html "coming soon" modal.
// This placeholder confirms auth works end-to-end without exposing forms/templates yet.
app.get("/api/portal/me", requireAuth, (req, res) => {
  res.json({
    uid: req.user.uid,
    email: req.user.email || null,
    status: "coming_soon",
  });
});

const port = process.env.PORT || 8787;
app.listen(port, () => {
  console.log(`vantage-path-backend listening on :${port}`);
});
