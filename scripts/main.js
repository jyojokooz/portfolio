// scripts/main.js
import { db } from "../firebase-config.js";
import {
  doc,
  getDoc,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

let projectsData = new Map();

document.addEventListener("DOMContentLoaded", () => {
  // Set Contact Email
  const userEmail = "joelraphael6425@gmail.com";
  const contactEmailLink = document.getElementById("contact-email");
  if (contactEmailLink) {
    contactEmailLink.href = `mailto:${userEmail}`;
    contactEmailLink.textContent = userEmail;
  }

  // --- 1. DATA FETCHING & POPULATING FUNCTIONS ---

  async function populateHomePage() {
    try {
      const docRef = doc(db, "portfolio", "profile");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
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

        const socialLinksHTML = `
          ${
            data.socials?.github
              ? `<a href="${data.socials.github}" title="GitHub" target="_blank" rel="noopener"><i class="fab fa-github"></i></a>`
              : ""
          }
          ${
            data.socials?.instagram
              ? `<a href="${data.socials.instagram}" title="Instagram" target="_blank" rel="noopener"><i class="fab fa-instagram"></i></a>`
              : ""
          }
          ${
            data.socials?.discord
              ? `<a href="${data.socials.discord}" title="Discord" target="_blank" rel="noopener"><i class="fab fa-discord"></i></a>`
              : ""
          }
        `;
        document.getElementById("social-links").innerHTML = socialLinksHTML;
        document.getElementById("contact-social-icons").innerHTML =
          socialLinksHTML;
      } else {
        console.log("No profile document found!");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  }

  async function populateProjects() {
    try {
      const projectsGrid = document.getElementById("projects-grid");
      projectsGrid.innerHTML = "";
      projectsData.clear();
      const querySnapshot = await getDocs(collection(db, "projects"));
      const placeholderImg = "https://via.placeholder.com/400x180";

      const truncateText = (text, maxLength) => {
        if (!text || text.length <= maxLength) return text;
        const lastSpace = text.lastIndexOf(" ", maxLength);
        return text.substring(0, lastSpace > 0 ? lastSpace : maxLength) + "...";
      };

      querySnapshot.forEach((doc) => {
        const project = doc.data();
        projectsData.set(doc.id, project);
        const shortDescription = truncateText(project.description, 100);

        const projectCard = `
          <div class="item-card">
              <img src="${
                project.imageUrl ? project.imageUrl : placeholderImg
              }" alt="${project.title}" />
              <div class="item-card-content">
                <h3>${project.title}</h3>
                <p>${shortDescription}</p>
              </div>
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
                  <button class="btn-small view-details-btn" data-project-id="${
                    doc.id
                  }">Details</button>
              </div>
          </div>`;
        projectsGrid.innerHTML += projectCard;
      });
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }

  async function populateSkills() {
    try {
      const skillsGrid = document.getElementById("skills-grid");
      skillsGrid.innerHTML = "";
      const querySnapshot = await getDocs(collection(db, "skills"));
      querySnapshot.forEach((doc) => {
        const skill = doc.data();
        const skillCard = `
          <div class="skill-card">
              <i class="${skill.iconClass}"></i>
              <span>${skill.name}</span>
          </div>
        `;
        skillsGrid.innerHTML += skillCard;
      });
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  }

  async function populateCertificates() {
    try {
      const certificatesGrid = document.getElementById("certificates-grid");
      certificatesGrid.innerHTML = "";
      const querySnapshot = await getDocs(collection(db, "certificates"));
      const placeholderImg = "https://via.placeholder.com/400x180";

      querySnapshot.forEach((doc) => {
        const cert = doc.data();
        const certCard = `
          <div class="item-card">
              <img src="${
                cert.imageUrl ? cert.imageUrl : placeholderImg
              }" alt="${cert.title}" />
              <div class="item-card-content">
                <h3>${cert.title}</h3>
                <p>Issued by: ${cert.issuer}</p>
              </div>
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

  // --- A. LOADING SCREEN & DATA INITIALIZATION ---
  const loadingScreen = document.getElementById("loading-screen");
  const portfolioContainer = document.getElementById("portfolio-container");
  const loadingAnimation = lottie.loadAnimation({
    container: document.getElementById("loading-animation"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "https://lottie.host/1c731f82-a968-4131-b75f-356401918a28/w2uFFJ4L5H.json",
  });

  Promise.all([
    populateHomePage(),
    populateProjects(),
    populateSkills(),
    populateCertificates(),
  ]).then(() => {
    console.log("All data loaded successfully.");
    setTimeout(() => {
      loadingScreen.classList.add("hide");
      portfolioContainer.classList.add("show");
      setTimeout(() => loadingAnimation.destroy(), 500);
    }, 1500);
  });

  // --- C. THEME TOGGLER ---
  const body = document.body;
  const mobileThemeToggle = document.getElementById("mobile-theme-toggle");
  const desktopThemeToggle = document.getElementById("desktop-theme-toggle");
  const sunIcon = '<i class="fas fa-sun"></i>';
  const moonIcon = '<i class="fas fa-moon"></i>';

  const applyTheme = (theme) => {
    body.classList.toggle("dark-mode", theme === "dark");
    const newIcon = theme === "dark" ? sunIcon : moonIcon;
    mobileThemeToggle.innerHTML = newIcon;
    if (desktopThemeToggle) {
      desktopThemeToggle.innerHTML = newIcon;
    }

    if (window.pJSDom && window.pJSDom[0]) {
      const particlesInstance = window.pJSDom[0].pJS;
      const newColor = theme === "dark" ? "#ffffff" : "#1a1a1a";
      particlesInstance.particles.color.value = newColor;
      particlesInstance.particles.line_linked.color = newColor;
      particlesInstance.fn.particlesRefresh();
    }
  };

  const savedTheme = localStorage.getItem("theme") || "dark";
  applyTheme(savedTheme);

  const toggleTheme = () => {
    const newTheme = body.classList.contains("dark-mode") ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  mobileThemeToggle.addEventListener("click", toggleTheme);
  if (desktopThemeToggle) {
    desktopThemeToggle.addEventListener("click", toggleTheme);
  }

  // --- D. SECTION NAVIGATION WITH PAGE TRANSITIONS ---
  const allNavTriggers = document.querySelectorAll("[data-target]");
  let isTransitioning = false;

  allNavTriggers.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      if (isTransitioning) return;

      const targetId = link.dataset.target;
      const currentActiveSection = document.querySelector(
        ".content-section.active"
      );

      if (
        !targetId ||
        (currentActiveSection && currentActiveSection.id === targetId)
      )
        return;
      isTransitioning = true;
      document
        .querySelectorAll(".nav-link")
        .forEach((l) => l.classList.remove("active"));
      document
        .querySelectorAll(`.nav-link[data-target="${targetId}"]`)
        .forEach((l) => l.classList.add("active"));

      if (currentActiveSection) {
        currentActiveSection.classList.add("fade-out");
        setTimeout(() => {
          currentActiveSection.classList.remove("active", "fade-out");
          const targetSection = document.getElementById(targetId);
          if (targetSection) targetSection.classList.add("active");
          document.querySelector(".main-content").scrollTop = 0;
          isTransitioning = false;
        }, 500);
      } else {
        const targetSection = document.getElementById(targetId);
        if (targetSection) targetSection.classList.add("active");
        isTransitioning = false;
      }
    });
  });

  // --- E. PROJECT MODAL LOGIC ---
  const projectModal = document.getElementById("project-modal");
  const projectsGridContainer = document.getElementById("projects-grid");
  const closeModalBtn = projectModal.querySelector(".modal-close");

  function showProjectDetails(projectId) {
    const project = projectsData.get(projectId);
    if (!project) return;
    document.getElementById("modal-project-image").src =
      project.imageUrl || "https://via.placeholder.com/400x180";
    document.getElementById("modal-project-title").textContent = project.title;
    document.getElementById("modal-project-description").textContent =
      project.description;
    projectModal.style.display = "flex";
  }

  function closeProjectModal() {
    projectModal.style.display = "none";
  }

  projectsGridContainer.addEventListener("click", (e) => {
    const detailsButton = e.target.closest(".view-details-btn");
    if (detailsButton) {
      showProjectDetails(detailsButton.dataset.projectId);
    }
  });

  closeModalBtn.addEventListener("click", closeProjectModal);
  projectModal.addEventListener("click", (e) => {
    if (e.target === projectModal) closeProjectModal();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeProjectModal();
  });
});
