// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

// Make sure config is defined in the global scope (from env.js)
if (typeof window.portfolioConfig === "undefined") {
  throw new Error(
    "Firebase configuration is missing. Make sure env.js is loaded and config is properly set."
  );
}

// Get the config from the window object
const config = window.portfolioConfig;

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
  if (!config.firebaseConfig[field]) {
    throw new Error(
      `Firebase configuration is missing required field: ${field}`
    );
  }
}

let firebaseApp;
let db;
let auth;

try {
  firebaseApp = initializeApp(config.firebaseConfig);
  db = getFirestore(firebaseApp);
  auth = getAuth(firebaseApp);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
  throw error;
}

export { db, auth };
