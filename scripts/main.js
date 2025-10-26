// scripts/main.js
import { db } from "../firebase-config.js";
import {
  doc,
  getDoc,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. DATA FETCHING & POPULATING FUNCTIONS ---

  async function populateHomePage() {
    try {
      console.log("Attempting to fetch profile data...");
      const docRef = doc(db, "portfolio", "profile");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Profile document exists");
        const data = docSnap.data();
        document.getElementById("profile-pic").src =
          data.profilePicUrl || "https://via.placeholder.com/150";
        document.getElementById("profile-pic").alt =
          data.name || "Profile Picture";
        document.getElementById("profile-name").textContent =
          data.name || "Your Name";
        document.getElementById("profile-job-title").textContent =
          data.jobTitle || "Your Job Title";
        document.getElementById("profile-bio").textContent =
          data.bio || "Your bio goes here.";
        document.getElementById("resume-button").href = data.resumeUrl || "#";

        // Populate Social Links
        const socialContainer = document.getElementById("social-links");
        socialContainer.innerHTML = ""; // Clear existing
        if (data.socials?.github) {
          socialContainer.innerHTML += `<a href="${data.socials.github}" title="GitHub" target="_blank" rel="noopener"><i class="fab fa-github"></i></a>`;
        }
        if (data.socials?.instagram) {
          socialContainer.innerHTML += `<a href="${data.socials.instagram}" title="Instagram" target="_blank" rel="noopener"><i class="fab fa-instagram"></i></a>`;
        }
        if (data.socials?.discord) {
          socialContainer.innerHTML += `<a href="${data.socials.discord}" title="Discord" target="_blank" rel="noopener"><i class="fab fa-discord"></i></a>`;
        }
      } else {
        console.log("No profile document found! Using placeholder data.");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  }

  async function populateProjects() {
    try {
      const projectsGrid = document.getElementById("projects-grid");
      projectsGrid.innerHTML = ""; // Clear placeholders
      const querySnapshot = await getDocs(collection(db, "projects"));
      let animationDelay = 0;
      querySnapshot.forEach((doc) => {
        const project = doc.data();
        animationDelay += 0.1;
        const projectCard = `
                    <div class="item-card" style="animation-delay: ${animationDelay}s">
                        <img src="${
                          project.imageUrl ||
                          "https://via.placeholder.com/400x180"
                        }" alt="${project.title}" />
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                        <div class="button-group">
                            ${
                              project.liveUrl
                                ? `<a href="${project.liveUrl}" class="btn-small" target="_blank" rel="noopener">Live</a>`
                                : ""
                            }
                            ${
                              project.codeUrl
                                ? `<a href="${project.codeUrl}" class="btn-small" target="_blank" rel="noopener">Code</a>`
                                : ""
                            }
                        </div>
                    </div>`;
        projectsGrid.innerHTML += projectCard;
      });
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }

  async function populateCertificates() {
    try {
      const certificatesGrid = document.getElementById("certificates-grid");
      certificatesGrid.innerHTML = ""; // Clear placeholders
      const querySnapshot = await getDocs(collection(db, "certificates"));
      let animationDelay = 0;
      querySnapshot.forEach((doc) => {
        const cert = doc.data();
        animationDelay += 0.1;
        const certCard = `
                    <div class="item-card" style="animation-delay: ${animationDelay}s">
                        <img src="${
                          cert.imageUrl || "https://via.placeholder.com/400x180"
                        }" alt="${cert.title}" />
                        <h3>${cert.title}</h3>
                        <p>Issued by: ${cert.issuer}</p>
                        <div class="button-group">
                            ${
                              cert.verifyUrl
                                ? `<a href="${cert.verifyUrl}" class="btn-small" target="_blank" rel="noopener">Verify</a>`
                                : ""
                            }
                        </div>
                    </div>`;
        certificatesGrid.innerHTML += certCard;
      });
    } catch (error) {
      console.error("Error fetching certificates:", error);
    }
  }

  // --- ORIGINAL PORTFOLIO JAVASCRIPT LOGIC ---

  // --- A. LOADING SCREEN & DATA INITIALIZATION ---
  const loadingScreen = document.getElementById("loading-screen");
  const portfolioContainer = document.getElementById("portfolio-container");

  // *** FIXED: Replaced large inline animation data with a clean, reliable path ***
  const loadingAnimation = lottie.loadAnimation({
    container: document.getElementById("loading-animation"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "https://lottie.host/889f35c7-2c6a-48a2-9709-7053fa28d229/189k5284ze.json",
  });

  // Fetch all data, then hide loading screen
  Promise.all([populateHomePage(), populateProjects(), populateCertificates()])
    .then(() => {
      console.log("All data fetching functions have completed.");

      setTimeout(() => {
        loadingScreen.classList.add("hide");
        portfolioContainer.classList.add("show");

        // Stop loading animation after transition
        setTimeout(() => {
          loadingAnimation.destroy();
        }, 500);
      }, 1500); // Keep a minimum delay for aesthetic reasons
    })
    .catch((error) => {
      console.error("A critical error occurred during data fetching:", error);
      // You could display an error message to the user here
    });

  // --- B. LOTTIE ANIMATIONS (DECORATIVE) ---
  const lottieBg = lottie.loadAnimation({
    container: document.getElementById("lottie-bg"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "https://lottie.host/4c6da31c-2eee-4597-80e5-2c29d2d3f3ef/YEdkZGPzrr.json",
  });

  setTimeout(() => {
    lottie.loadAnimation({
      container: document.getElementById("lottie-top-left"),
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "https://lottie.host/embed/dd1ad89a-093c-40ad-be27-c26766194b74/kqodXzYwCZ.json",
    });
    lottie.loadAnimation({
      container: document.getElementById("lottie-top-right"),
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "https://lottie.host/b58d2644-bd8c-45de-b1bc-d4b5f8be7b65/yGhcpjjNJf.json",
    });
    lottie.loadAnimation({
      container: document.getElementById("lottie-bottom-left"),
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "https://lottie.host/6e38b84d-5c0b-4d71-9c3f-abbb0eb10831/4dgYipsDhj.json",
    });
    lottie.loadAnimation({
      container: document.getElementById("lottie-bottom-right"),
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "https://lottie.host/8ea7fdf7-69b7-4cc9-aaf2-5ffb2d1c2f17/ckQ9nDj01Q.json",
    });
  }, 2000);

  // --- C. THEME TOGGLER ---
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;
  const sunIcon = '<i class="fas fa-sun"></i>';
  const moonIcon = '<i class="fas fa-moon"></i>';

  const applyTheme = (theme) => {
    if (theme === "dark") {
      body.classList.add("dark-mode");
      themeToggle.innerHTML = sunIcon;
    } else {
      body.classList.remove("dark-mode");
      themeToggle.innerHTML = moonIcon;
    }
  };

  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);

  themeToggle.addEventListener("click", () => {
    const newTheme = body.classList.contains("dark-mode") ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  });

  // --- D. SECTION NAVIGATION ---
  const navLinks = document.querySelectorAll(".nav-link, .btn[data-section]");
  const contentSections = document.querySelectorAll(".content-section");

  const resetItemAnimations = (sectionId) => {
    const grid = document.getElementById(`${sectionId}-grid`);
    if (!grid) return;

    const itemCards = grid.querySelectorAll(".item-card");
    itemCards.forEach((card) => {
      card.style.animation = "none";
      // The following line forces a reflow, which is necessary for the animation to restart
      void card.offsetWidth;
      card.style.animation = "";
    });
  };

  let homeAnimated = false;
  const markHomeAsLoaded = () => {
    if (!homeAnimated) {
      homeAnimated = true;
      setTimeout(() => {
        document.querySelector(".home-card")?.classList.add("loaded");
        document
          .querySelector(".profile-image-container")
          ?.classList.add("loaded");
        document.querySelector(".name-title")?.classList.add("loaded");
        document.querySelector(".job-title")?.classList.add("loaded");
        document.querySelector(".bio-description")?.classList.add("loaded");
        document.querySelector(".social-links")?.classList.add("loaded");
        document.querySelector(".button-group")?.classList.add("loaded");
      }, 1500);
    }
  };

  markHomeAsLoaded();

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const targetId = link.dataset.target || link.dataset.section;
      if (!targetId) return;

      // Update active link styling
      document
        .querySelectorAll(".nav-link")
        .forEach((l) => l.classList.remove("active"));
      document
        .querySelectorAll(`.nav-link[data-target="${targetId}"]`)
        .forEach((l) => l.classList.add("active"));

      // Switch active content section
      contentSections.forEach((section) => {
        section.classList.remove("active");
      });
      document.getElementById(targetId)?.classList.add("active");

      // Reset animations for project/certificate cards when their section becomes active
      if (targetId === "projects" || targetId === "certificates") {
        resetItemAnimations(targetId);
      }

      // Scroll to top of main content area
      document.querySelector(".main-content").scrollTop = 0;
    });
  });
});
