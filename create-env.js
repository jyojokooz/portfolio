const fs = require("fs");

// The content that will be written to env.js
const envContent = `
// This file is generated automatically by create-env.js during the build process
window.config = {
  firebaseConfig: {
    apiKey: "${process.env.FIREBASE_API_KEY}",
    authDomain: "${process.env.FIREBASE_AUTH_DOMAIN}",
    projectId: "${process.env.FIREBASE_PROJECT_ID}",
    storageBucket: "${process.env.FIREBASE_STORAGE_BUCKET}",
    messagingSenderId: "${process.env.FIREBASE_MESSAGING_SENDER_ID}",
    appId: "${process.env.FIREBASE_APP_ID}",
    measurementId: "${process.env.FIREBASE_MEASUREMENT_ID}",
  },
  cloudinary: {
    cloudName: "${process.env.CLOUDINARY_CLOUD_NAME}",
    uploadPreset: "${process.env.CLOUDINARY_UPLOAD_PRESET}",
  },
};
`;

// Write the content to the env.js file
fs.writeFile("env.js", envContent, (err) => {
  if (err) {
    console.error("Error creating env.js file:", err);
    process.exit(1); // Exit with an error code
  }
  console.log("Successfully created env.js from environment variables.");
});
