// =====================================================
// PDF STUDY ASSISTANT - DASHBOARD JAVASCRIPT
// =====================================================

console.log("Dashboard JavaScript loaded");

const API_URL = "http://127.0.0.1:8000";


// =====================================================
// CHECK LOGIN
// =====================================================

const accessToken = localStorage.getItem("access_token");

if (!accessToken) {
    window.location.href = "index.html";
}


// =====================================================
// GET HTML ELEMENTS
// =====================================================

const sideItems =
    document.querySelectorAll(".side-item[data-section]");

const homeSection =
    document.getElementById("homeSection");

const summariesSection =
    document.getElementById("summariesSection");

const quizzesSection =
    document.getElementById("quizzesSection");

const uploadMainBtn =
    document.getElementById("uploadMainBtn");

const pdfInput =
    document.getElementById("pdfInput");

const materialsGrid =
    document.getElementById("materialsGrid");

const emptyMaterials =
    document.getElementById("emptyMaterials");

const menuBtn =
    document.getElementById("menuBtn");

const sidebar =
    document.getElementById("sidebar");


// =====================================================
// PROFILE ELEMENTS
// =====================================================

const profileBtn =
    document.getElementById("profileBtn");

const profileModal =
    document.getElementById("profileModal");

const profileCloseBtn =
    document.getElementById("profileCloseBtn");

const profileNameInput =
    document.getElementById("profileNameInput");

const profileSaveBtn =
    document.getElementById("profileSaveBtn");

const profileImageInput =
    document.getElementById("profileImageInput");

const changePictureBtn =
    document.getElementById("changePictureBtn");

const profileLargeAvatar =
    document.getElementById("profileLargeAvatar");

const profileAvatar =
    document.getElementById("profileAvatar");

const profileLogoutBtn =
    document.getElementById("profileLogoutBtn");

const welcomeUser =
    document.getElementById("welcomeUser");

const dashboardWelcomeTitle =
    document.getElementById("dashboardWelcomeTitle");


// =====================================================
// PROFILE DATA
// =====================================================

let savedProfileName =
    localStorage.getItem("profile_name");

let savedProfileImage =
    localStorage.getItem("profile_image");


// =====================================================
// LOAD PROFILE
// =====================================================

function loadProfile() {

    console.log("Loading profile...");

    if (!savedProfileName) {
        savedProfileName = "Student";
    }

    if (profileNameInput) {
        profileNameInput.value =
            savedProfileName;
    }

    if (welcomeUser) {
        welcomeUser.textContent =
            "Welcome, " + savedProfileName;
    }

    if (dashboardWelcomeTitle) {
        dashboardWelcomeTitle.textContent =
            "Welcome back, " +
            savedProfileName +
            "! 👋";
    }

    if (savedProfileImage) {

        if (profileAvatar) {
            profileAvatar.innerHTML =
                `<img src="${savedProfileImage}" alt="Profile picture">`;
        }

        if (profileLargeAvatar) {
            profileLargeAvatar.innerHTML =
                `<img src="${savedProfileImage}" alt="Profile picture">`;
        }

    } else {

        if (profileAvatar) {
            profileAvatar.textContent = "👤";
        }

        if (profileLargeAvatar) {
            profileLargeAvatar.textContent = "👤";
        }
    }
}


// =====================================================
// OPEN PROFILE
// =====================================================

if (profileBtn && profileModal) {

    profileBtn.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();

            console.log(
                "Profile button clicked"
            );

            profileModal.style.display =
                "block";

            loadProfile();
        }
    );
}


// =====================================================
// CLOSE PROFILE BUTTON
// =====================================================

if (profileCloseBtn && profileModal) {

    profileCloseBtn.addEventListener(
        "click",
        function() {

            profileModal.style.display =
                "none";

        }
    );
}


// =====================================================
// CLOSE PROFILE WHEN CLICKING OUTSIDE
// =====================================================

