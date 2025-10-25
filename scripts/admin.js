// scripts/admin.js
import { db, auth } from "../firebase-config.js";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

// --- DOM ELEMENTS ---
const loginWrapper = document.getElementById("login-wrapper");
const adminContainer = document.getElementById("admin-container");

// --- AUTHENTICATION ---
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginWrapper.style.display = "none";
    adminContainer.style.display = "block";
    loadAllData();
  } else {
    loginWrapper.style.display = "flex";
    adminContainer.style.display = "none";
  }
});

document.getElementById("login-button").addEventListener("click", async () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    alert("Login failed: " + error.message);
  }
});

document
  .getElementById("logout-button")
  .addEventListener("click", () => signOut(auth));

// --- CLOUDINARY UPLOAD WIDGETS ---

// 1. WIDGET FOR IMAGES (jpg, png, etc.)
let currentImageInput = null;
const imageWidget = cloudinary.createUploadWidget(
  {
    cloudName: config.cloudinary.cloudName,
    uploadPreset: config.cloudinary.uploadPreset,
  },
  (error, result) => {
    if (!error && result && result.event === "success") {
      if (currentImageInput) {
        currentImageInput.value = result.info.secure_url;
      }
    }
  }
);

// 2. NEW WIDGET FOR RESUME (PDF only)
const resumeWidget = cloudinary.createUploadWidget(
  {
    cloudName: config.cloudinary.cloudName,
    uploadPreset: config.cloudinary.uploadPreset,
    sources: ["local"], // only allow upload from computer
    multiple: false, // only one file
    clientAllowedFormats: ["pdf"], // IMPORTANT: only allow PDF files
    resource_type: "raw", // Treat as a generic file
  },
  (error, result) => {
    if (!error && result && result.event === "success") {
      // When PDF upload is successful, populate the resume URL input
      document.getElementById("resume-url").value = result.info.secure_url;
      alert("Resume uploaded successfully!");
    }
  }
);

// --- SETUP UPLOAD BUTTONS ---

// Function to open the IMAGE widget for a specific input
function setupImageUploadButton(buttonId, inputId) {
  document.getElementById(buttonId).addEventListener(
    "click",
    function () {
      currentImageInput = document.getElementById(inputId);
      imageWidget.open();
    },
    false
  );
}

// Setup buttons that should open the image widget
setupImageUploadButton("upload-profile-pic", "profile-pic-url");
setupImageUploadButton("upload-project-image", "project-image-url");
setupImageUploadButton("upload-certificate-image", "certificate-image-url");

// NEW: Setup the button that opens the PDF/resume widget
document.getElementById("upload-resume-button").addEventListener(
  "click",
  function () {
    resumeWidget.open();
  },
  false
);

// --- DATA LOADING & SAVING (No changes below this line, but included for completeness) ---
function loadAllData() {
  loadProfileData();
  loadItems("projects", "projects-list", populateProjectForm);
  loadItems("certificates", "certificates-list", populateCertificateForm);
}

// Profile
async function loadProfileData() {
  try {
    const docRef = doc(db, "portfolio", "profile");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      document.getElementById("profile-name").value = data.name || "";
      document.getElementById("profile-job-title").value = data.jobTitle || "";
      document.getElementById("profile-bio").value = data.bio || "";
      document.getElementById("profile-pic-url").value =
        data.profilePicUrl || "";
      document.getElementById("resume-url").value = data.resumeUrl || ""; // This will now show the PDF URL
      document.getElementById("github-url").value = data.socials?.github || "";
      document.getElementById("instagram-url").value =
        data.socials?.instagram || "";
      document.getElementById("discord-url").value =
        data.socials?.discord || "";
    }
  } catch (error) {
    console.error("Error loading profile data:", error);
    alert("Could not load profile data.");
  }
}
document
  .getElementById("profile-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      name: document.getElementById("profile-name").value,
      jobTitle: document.getElementById("profile-job-title").value,
      bio: document.getElementById("profile-bio").value,
      profilePicUrl: document.getElementById("profile-pic-url").value,
      resumeUrl: document.getElementById("resume-url").value, // Saves the new PDF URL
      socials: {
        github: document.getElementById("github-url").value,
        instagram: document.getElementById("instagram-url").value,
        discord: document.getElementById("discord-url").value,
      },
    };
    try {
      await setDoc(doc(db, "portfolio", "profile"), data);
      alert("Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Error saving profile.");
    }
  });

