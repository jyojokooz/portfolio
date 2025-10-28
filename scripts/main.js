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
    animationData: {
      v: "4.10.1",
      fr: 24,
      ip: 0,
      op: 72,
      w: 400,
      h: 400,
      nm: "Comp 1",
      ddd: 0,
      assets: [
        {
          id: "comp_0",
          layers: [
            {
              ddd: 0,
              ind: 1,
              ty: 4,
              nm: "Capa de formas 12",
              sr: 1,
              ks: {
                o: { a: 0, k: 100, ix: 11 },
                r: { a: 0, k: 0, ix: 10 },
                p: {
                  a: 1,
                  k: [
                    {
                      i: { x: 0.833, y: 0.833 },
                      o: { x: 0.167, y: 0.167 },
                      n: "0p833_0p833_0p167_0p167",
                      t: 24,
                      s: [81.5, 370.25, 0],
                      e: [445.5, 199.25, 0],
                      to: [60.6666679382324, -28.5, 0],
                      ti: [-60.6666679382324, 28.5, 0],
                    },
                    { t: 48 },
                  ],
                  ix: 2,
                },
                a: { a: 0, k: [0, 0, 0], ix: 1 },
                s: { a: 0, k: [43, 43, 100], ix: 6 },
              },
              ao: 0,
              shapes: [
                {
                  ty: "gr",
                  it: [
                    {
                      ind: 0,
                      ty: "sh",
                      ix: 1,
                      ks: {
                        a: 0,
                        k: {
                          i: [
                            [28, 0],
                            [34.935, -19.483],
                            [31.619, 18.821],
                            [33, -14],
                            [57, 29],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                          ],
                          o: [
                            [-28, 0],
                            [-52, 29],
                            [-42, -25],
                            [-28.892, 12.257],
                            [-57, -29],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                          ],
                          v: [
                            [367.75, -97],
                            [277, -75],
                            [155, -82],
                            [35, -82],
                            [-94, -82.326],
                            [-200, -74],
                            [-352.07, 320.209],
                            [499.162, 354.093],
                          ],
                          c: true,
                        },
                        ix: 2,
                      },
                      nm: "Trazado 1",
                      mn: "ADBE Vector Shape - Group",
                      hd: false,
                    },
                    {
                      ty: "fl",
                      c: { a: 0, k: [0.1255, 0.1529, 0.1725, 1], ix: 4 },
                      o: { a: 0, k: 100, ix: 5 },
                      r: 1,
                      nm: "Relleno 1",
                      mn: "ADBE Vector Graphic - Fill",
                      hd: false,
                    },
                    {
                      ty: "tr",
                      p: { a: 0, k: [0, 0], ix: 2 },
                      a: { a: 0, k: [0, 0], ix: 1 },
                      s: { a: 0, k: [100, 100], ix: 3 },
                      r: { a: 0, k: 0, ix: 6 },
                      o: { a: 0, k: 100, ix: 7 },
                      sk: { a: 0, k: 0, ix: 4 },
                      sa: { a: 0, k: 0, ix: 5 },
                      nm: "Transformar",
                    },
                  ],
                  nm: "Forma 1",
                  np: 3,
                  cix: 2,
                  ix: 1,
                  mn: "ADBE Vector Group",
                  hd: false,
                },
              ],
              ip: 0,
              op: 144,
              st: 0,
              bm: 0,
            },
            {
              ddd: 0,
              ind: 2,
              ty: 4,
              nm: "Capa de formas 2",
              sr: 1,
              ks: {
                o: { a: 0, k: 100, ix: 11 },
                r: { a: 0, k: 0, ix: 10 },
                p: {
                  a: 1,
                  k: [
                    {
                      i: { x: 0.833, y: 0.833 },
                      o: { x: 0.167, y: 0.167 },
                      n: "0p833_0p833_0p167_0p167",
                      t: 24,
                      s: [-133, 374, 0],
                      e: [231, 203, 0],
                      to: [60.6666679382324, -28.5, 0],
                      ti: [-60.6666679382324, 28.5, 0],
                    },
                    { t: 48 },
                  ],
                  ix: 2,
                },
                a: { a: 0, k: [0, 0, 0], ix: 1 },
                s: { a: 0, k: [43, 43, 100], ix: 6 },
              },
              ao: 0,
              shapes: [
                {
                  ty: "gr",
                  it: [
                    {
                      ind: 0,
                      ty: "sh",
                      ix: 1,
                      ks: {
                        a: 0,
                        k: {
                          i: [
                            [28, 0],
                            [34.935, -19.483],
                            [31.619, 18.821],
                            [33, -14],
                            [57, 29],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                          ],
                          o: [
                            [-28, 0],
                            [-52, 29],
                            [-42, -25],
                            [-28.892, 12.257],
                            [-57, -29],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                          ],
                          v: [
                            [367.75, -97],
                            [277, -75],
                            [155, -82],
                            [35, -82],
                            [-94, -82.326],
                            [-200, -74],
                            [-352.07, 320.209],
                            [499.162, 354.093],
                          ],
                          c: true,
                        },
                        ix: 2,
                      },
                      nm: "Trazado 1",
                      mn: "ADBE Vector Shape - Group",
                      hd: false,
                    },
                    {
                      ty: "fl",
                      c: { a: 0, k: [0.9922, 0.949, 0.9922, 1], ix: 4 },
                      o: { a: 0, k: 100, ix: 5 },
                      r: 1,
                      nm: "Relleno 1",
                      mn: "ADBE Vector Graphic - Fill",
                      hd: false,
                    },
                    {
                      ty: "tr",
                      p: { a: 0, k: [0, 0], ix: 2 },
                      a: { a: 0, k: [0, 0], ix: 1 },
                      s: { a: 0, k: [100, 100], ix: 3 },
                      r: { a: 0, k: 0, ix: 6 },
                      o: { a: 0, k: 100, ix: 7 },
                      sk: { a: 0, k: 0, ix: 4 },
                      sa: { a: 0, k: 0, ix: 5 },
                      nm: "Transformar",
                    },
                  ],
                  nm: "Forma 1",
                  np: 3,
                  cix: 2,
                  ix: 1,
                  mn: "ADBE Vector Group",
                  hd: false,
                },
              ],
              ip: 0,
              op: 144,
              st: 0,
              bm: 0,
            },
          ],
        },
      ],
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: "Capa de formas 5",
          sr: 1,
          ks: {
            o: {
              a: 1,
              k: [
                {
                  i: { x: [0.833], y: [0.833] },
                  o: { x: [0.167], y: [0.167] },
                  n: ["0p833_0p833_0p167_0p167"],
                  t: 15,
                  s: [100],
                  e: [0],
                },
                { t: 16 },
              ],
              ix: 11,
            },
            r: { a: 0, k: 0, ix: 10 },
            p: {
              a: 1,
              k: [
                {
                  i: { x: 0.833, y: 0.833 },
                  o: { x: 0.167, y: 0.167 },
                  n: "0p833_0p833_0p167_0p167",
                  t: 0,
                  s: [199, -14, 0],
                  e: [199, 156, 0],
                  to: [0, 28.3333339691162, 0],
                  ti: [0, -28.9375, 0],
                },
                {
                  i: { x: 0.833, y: 0.833 },
                  o: { x: 0.167, y: 0.167 },
                  n: "0p833_0p833_0p167_0p167",
                  t: 12,
                  s: [199, 156, 0],
                  e: [199, 164.066, 0],
                  to: [0, 4.54861259460449, 0],
                  ti: [0, -2.45892143249512, 0],
                },
                {
                  i: { x: 0.833, y: 0.833 },
                  o: { x: 0.167, y: 0.167 },
                  n: "0p833_0p833_0p167_0p167",
                  t: 13,
                  s: [199, 164.066, 0],
                  e: [199, 166.125, 0],
                  to: [0, 13.1843204498291, 0],
                  ti: [0, -1.72074222564697, 0],
                },
                {
                  i: { x: 0.833, y: 0.833 },
                  o: { x: 0.167, y: 0.167 },
                  n: "0p833_0p833_0p167_0p167",
                  t: 14,
                  s: [199, 166.125, 0],
                  e: [199, 168.375, 0],
                  to: [0, 2.04166674613953, 0],
                  ti: [0, -0.04166666790843, 0],
                },
                { t: 15 },
              ],
              ix: 2,
            },
            a: { a: 0, k: [-1, -182.375, 0], ix: 1 },
            s: {
              a: 1,
              k: [
                {
                  i: { x: [0.833, 0.833, 0.833], y: [0.833, 0.833, 0.833] },
                  o: { x: [0.167, 0.167, 0.167], y: [0.167, 0.167, 0.167] },
                  n: [
                    "0p833_0p833_0p167_0p167",
                    "0p833_0p833_0p167_0p167",
                    "0p833_0p833_0p167_0p167",
                  ],
                  t: 0,
                  s: [50, 50, 100],
                  e: [50, 94, 100],
                },
                {
                  i: { x: [0.833, 0.833, 0.833], y: [0.833, 0.833, 0.833] },
                  o: { x: [0.167, 0.167, 0.167], y: [0.167, 0.167, 0.167] },
                  n: [
                    "0p833_0p833_0p167_0p167",
                    "0p833_0p833_0p167_0p167",
                    "0p833_0p833_0p167_0p167",
                  ],
                  t: 12,
                  s: [50, 94, 100],
                  e: [70, 43.333, 100],
                },
                {
                  i: { x: [0.833, 0.833, 0.833], y: [0.833, 0.833, 0.833] },
                  o: { x: [0.167, 0.167, 0.167], y: [0.167, 0.167, 0.167] },
                  n: [
                    "0p833_0p833_0p167_0p167",
                    "0p833_0p833_0p167_0p167",
                    "0p833_0p833_0p167_0p167",
                  ],
                  t: 13,
                  s: [70, 43.333, 100],
                  e: [104.258, 32, 100],
                },
                {
                  i: { x: [0.833, 0.833, 0.833], y: [0.833, 0.833, 0.833] },
                  o: { x: [0.167, 0.167, 0.167], y: [0.167, 0.167, 0.167] },
                  n: [
                    "0p833_0p833_0p167_0p167",
                    "0p833_0p833_0p167_0p167",
                    "0p833_0p833_0p167_0p167",
                  ],
                  t: 14,
                  s: [104.258, 32, 100],
                  e: [212, 18, 100],
                },
                { t: 15 },
              ],
              ix: 6,
            },
          },
          ao: 0,
          shapes: [
            {
              ty: "gr",
              it: [
                {
                  ind: 0,
                  ty: "sh",
                  ix: 1,
                  ks: {
                    a: 0,
                    k: {
                      i: [
                        [0.938, 0],
                        [0, -5.25],
                        [-4.563, 0.125],
                        [0.108, 4.624],
                      ],
                      o: [
                        [-0.813, 0.125],
                        [0, 4.813],
                        [4.563, -0.125],
                        [-0.125, -5.375],
                      ],
                      v: [
                        [-1.344, -193.078],
                        [-8.75, -180.5],
                        [-1.063, -172.313],
                        [6.938, -180.188],
                      ],
                      c: true,
                    },
                    ix: 2,
                  },
                  nm: "Trazado 1",
                  mn: "ADBE Vector Shape - Group",
                  hd: false,
                },
                {
                  ty: "fl",
                  c: { a: 0, k: [0.1255, 0.1529, 0.1725, 1], ix: 4 },
                  o: { a: 0, k: 100, ix: 5 },
                  r: 1,
                  nm: "Relleno 1",
                  mn: "ADBE Vector Graphic - Fill",
                  hd: false,
                },
                {
                  ty: "tr",
                  p: { a: 0, k: [0, 0], ix: 2 },
                  a: { a: 0, k: [0, 0], ix: 1 },
                  s: { a: 0, k: [100, 100], ix: 3 },
                  r: { a: 0, k: 0, ix: 6 },
                  o: { a: 0, k: 100, ix: 7 },
                  sk: { a: 0, k: 0, ix: 4 },
                  sa: { a: 0, k: 0, ix: 5 },
                  nm: "Transformar",
                },
              ],
              nm: "Forma 1",
              np: 3,
              cix: 2,
              ix: 1,
              mn: "ADBE Vector Group",
              hd: false,
            },
          ],
          ip: 0,
          op: 60,
          st: 0,
          bm: 0,
        },
        {
          ddd: 0,
          ind: 8,
          ty: 4,
          nm: "Capa de formas 3",
          sr: 1,
          ks: {
            o: {
              a: 1,
              k: [
                {
                  i: { x: [0.833], y: [0.833] },
                  o: { x: [0.167], y: [0.167] },
                  n: ["0p833_0p833_0p167_0p167"],
                  t: 46,
                  s: [0],
                  e: [100],
                },
                {
                  i: { x: [0.833], y: [0.833] },
                  o: { x: [0.167], y: [0.167] },
                  n: ["0p833_0p833_0p167_0p167"],
                  t: 47,
                  s: [100],
                  e: [100],
                },
                { t: 48 },
              ],
              ix: 11,
            },
            r: { a: 0, k: 0, ix: 10 },
            p: {
              a: 1,
              k: [
                {
                  i: { x: 0.833, y: 0.833 },
                  o: { x: 0.167, y: 0.167 },
                  n: "0p833_0p833_0p167_0p167",
                  t: 47,
                  s: [199.98, 168.25, 0],
                  e: [199.98, 158.037, 0],
                  to: [0, -0.20375619828701, 0],
                  ti: [0, 17.58864402771, 0],
                },
                {
                  i: { x: 0.833, y: 0.833 },
                  o: { x: 0.167, y: 0.167 },
                  n: "0p833_0p833_0p167_0p167",
                  t: 48,
                  s: [199.98, 158.037, 0],
                  e: [199.98, -10, 0],
                  to: [-2.8421709430404e-14, -50.4047393798828, 0],
                  ti: [0, 1.17485654354095, 0],
                },
                { t: 53 },
              ],
              ix: 2,
            },
            a: { a: 0, k: [-32, -31, 0], ix: 1 },
            s: {
              a: 1,
              k: [
                {
                  i: { x: [0.833, 0.833, 0.833], y: [0.833, 0.833, 0.833] },
                  o: { x: [0.167, 0.167, 0.167], y: [0.167, 0.167, 0.167] },
                  n: [
                    "0p833_0p833_0p167_0p167",
                    "0p833_0p833_0p167_0p167",
                    "0p833_0p833_0p167_0p167",
                  ],
                  t: 47,
                  s: [-4, 1, 100],
                  e: [1.5, 4, 100],
                },
                {
                  i: { x: [0.833, 0.833, 0.833], y: [0.833, 0.833, 0.833] },
                  o: { x: [0.167, 0.167, 0.167], y: [0.167, 0.167, 0.167] },
                  n: [
                    "0p833_0p833_0p167_0p167",
                    "0p833_0p833_0p167_0p167",
                    "0p833_0p833_0p167_0p167",
                  ],
                  t: 48,
                  s: [1.5, 4, 100],
                  e: [2, 3, 100],
                },
                { t: 53 },
              ],
              ix: 6,
            },
          },
          ao: 0,
          shapes: [
            {
              ty: "gr",
              it: [
                {
                  d: 1,
                  ty: "el",
                  s: { a: 0, k: [308, 308], ix: 2 },
                  p: { a: 0, k: [0, 0], ix: 3 },
                  nm: "Trazado elíptico 1",
                  mn: "ADBE Vector Shape - Ellipse",
                  hd: false,
                },
                {
                  ty: "fl",
                  c: { a: 0, k: [0.1255, 0.1529, 0.1725, 1], ix: 4 },
                  o: { a: 0, k: 100, ix: 5 },
                  r: 1,
                  nm: "Relleno 1",
                  mn: "ADBE Vector Graphic - Fill",
                  hd: false,
                },
                {
                  ty: "tr",
                  p: { a: 0, k: [-31, -31], ix: 2 },
                  a: { a: 0, k: [0, 0], ix: 1 },
                  s: { a: 0, k: [100, 100], ix: 3 },
                  r: { a: 0, k: 0, ix: 6 },
                  o: { a: 0, k: 100, ix: 7 },
                  sk: { a: 0, k: 0, ix: 4 },
                  sa: { a: 0, k: 0, ix: 5 },
                  nm: "Transformar",
                },
              ],
              nm: "Elipse 1",
              np: 3,
              cix: 2,
              ix: 1,
              mn: "ADBE Vector Group",
              hd: false,
            },
          ],
          ip: 0,
          op: 60,
          st: 0,
          bm: 0,
        },
        {
          ddd: 0,
          ind: 9,
          ty: 4,
          nm: "Capa de formas 4",
          sr: 1,
          ks: {
            o: { a: 0, k: 100, ix: 11 },
            r: { a: 0, k: 0, ix: 10 },
            p: { a: 0, k: [199, 252.99999999999997, 0], ix: 2 },
            a: { a: 0, k: [-32, -31, 0], ix: 1 },
            s: { a: 0, k: [55, 55, 100], ix: 6 },
          },
          ao: 0,
          shapes: [
            {
              ty: "gr",
              it: [
                {
                  d: 1,
                  ty: "el",
                  s: { a: 0, k: [308, 308], ix: 2 },
                  p: { a: 0, k: [0, 0], ix: 3 },
                  nm: "Trazado elíptico 1",
                  mn: "ADBE Vector Shape - Ellipse",
                  hd: false,
                },
                {
                  ty: "st",
                  c: { a: 0, k: [0.1255, 0.1529, 0.1725, 1], ix: 3 },
                  o: { a: 0, k: 100, ix: 4 },
                  w: { a: 0, k: 10, ix: 5 },
                  lc: 1,
                  lj: 1,
                  ml: 4,
                  nm: "Trazo 1",
                  mn: "ADBE Vector Graphic - Stroke",
                  hd: false,
                },
                {
                  ty: "tr",
                  p: { a: 0, k: [-31, -31], ix: 2 },
                  a: { a: 0, k: [0, 0], ix: 1 },
                  s: { a: 0, k: [100, 100], ix: 3 },
                  r: { a: 0, k: 0, ix: 6 },
                  o: { a: 0, k: 100, ix: 7 },
                  sk: { a: 0, k: 0, ix: 4 },
                  sa: { a: 0, k: 0, ix: 5 },
                  nm: "Transformar",
                },
              ],
              nm: "Elipse 1",
              np: 3,
              cix: 2,
              ix: 1,
              mn: "ADBE Vector Group",
              hd: false,
            },
            {
              ty: "tm",
              s: {
                a: 1,
                k: [
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ["0p833_0p833_0p167_0p167"],
                    t: 12,
                    s: [50],
                    e: [100],
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ["0p833_0p833_0p167_0p167"],
                    t: 24,
                    s: [100],
                    e: [50],
                  },
                  { t: 48 },
                ],
                ix: 1,
              },
              e: {
                a: 1,
                k: [
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ["0p833_0p833_0p167_0p167"],
                    t: 12,
                    s: [50],
                    e: [0],
                  },
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    n: ["0p833_0p833_0p167_0p167"],
                    t: 24,
                    s: [0],
                    e: [50],
                  },
                  { t: 48 },
                ],
                ix: 2,
              },
              o: { a: 0, k: 180, ix: 3 },
              m: 1,
              ix: 2,
              nm: "Recortar trazados 1",
              mn: "ADBE Vector Filter - Trim",
              hd: false,
            },
          ],
          ip: 0,
          op: 60,
          st: 0,
          bm: 0,
        },
        {
          ddd: 0,
          ind: 10,
          ty: 4,
          nm: "Capa de formas 1",
          td: 1,
          sr: 1,
          ks: {
            o: { a: 0, k: 100, ix: 11 },
            r: { a: 0, k: 0, ix: 10 },
            p: { a: 0, k: [199, 252.99999999999997, 0], ix: 2 },
            a: { a: 0, k: [-32, -31, 0], ix: 1 },
            s: { a: 0, k: [50, 50, 100], ix: 6 },
          },
          ao: 0,
          shapes: [
            {
              ty: "gr",
              it: [
                {
                  d: 1,
                  ty: "el",
                  s: { a: 0, k: [308, 308], ix: 2 },
                  p: { a: 0, k: [0, 0], ix: 3 },
                  nm: "Trazado elíptico 1",
                  mn: "ADBE Vector Shape - Ellipse",
                  hd: false,
                },
                {
                  ty: "fl",
                  c: { a: 0, k: [0.1255, 0.1529, 0.1725, 1], ix: 4 },
                  o: { a: 0, k: 100, ix: 5 },
                  r: 1,
                  nm: "Relleno 1",
                  mn: "ADBE Vector Graphic - Fill",
                  hd: false,
                },
                {
                  ty: "tr",
                  p: { a: 0, k: [-31, -31], ix: 2 },
                  a: { a: 0, k: [0, 0], ix: 1 },
                  s: { a: 0, k: [100, 100], ix: 3 },
                  r: { a: 0, k: 0, ix: 6 },
                  o: { a: 0, k: 100, ix: 7 },
                  sk: { a: 0, k: 0, ix: 4 },
                  sa: { a: 0, k: 0, ix: 5 },
                  nm: "Transformar",
                },
              ],
              nm: "Elipse 1",
              np: 3,
              cix: 2,
              ix: 1,
              mn: "ADBE Vector Group",
              hd: false,
            },
          ],
          ip: 0,
          op: 60,
          st: 0,
          bm: 0,
        },
        {
          ddd: 0,
          ind: 11,
          ty: 0,
          nm: "Precomp. 1",
          tt: 1,
          refId: "comp_0",
          sr: 1,
          ks: {
            o: { a: 0, k: 100, ix: 11 },
            r: { a: 0, k: 0, ix: 10 },
            p: { a: 0, k: [200, 200, 0], ix: 2 },
            a: { a: 0, k: [200, 200, 0], ix: 1 },
            s: { a: 0, k: [100, 100, 100], ix: 6 },
          },
          ao: 0,
          w: 400,
          h: 400,
          ip: 0,
          op: 144,
          st: 0,
          bm: 0,
        },
      ],
    },
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

  // --- B. LOTTIE ANIMATIONS (DECORATIVE) ---
  lottie.loadAnimation({
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
  const body = document.body;
  const mobileThemeToggle = document.getElementById("mobile-theme-toggle");
  const sunIcon = '<i class="fas fa-sun"></i>';
  const moonIcon = '<i class="fas fa-moon"></i>';

  const applyTheme = (theme) => {
    body.classList.toggle("dark-mode", theme === "dark");
    mobileThemeToggle.innerHTML = theme === "dark" ? sunIcon : moonIcon;
  };

  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);

  mobileThemeToggle.addEventListener("click", () => {
    const newTheme = body.classList.contains("dark-mode") ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  });

  // --- D. SECTION NAVIGATION WITH PAGE TRANSITIONS ---
  const allNavTriggers = document.querySelectorAll("[data-target]");
  let isTransitioning = false; // Flag to prevent rapid clicks during transition

  allNavTriggers.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      // If a transition is already happening, ignore this click
      if (isTransitioning) {
        return;
      }

      const targetId = link.dataset.target;
      const currentActiveSection = document.querySelector(
        ".content-section.active"
      );

      if (
        !targetId ||
        (currentActiveSection && currentActiveSection.id === targetId)
      ) {
        return;
      }

      // Start the transition
      isTransitioning = true;

      // Remove active class from all main navigation links
      document
        .querySelectorAll(".nav-link")
        .forEach((l) => l.classList.remove("active"));
      // Add active class to the specific main navigation links that match the target
      document
        .querySelectorAll(`.nav-link[data-target="${targetId}"]`)
        .forEach((l) => l.classList.add("active"));

      // Handle the content section transition
      if (currentActiveSection) {
        currentActiveSection.classList.add("fade-out");
        setTimeout(() => {
          currentActiveSection.classList.remove("active", "fade-out");
          const targetSection = document.getElementById(targetId);
          if (targetSection) {
            targetSection.classList.add("active");
          }
          document.querySelector(".main-content").scrollTop = 0;
          // End the transition
          isTransitioning = false;
        }, 500); // Match CSS animation duration (0.5s)
      } else {
        // This case handles the initial page load if needed, though not typical for this setup
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          targetSection.classList.add("active");
        }
        document.querySelector(".main-content").scrollTop = 0;
        // End the transition
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
    document.getElementById("modal-project-image").alt = project.title;
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
    if (e.key === "Escape" && projectModal.style.display === "flex") {
      closeProjectModal();
    }
  });
});