document.addEventListener(
    "click",
    function(event) {

        if (!profileModal || !profileBtn) {
            return;
        }

        const clickedInsideProfile =
            profileModal.contains(event.target);

        const clickedProfileButton =
            profileBtn.contains(event.target);

        if (
            !clickedInsideProfile &&
            !clickedProfileButton
        ) {

            profileModal.style.display =
                "none";

        }

    }
);


// =====================================================
// CHANGE PROFILE PICTURE
// =====================================================

if (changePictureBtn && profileImageInput) {

    changePictureBtn.addEventListener(
        "click",
        function() {

            console.log(
                "Change picture clicked"
            );

            profileImageInput.click();

        }
    );
}


// =====================================================
// PROFILE IMAGE SELECTED
// =====================================================

if (profileImageInput) {

    profileImageInput.addEventListener(
        "change",
        function() {

            const file =
                profileImageInput.files[0];

            if (!file) {
                return;
            }

            if (!file.type.startsWith("image/")) {

                alert(
                    "Please select an image."
                );

                profileImageInput.value =
                    "";

                return;
            }

            console.log(
                "Profile image selected:",
                file.name
            );

            const reader =
                new FileReader();

            reader.onload =
                function(event) {

                    const imageData =
                        event.target.result;

                    savedProfileImage =
                        imageData;

                    if (profileLargeAvatar) {

                        profileLargeAvatar.innerHTML =
                            `<img src="${imageData}" alt="Profile picture">`;

                    }

                    if (profileAvatar) {

                        profileAvatar.innerHTML =
                            `<img src="${imageData}" alt="Profile picture">`;

                    }

                };

            reader.readAsDataURL(file);

        }
    );
}


// =====================================================
// SAVE PROFILE
// =====================================================

if (profileSaveBtn) {

    profileSaveBtn.addEventListener(
        "click",
        function() {

            console.log(
                "Saving profile..."
            );

            let newName =
                profileNameInput
                    ? profileNameInput.value.trim()
                    : "";

            if (!newName) {
                newName = "Student";
            }

            savedProfileName =
                newName;

            localStorage.setItem(
                "profile_name",
                savedProfileName
            );

            if (savedProfileImage) {

                localStorage.setItem(
                    "profile_image",
                    savedProfileImage
                );

            }

            loadProfile();

            if (profileModal) {

                profileModal.style.display =
                    "none";

            }

            alert(
                "Profile updated successfully!"
            );

        }
    );
}


// =====================================================
// LOGOUT
// =====================================================

function logout() {

    console.log(
        "Logging out..."
    );

    localStorage.removeItem(
        "access_token"
    );

    window.location.href =
        "index.html";
}


if (profileLogoutBtn) {

    profileLogoutBtn.addEventListener(
        "click",
        logout
    );

}


// =====================================================
// SHOW DASHBOARD SECTIONS
// =====================================================

function showSection(sectionName) {

    console.log(
        "Opening section:",
        sectionName
    );

    if (homeSection) {
        homeSection.style.display =
            "none";
    }

    if (summariesSection) {
        summariesSection.style.display =
            "none";
    }

    if (quizzesSection) {
        quizzesSection.style.display =
            "none";
    }


    // HOME
    if (
        sectionName === "home" &&
        homeSection
    ) {

        homeSection.style.display =
            "block";

    }


    // MATERIALS
    if (
        sectionName === "materials" &&
        homeSection
    ) {

        homeSection.style.display =
            "block";

        const materialsSection =
            document.getElementById(
                "materialsSection"
            );

        if (materialsSection) {

            materialsSection.scrollIntoView({
                behavior: "smooth"
            });

        }

    }


    // SUMMARIES
    if (
        sectionName === "summaries" &&
        summariesSection
    ) {

        summariesSection.style.display =
            "block";

    }


    // QUIZZES
    if (
        sectionName === "quizzes" &&
        quizzesSection
    ) {

        quizzesSection.style.display =
            "block";

    }


    // ACTIVE SIDEBAR ITEM
    sideItems.forEach(
        function(item) {

            item.classList.remove(
                "active"
            );

            if (
                item.dataset.section ===
                sectionName
            ) {

                item.classList.add(
                    "active"
                );

            }

        }
    );
}