// Generic Item Loader (for projects and certificates)
async function loadItems(collectionName, listElementId, editItemCallback) {
  const listElement = document.getElementById(listElementId);
  listElement.innerHTML = ""; // Clear current list
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    if (querySnapshot.empty) {
      listElement.innerHTML =
        "<p>No items found. Add one using the form below.</p>";
      return;
    }
    querySnapshot.forEach((doc) => {
      const item = doc.data();
      const itemDiv = document.createElement("div");
      itemDiv.className = "item";
      itemDiv.innerHTML = `
                <span>${item.title}</span>
                <div class="item-buttons">
                    <button class="btn-edit" data-id="${doc.id}"><i class="fas fa-edit"></i> Edit</button>
                    <button class="btn-delete" data-id="${doc.id}"><i class="fas fa-trash"></i> Delete</button>
                </div>
            `;
      itemDiv
        .querySelector(".btn-edit")
        .addEventListener("click", () => editItemCallback(doc.id, item));
      itemDiv
        .querySelector(".btn-delete")
        .addEventListener("click", () =>
          deleteItem(collectionName, doc.id, listElementId, editItemCallback)
        );

      listElement.appendChild(itemDiv);
    });
  } catch (error) {
    console.error(`Error loading ${collectionName}:`, error);
    listElement.innerHTML = `<p style="color:red;">Error loading items.</p>`;
  }
}

// Generic Item Deleter
async function deleteItem(collectionName, id, listElementId, editItemCallback) {
  if (
    confirm(
      "Are you sure you want to delete this item? This action cannot be undone."
    )
  ) {
    try {
      await deleteDoc(doc(db, collectionName, id));
      alert("Item deleted successfully.");
      loadItems(collectionName, listElementId, editItemCallback); // Refresh list
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Error deleting item.");
    }
  }
}

// --- PROJECTS ---
const projectForm = document.getElementById("project-form");
const projectFormTitle = document.getElementById("project-form-title");

function populateProjectForm(id, data) {
  projectFormTitle.textContent = "Edit Project";
  document.getElementById("project-id").value = id;
  document.getElementById("project-title").value = data.title;
  document.getElementById("project-description").value = data.description;
  document.getElementById("project-image-url").value = data.imageUrl;
  document.getElementById("project-live-url").value = data.liveUrl;
  document.getElementById("project-code-url").value = data.codeUrl;
}
projectForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const id = document.getElementById("project-id").value;
  const data = {
    title: document.getElementById("project-title").value,
    description: document.getElementById("project-description").value,
    imageUrl: document.getElementById("project-image-url").value,
    liveUrl: document.getElementById("project-live-url").value,
    codeUrl: document.getElementById("project-code-url").value,
  };
  try {
    if (id) {
      await updateDoc(doc(db, "projects", id), data);
    } else {
      await addDoc(collection(db, "projects"), data);
    }
    alert("Project saved successfully!");
    projectForm.reset();
    projectFormTitle.textContent = "Add New Project";
    document.getElementById("project-id").value = "";
    loadItems("projects", "projects-list", populateProjectForm);
  } catch (error) {
    console.error("Error saving project:", error);
    alert("Error saving project.");
  }
});
document.getElementById("clear-project-form").addEventListener("click", () => {
  projectForm.reset();
  projectFormTitle.textContent = "Add New Project";
  document.getElementById("project-id").value = "";
});

// --- CERTIFICATES ---
const certificateForm = document.getElementById("certificate-form");
const certificateFormTitle = document.getElementById("certificate-form-title");

function populateCertificateForm(id, data) {
  certificateFormTitle.textContent = "Edit Certificate";
  document.getElementById("certificate-id").value = id;
  document.getElementById("certificate-title").value = data.title;
  document.getElementById("certificate-issuer").value = data.issuer;
  document.getElementById("certificate-image-url").value = data.imageUrl;
  document.getElementById("certificate-verify-url").value = data.verifyUrl;
}
certificateForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const id = document.getElementById("certificate-id").value;
  const data = {
    title: document.getElementById("certificate-title").value,
    issuer: document.getElementById("certificate-issuer").value,
    imageUrl: document.getElementById("certificate-image-url").value,
    verifyUrl: document.getElementById("certificate-verify-url").value,
  };
  try {
    if (id) {
      await updateDoc(doc(db, "certificates", id), data);
    } else {
      await addDoc(collection(db, "certificates"), data);
    }
    alert("Certificate saved successfully!");
    certificateForm.reset();
    certificateFormTitle.textContent = "Add New Certificate";
    document.getElementById("certificate-id").value = "";
    loadItems("certificates", "certificates-list", populateCertificateForm);
  } catch (error) {
    console.error("Error saving certificate:", error);
    alert("Error saving certificate.");
  }
});
document
  .getElementById("clear-certificate-form")
  .addEventListener("click", () => {
    certificateForm.reset();
    certificateFormTitle.textContent = "Add New Certificate";
    document.getElementById("certificate-id").value = "";
  });
