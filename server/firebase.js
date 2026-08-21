import { readFileSync } from "node:fs";
import admin from "firebase-admin";

const credentialPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

if (!credentialPath) {
  throw new Error(
    "FIREBASE_SERVICE_ACCOUNT_PATH is not set. Point it at your service account JSON (see .env.example)."
  );
}

const serviceAccount = JSON.parse(readFileSync(credentialPath, "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const auth = admin.auth();
export const db = admin.firestore();
export default admin;
