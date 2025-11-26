const admin = require('firebase-admin');

let appInitialized = false;

function initFirebase() {
  if (appInitialized) return admin;
  const key = process.env.FIREBASE_KEY;
  if (!key) throw new Error('FIREBASE_KEY env var is required');

  let serviceAccount;
  try {
    serviceAccount = typeof key === 'string' ? JSON.parse(key) : key;
  } catch (err) {
    throw new Error('Failed to parse FIREBASE_KEY: ' + err.message);
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  appInitialized = true;
  return admin;
}

module.exports = initFirebase();
