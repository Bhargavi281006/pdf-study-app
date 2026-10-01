const API_URL = "http://127.0.0.1:8000";

const accessToken =
    localStorage.getItem("access_token");

const urlParams =
    new URLSearchParams(window.location.search);

const materialId =
    urlParams.get("id");


const loadingBox =
    document.getElementById("loadingBox");

const errorBox =
    document.getElementById("errorBox");

const errorMessage =
    document.getElementById("errorMessage");

const summaryContainer =
    document.getElementById("summaryContainer");

const summaryContent =
    document.getElementById("summaryContent");

const fileName =
    document.getElementById("fileName");


console.log("Summary JavaScript loaded");

console.log("Material ID:", materialId);


if (!accessToken) {

    window.location.href = "index.html";

}


if (!materialId) {

    showError("No PDF material was selected.");

} else {

    generateSummary();

}


async function generateSummary() {

    try {

        console.log("Requesting summary...");

        const response = await fetch(
            API_URL +
            "/materials/" +
            materialId +
            "/summary",
            {
                method: "POST",

                headers: {
                    "Authorization":
                        "Bearer " + accessToken
                }
            }
        );


        const data =
            await response.json();


        console.log(
            "Summary response:",
            data
        );


        if (response.ok) {

            loadingBox.style.display =
                "none";

            summaryContainer.style.display =
                "block";

            fileName.textContent =
                data.filename ||
                "Study Material";

            summaryContent.textContent =
                data.summary ||
                "No summary was generated.";

        } else {

            showError(
                data.detail ||
                "Could not generate summary."
            );

        }


    } catch (error) {

        console.error(
            "Summary error:",
            error
        );

        showError(
            "Could not connect to the FastAPI server."
        );

    }

}


function showError(message) {

    loadingBox.style.display =
        "none";

    summaryContainer.style.display =
        "none";

    errorBox.style.display =
        "block";

    errorMessage.textContent =
        message;

}


document
    .getElementById("backButton")
    .addEventListener(
        "click",
        function () {

            window.location.href =
                "dashboard.html";

        }
    );


document
    .getElementById("backToDashboard")
    .addEventListener(
        "click",
        function () {

            window.location.href =
                "dashboard.html";

        }
    );