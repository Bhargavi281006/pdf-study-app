// =====================================================
// PDF STUDY ASSISTANT - DASHBOARD JAVASCRIPT
// =====================================================

console.log("Dashboard JavaScript loaded");

const API_URL = "http://127.0.0.1:8000";


// -----------------------------------------------------
// CHECK LOGIN
// -----------------------------------------------------

const accessToken = localStorage.getItem("access_token");

if (!accessToken) {
    window.location.href = "index.html";
}


// -----------------------------------------------------
// GET HTML ELEMENTS
// -----------------------------------------------------

const sideItems = document.querySelectorAll(".side-item[data-section]");

const homeSection = document.getElementById("homeSection");
const summariesSection = document.getElementById("summariesSection");
const quizzesSection = document.getElementById("quizzesSection");
const settingsSection = document.getElementById("settingsSection");

const uploadMainBtn = document.getElementById("uploadMainBtn");
const pdfInput = document.getElementById("pdfInput");

const materialsGrid = document.getElementById("materialsGrid");
const emptyMaterials = document.getElementById("emptyMaterials");

const profileBtn = document.getElementById("profileBtn");
const profilePopup = document.getElementById("profilePopup");

const logoutBtn = document.getElementById("logoutBtn");
const popupLogout = document.getElementById("popupLogout");
const settingsLogout = document.getElementById("settingsLogout");

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");


// -----------------------------------------------------
// SHOW DASHBOARD SECTIONS
// -----------------------------------------------------

function showSection(sectionName) {

    console.log("Opening section:", sectionName);

    if (homeSection) {
        homeSection.style.display = "none";
    }

    if (summariesSection) {
        summariesSection.style.display = "none";
    }

    if (quizzesSection) {
        quizzesSection.style.display = "none";
    }

    if (settingsSection) {
        settingsSection.style.display = "none";
    }

    if (sectionName === "home" && homeSection) {
        homeSection.style.display = "block";
    }

    if (sectionName === "materials" && homeSection) {

        homeSection.style.display = "block";

        const materialsSection =
            document.getElementById("materialsSection");

        if (materialsSection) {
            materialsSection.scrollIntoView({
                behavior: "smooth"
            });
        }
    }

    if (sectionName === "summaries" && summariesSection) {
        summariesSection.style.display = "block";
    }

    if (sectionName === "quizzes" && quizzesSection) {
        quizzesSection.style.display = "block";
    }

    if (sectionName === "settings" && settingsSection) {
        settingsSection.style.display = "block";
    }

    sideItems.forEach(function(item) {

        item.classList.remove("active");

        if (item.dataset.section === sectionName) {
            item.classList.add("active");
        }

    });
}


// -----------------------------------------------------
// SIDEBAR BUTTONS
// -----------------------------------------------------

sideItems.forEach(function(item) {

    item.addEventListener("click", function() {

        showSection(item.dataset.section);

    });

});


// -----------------------------------------------------
// QUICK CARDS
// -----------------------------------------------------

const quickCards =
    document.querySelectorAll(".quick-card[data-section]");

quickCards.forEach(function(card) {

    card.addEventListener("click", function() {

        showSection(card.dataset.section);

    });

});


// -----------------------------------------------------
// UPLOAD BUTTON
// -----------------------------------------------------

if (uploadMainBtn && pdfInput) {

    uploadMainBtn.addEventListener("click", function() {

        console.log("Upload button clicked");

        pdfInput.click();

    });

}


// -----------------------------------------------------
// PDF UPLOAD
// -----------------------------------------------------