// =====================================================
// SIDEBAR BUTTONS
// =====================================================

sideItems.forEach(
    function(item) {

        item.addEventListener(
            "click",
            function() {

                showSection(
                    item.dataset.section
                );

            }
        );

    }
);


// =====================================================
// QUICK CARDS
// =====================================================

const quickCards =
    document.querySelectorAll(
        ".quick-card[data-section]"
    );

quickCards.forEach(
    function(card) {

        card.addEventListener(
            "click",
            function() {

                showSection(
                    card.dataset.section
                );

            }
        );

    }
);


// =====================================================
// QUICK UPLOAD CARD
// =====================================================

const quickUploadCard =
    document.getElementById(
        "quickUploadCard"
    );

if (quickUploadCard && pdfInput) {

    quickUploadCard.addEventListener(
        "click",
        function() {

            pdfInput.click();

        }
    );

}


// =====================================================
// UPLOAD BUTTON
// =====================================================

if (uploadMainBtn && pdfInput) {

    uploadMainBtn.addEventListener(
        "click",
        function() {

            console.log(
                "Upload button clicked"
            );

            pdfInput.click();

        }
    );

}


// =====================================================
// PDF UPLOAD
// =====================================================

if (pdfInput) {

    pdfInput.addEventListener(
        "change",
        async function() {

            const file =
                pdfInput.files[0];

            if (!file) {
                return;
            }


            // Check PDF
            if (
                !file.name
                    .toLowerCase()
                    .endsWith(".pdf")
            ) {

                alert(
                    "Please select a PDF file."
                );

                pdfInput.value = "";

                return;

            }


            console.log(
                "Selected PDF:",
                file.name
            );


            if (uploadMainBtn) {

                uploadMainBtn.textContent =
                    "Uploading...";

                uploadMainBtn.disabled =
                    true;

            }


            const formData =
                new FormData();

            formData.append(
                "file",
                file
            );


            try {

                const response =
                    await fetch(
                        API_URL +
                        "/materials/upload",
                        {
                            method: "POST",

                            headers: {
                                "Authorization":
                                    "Bearer " +
                                    accessToken
                            },

                            body: formData
                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "Upload response:",
                    data
                );


                if (response.ok) {

                    alert(
                        "PDF uploaded successfully!"
                    );

                    addMaterialCard(
                        data,
                        true
                    );

                } else {

                    if (
                        response.status ===
                        401
                    ) {

                        localStorage.removeItem(
                            "access_token"
                        );

                        window.location.href =
                            "index.html";

                        return;

                    }

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


            if (uploadMainBtn) {

                uploadMainBtn.textContent =
                    "+ Upload PDF";

                uploadMainBtn.disabled =
                    false;

            }

            pdfInput.value = "";

        }
    );
}


// =====================================================
// CREATE MATERIAL CARD
// =====================================================

function addMaterialCard(
    data,
    putFirst = true
) {

    if (!materialsGrid) {
        return;
    }


    if (emptyMaterials) {

        emptyMaterials.style.display =
            "none";

    }


    const card =
        document.createElement(
            "div"
        );

    card.className =
        "material-card";


    card.innerHTML = `

        <div class="material-file-icon">
            📄
        </div>

        <h3>
            ${data.filename}
        </h3>

        <p>
            Extracted text:
            ${data.text_length}
            characters
        </p>

        <div class="material-actions">

            <button
                type="button"
                class="summary-button"
                data-id="${data.material_id}"
            >
                ✨ Summary
            </button>

            <button
                type="button"
                class="quiz-button"
                data-id="${data.material_id}"
            >
                🧠 Quiz
            </button>

            <button
                type="button"
                class="delete-material-btn"
                data-id="${data.material_id}"
            >
                🗑 Remove
            </button>

        </div>

    `;


    if (putFirst) {

        materialsGrid.prepend(
            card
        );

    } else {

        materialsGrid.appendChild(
            card
        );

    }

}


// =====================================================
// LOAD SAVED MATERIALS
// =====================================================

async function loadMaterials() {

    console.log(
        "Loading saved materials..."
    );


    if (!materialsGrid) {
        return;
    }


    try {

        const response =
            await fetch(
                API_URL +
                "/materials",
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            "Bearer " +
                            accessToken
                    }
                }
            );


        const data =
            await response.json();


        console.log(
            "Materials response:",
            data
        );


        if (!response.ok) {

            console.error(
                "Could not load materials:",
                data
            );


            if (
                response.status ===
                401
            ) {

                localStorage.removeItem(
                    "access_token"
                );

                window.location.href =
                    "index.html";

            }

            return;

        }


        materialsGrid.innerHTML =
            "";


        if (
            !Array.isArray(data) ||
            data.length === 0
        ) {

            if (emptyMaterials) {

                emptyMaterials.style.display =
                    "block";

            }

            return;

        }


        if (emptyMaterials) {

            emptyMaterials.style.display =
                "none";

        }


        data.forEach(
            function(material) {

                addMaterialCard(
                    material,
                    false
                );

            }
        );


    } catch (error) {

        console.error(
            "Error loading materials:",
            error
        );

    }

}


// =====================================================
// SUMMARY / QUIZ / DELETE BUTTONS
// =====================================================

if (materialsGrid) {

    materialsGrid.addEventListener(
        "click",
        async function(event) {

            const summaryButton =
                event.target.closest(
                    ".summary-button"
                );

            const quizButton =
                event.target.closest(
                    ".quiz-button"
                );

            const deleteButton =
                event.target.closest(
                    ".delete-material-btn"
                );


            // =================================================
            // SUMMARY
            // =================================================

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


            // =================================================
            // QUIZ
            // =================================================

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

                return;

            }


            // =================================================
            // DELETE PDF
            // =================================================

            if (deleteButton) {

                const materialId =
                    deleteButton.dataset.id;


                if (!materialId) {
                    return;
                }


                const confirmed =
                    confirm(
                        "Are you sure you want to remove this PDF?"
                    );


                if (!confirmed) {
                    return;
                }


                console.log(
                    "Deleting material:",
                    materialId
                );


                // Temporarily disable button
                deleteButton.disabled =
                    true;

                deleteButton.textContent =
                    "Removing...";


                try {

                    const response =
                        await fetch(
                            API_URL +
                            "/materials/" +
                            materialId,
                            {
                                method: "DELETE",

                                headers: {
                                    "Authorization":
                                        "Bearer " +
                                        accessToken
                                }
                            }
                        );


                    const data =
                        await response.json();


                    console.log(
                        "Delete response:",
                        data
                    );


                    // TOKEN EXPIRED
                    if (
                        response.status ===
                        401
                    ) {

                        localStorage.removeItem(
                            "access_token"
                        );

                        window.location.href =
                            "index.html";

                        return;

                    }


                    if (!response.ok) {

                        alert(
                            data.detail ||
                            "Could not remove PDF."
                        );

                        deleteButton.disabled =
                            false;

                        deleteButton.textContent =
                            "🗑 Remove";

                        return;

                    }


                    // Remove card from screen
                    const card =
                        deleteButton.closest(
                            ".material-card"
                        );

                    if (card) {

                        card.remove();

                    }


                    // Check if there are no PDFs
                    const remainingCards =
                        materialsGrid.querySelectorAll(
                            ".material-card"
                        );


                    if (
                        remainingCards.length ===
                        0
                    ) {

                        if (emptyMaterials) {

                            emptyMaterials.style.display =
                                "block";

                        }

                    }


                    alert(
                        "PDF removed successfully."
                    );


                } catch (error) {

                    console.error(
                        "Delete error:",
                        error
                    );

                    alert(
                        "Could not connect to FastAPI server."
                    );


                    deleteButton.disabled =
                        false;

                    deleteButton.textContent =
                        "🗑 Remove";

                }

                return;

            }

        }
    );
}


// =====================================================
// MOBILE MENU
// =====================================================

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


// =====================================================
// START DASHBOARD
// =====================================================

loadProfile();

showSection(
    "home"
);

loadMaterials();

console.log(
    "Dashboard is ready!"
);