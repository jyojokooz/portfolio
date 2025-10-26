// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

// Check if window.config exists (it's created by env.js)
if (typeof window.config === "undefined") {
  throw new Error(
    "Configuration is missing. Make sure env.js is loaded and the config object is defined."
  );
}

// Get the config directly from the window.config object
const firebaseConfig = window.config.firebaseConfig;

// Validate Firebase configuration
const requiredFields = [
  "apiKey",
  "authDomain",
  "projectId",
  "storageBucket",
  "messagingSenderId",
  "appId",
];
for (const field of requiredFields) {
  if (!firebaseConfig[field]) {
    throw new Error(
      `Firebase configuration is missing required field: ${field}`
    );
  }
}

let firebaseApp;
let db;
let auth;

try {
  firebaseApp = initializeApp(firebaseConfig);
  db = getFirestore(firebaseApp);
  auth = getAuth(firebaseApp);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
  throw error;
}

export { db, auth };
