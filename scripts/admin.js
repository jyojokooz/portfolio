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

const resumeWidget = cloudinary.createUploadWidget(
  {
    cloudName: config.cloudinary.cloudName,
    uploadPreset: config.cloudinary.uploadPreset,
    sources: ["local"],
    multiple: false,
    clientAllowedFormats: ["pdf"],
    resource_type: "raw",
  },
  (error, result) => {
    if (!error && result && result.event === "success") {
      document.getElementById("resume-url").value = result.info.secure_url;
      alert("Resume uploaded successfully!");
    }
  }
);

// --- SETUP UPLOAD BUTTONS ---
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

setupImageUploadButton("upload-profile-pic", "profile-pic-url");
setupImageUploadButton("upload-background-image", "background-image-url");
setupImageUploadButton("upload-project-image", "project-image-url");
setupImageUploadButton("upload-certificate-image", "certificate-image-url");

document.getElementById("upload-resume-button").addEventListener(
  "click",
  function () {
    resumeWidget.open();
  },
  false
);

// --- DATA LOADING & SAVING ---
function loadAllData() {
  loadProfileData();
  loadThemeData();
  loadItems("projects", "projects-list", populateProjectForm);
  loadItems("certificates", "certificates-list", populateCertificateForm);
  loadItems("skills", "skills-list", () => {});
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
      document.getElementById("background-image-url").value =
        data.backgroundUrl || "";
      document.getElementById("resume-url").value = data.resumeUrl || "";
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
      backgroundUrl: document.getElementById("background-image-url").value,
      resumeUrl: document.getElementById("resume-url").value,
      socials: {
        github: document.getElementById("github-url").value,
        instagram: document.getElementById("instagram-url").value,
        discord: document.getElementById("discord-url").value,
      },
    };
    try {
      await setDoc(doc(db, "portfolio", "profile"), data, { merge: true });
      alert("Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Error saving profile.");
    }
  });

// Theme Helpers
function parseGradient(gradientString) {
  const defaults = { angle: "135deg", color1: "#ffffff", color2: "#000000" };
  if (!gradientString || !gradientString.includes("gradient")) {
    return defaults;
  }

  // Regex to capture angle, and all color stops. We'll just use the first two colors found.
  const regex = /linear-gradient\(([^,]+),(.+)\)/;
  const match = gradientString.match(regex);

  if (!match) return defaults;

  const angle = match[1].trim();
  const colorStops = match[2].split(",");

  // Extract just the color hex/rgb values
  const colors = colorStops
    .map((stop) => {
      const colorMatch = stop.trim().match(/(#[0-9a-fA-F]{3,6}|rgba?\(.+\))/);
      return colorMatch ? colorMatch[0] : null;
    })
    .filter(Boolean);

  return {
    angle: angle,
    color1: colors[0] || defaults.color1,
    color2: colors[1] || defaults.color2,
  };
}

function constructGradient(baseId) {
  const angle = document.getElementById(`${baseId}-angle`).value || "135deg";
  const color1 = document.getElementById(`${baseId}-color1`).value;
  const color2 = document.getElementById(`${baseId}-color2`).value;
  return `linear-gradient(${angle}, ${color1}, ${color2})`;
}

// Theme
async function loadThemeData() {
  try {
    const docRef = doc(db, "portfolio", "theme");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const gradients = [
        "primary",
        "sunset",
        "ocean",
        "fire",
        "aurora",
        "cosmic",
      ];

      gradients.forEach((gradName) => {
        if (data[gradName]) {
          const { angle, color1, color2 } = parseGradient(data[gradName]);
          document.getElementById(`gradient-${gradName}-angle`).value = angle;
          document.getElementById(`gradient-${gradName}-color1`).value = color1;
          document.getElementById(`gradient-${gradName}-color2`).value = color2;
        }
      });
    }
  } catch (error) {
    console.error("Error loading theme data:", error);
    alert("Could not load theme data.");
  }
}
document.getElementById("theme-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    primary: constructGradient("gradient-primary"),
    sunset: constructGradient("gradient-sunset"),
    ocean: constructGradient("gradient-ocean"),
    fire: constructGradient("gradient-fire"),
    aurora: constructGradient("gradient-aurora"),
    cosmic: constructGradient("gradient-cosmic"),
  };
  try {
    await setDoc(doc(db, "portfolio", "theme"), data);
    alert("Theme saved successfully!");
  } catch (error) {
    console.error("Error saving theme:", error);
    alert("Error saving theme.");
  }
});

// Generic Item Loader
async function loadItems(collectionName, listElementId, editItemCallback) {
  const listElement = document.getElementById(listElementId);
  listElement.innerHTML = "";
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    if (querySnapshot.empty) {
      listElement.innerHTML =
        "<p>No items found. Add one using the form below.</p>";
      return;
    }
    querySnapshot.forEach((doc) => {
      const item = doc.data();
      const itemTitle = item.title || item.name;
      const itemDiv = document.createElement("div");
      itemDiv.className = "item";
      itemDiv.innerHTML = `
        <span>${itemTitle}</span>
        <div class="item-buttons">
            ${
              collectionName !== "skills"
                ? `<button class="btn-edit" data-id="${doc.id}"><i class="fas fa-edit"></i> Edit</button>`
                : ""
            }
            <button class="btn-delete" data-id="${
              doc.id
            }"><i class="fas fa-trash"></i> Delete</button>
        </div>
      `;
      if (collectionName !== "skills") {
        itemDiv
          .querySelector(".btn-edit")
          .addEventListener("click", () => editItemCallback(doc.id, item));
      }
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
  if (confirm("Are you sure you want to delete this item?")) {
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

// --- SKILLS ---
const skillForm = document.getElementById("skill-form");

skillForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const data = {
    name: document.getElementById("skill-name").value,
    iconClass: document.getElementById("skill-icon-class").value,
  };
  try {
    await addDoc(collection(db, "skills"), data);
    alert("Skill saved successfully!");
    skillForm.reset();
    loadItems("skills", "skills-list", () => {});
  } catch (error) {
    console.error("Error saving skill:", error);
    alert("Error saving skill.");
  }
});