if (pdfInput) {

    pdfInput.addEventListener("change", async function() {

        const file = pdfInput.files[0];

        if (!file) {
            return;
        }

        if (!file.name.toLowerCase().endsWith(".pdf")) {

            alert("Please select a PDF file.");

            pdfInput.value = "";

            return;
        }

        console.log("Selected PDF:", file.name);

        uploadMainBtn.textContent = "Uploading...";
        uploadMainBtn.disabled = true;

        const formData = new FormData();

        formData.append("file", file);

        try {

            const response = await fetch(
                API_URL + "/materials/upload",
                {
                    method: "POST",

                    headers: {
                        "Authorization":
                            "Bearer " + accessToken
                    },

                    body: formData
                }
            );

            const data = await response.json();

            console.log("Upload response:", data);

            if (response.ok) {

                alert("PDF uploaded successfully!");

                addMaterialCard(data);

            } else {

                alert(
                    data.detail ||
                    "PDF upload failed."
                );

            }

        } catch (error) {

            console.error(
                "Upload error:",
                error
            );

            alert(
                "Could not connect to FastAPI server."
            );

        }

        uploadMainBtn.textContent = "+ Upload PDF";
        uploadMainBtn.disabled = false;

        pdfInput.value = "";

    });

}


// -----------------------------------------------------
// CREATE MATERIAL CARD
// -----------------------------------------------------

function addMaterialCard(data) {

    if (!materialsGrid) {
        return;
    }

    if (emptyMaterials) {
        emptyMaterials.style.display = "none";
    }

    const card =
        document.createElement("div");

    card.className = "material-card";

    card.innerHTML = `
        <div class="material-file-icon">📄</div>

        <h3>${data.filename}</h3>

        <p>
            Extracted text:
            ${data.text_length} characters
        </p>

        <div class="material-actions">

            <button
                type="button"
                class="summary-button"
                data-id="${data.material_id}">
                ✨ Summary
            </button>

            <button
                type="button"
                class="quiz-button"
                data-id="${data.material_id}">
                🧠 Quiz
            </button>

        </div>
    `;

    materialsGrid.prepend(card);
}


// -----------------------------------------------------
// SUMMARY AND QUIZ BUTTONS
// -----------------------------------------------------

if (materialsGrid) {

    materialsGrid.addEventListener(
        "click",
        function(event) {

            const summaryButton =
                event.target.closest(".summary-button");

            const quizButton =
                event.target.closest(".quiz-button");


            // SUMMARY

            if (summaryButton) {

                const materialId =
                    summaryButton.dataset.id;

                console.log(
                    "Opening summary for material:",
                    materialId
                );

                if (materialId) {

                    window.location.href =
                        "summary.html?id=" +
                        materialId;

                }

                return;
            }


            // QUIZ

            if (quizButton) {

                const materialId =
                    quizButton.dataset.id;

                console.log(
                    "Opening quiz for material:",
                    materialId
                );

                if (materialId) {

                    window.location.href =
                        "quiz.html?id=" +
                        materialId;

                }

            }

        }
    );

}


// -----------------------------------------------------
// PROFILE POPUP
// -----------------------------------------------------

if (profileBtn && profilePopup) {

    profileBtn.addEventListener(
        "click",
        function() {

            if (
                profilePopup.style.display ===
                "block"
            ) {

                profilePopup.style.display =
                    "none";

            } else {

                profilePopup.style.display =
                    "block";

            }

        }
    );

}


// -----------------------------------------------------
// LOGOUT
// -----------------------------------------------------

function logout() {

    console.log("Logging out");

    localStorage.removeItem("access_token");

    window.location.href = "index.html";

}


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        logout
    );

}


if (popupLogout) {

    popupLogout.addEventListener(
        "click",
        logout
    );

}


if (settingsLogout) {

    settingsLogout.addEventListener(
        "click",
        logout
    );

}


// -----------------------------------------------------
// MOBILE MENU
// -----------------------------------------------------

if (menuBtn && sidebar) {

    menuBtn.addEventListener(
        "click",
        function() {

            if (
                sidebar.style.display ===
                "none"
            ) {

                sidebar.style.display =
                    "block";

            } else {

                sidebar.style.display =
                    "none";

            }

        }
    );

}


// -----------------------------------------------------
// START DASHBOARD
// -----------------------------------------------------

showSection("home");

console.log("Dashboard is ready!");