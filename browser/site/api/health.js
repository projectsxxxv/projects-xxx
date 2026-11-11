"use strict";

module.exports = function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: "Método não permitido." }));
  }
  let firebaseConfigured = false;
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || "null");
    firebaseConfigured = Boolean(serviceAccount?.project_id && serviceAccount?.client_email && serviceAccount?.private_key);
  } catch {}
  const pixVaultConfigured = Boolean(process.env.PIXVAULT_TOKEN && process.env.PIXVAULT_CLIENT_ID);
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  return res.end(JSON.stringify({
    status: "ok",
    storage: "firestore",
    firebaseCredentialsPresent: firebaseConfigured,
    pixVaultConfigured,
    checkoutReady: firebaseConfigured && pixVaultConfigured,
  }));
};
