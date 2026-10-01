// =====================================================
// PDF STUDY ASSISTANT - QUIZ JAVASCRIPT
// =====================================================

console.log("Quiz JavaScript loaded");

const API_URL = "http://127.0.0.1:8000";


// -----------------------------------------------------
// GET LOGIN TOKEN
// -----------------------------------------------------

const accessToken = localStorage.getItem("access_token");

if (!accessToken) {
    window.location.href = "index.html";
}


// -----------------------------------------------------
// GET MATERIAL ID FROM URL
// Example: quiz.html?id=12
// -----------------------------------------------------

const urlParams = new URLSearchParams(window.location.search);
const materialId = urlParams.get("id");

console.log("Material ID:", materialId);


// -----------------------------------------------------
// GET HTML ELEMENTS
// -----------------------------------------------------

const loadingBox = document.getElementById("loadingBox");
const errorBox = document.getElementById("errorBox");
const errorMessage = document.getElementById("errorMessage");

const quizContainer = document.getElementById("quizContainer");
const resultContainer = document.getElementById("resultContainer");

const questionNumber = document.getElementById("questionNumber");
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");

const nextButton = document.getElementById("nextButton");

const scoreText = document.getElementById("scoreText");
const resultMessage = document.getElementById("resultMessage");

const backButton = document.getElementById("backButton");
const backToDashboard = document.getElementById("backToDashboard");


// -----------------------------------------------------
// QUIZ VARIABLES
// -----------------------------------------------------

let quizQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let answerSelected = false;


// -----------------------------------------------------
// CHECK MATERIAL ID
// -----------------------------------------------------

if (!materialId) {

    showError(
        "No PDF material was selected. Please return to the dashboard and select a PDF."
    );

} else {

    generateQuiz();

}


// -----------------------------------------------------
// GENERATE QUIZ
// -----------------------------------------------------

async function generateQuiz() {

    console.log("Requesting quiz...");

    try {

        const response = await fetch(
            API_URL + "/materials/" + materialId + "/quiz",
            {
                method: "POST",

                headers: {
                    "Authorization": "Bearer " + accessToken
                }
            }
        );


        // -------------------------------------------------
        // READ SERVER RESPONSE
        // -------------------------------------------------

        const data = await response.json();

        console.log("Quiz response:", data);


        // -------------------------------------------------
        // SERVER ERROR
        // -------------------------------------------------

        if (!response.ok) {

            showError(
                data.detail ||
                "The server could not generate the quiz."
            );

            return;
        }


        // -------------------------------------------------
        // CHECK FOR AI ERROR
        //
        // Backend may return:
        //
        // quiz: {
        //     error: "Gemini limit reached..."
        // }
        // -------------------------------------------------

        if (
            data.quiz &&
            !Array.isArray(data.quiz) &&
            data.quiz.error
        ) {

            showError(
                data.quiz.error
            );

            return;
        }


        // -------------------------------------------------
        // CHECK QUIZ FORMAT
        // -------------------------------------------------

        if (!Array.isArray(data.quiz)) {

            console.error(
                "Invalid quiz format:",
                data.quiz
            );

            showError(
                "The server did not return valid quiz questions."
            );

            return;
        }


        // -------------------------------------------------
        // CHECK QUESTION COUNT
        // -------------------------------------------------

        if (data.quiz.length === 0) {

            showError(
                "No quiz questions were generated."
            );

            return;
        }


        // -------------------------------------------------
        // SAVE QUESTIONS
        // -------------------------------------------------

        quizQuestions = data.quiz;

        console.log(
            "Quiz questions received:",
            quizQuestions.length
        );


        // -------------------------------------------------
        // HIDE LOADING
        // -------------------------------------------------

        if (loadingBox) {
            loadingBox.style.display = "none";
        }


        // -------------------------------------------------
        // SHOW QUIZ
        // -------------------------------------------------

        if (quizContainer) {
            quizContainer.style.display = "block";
        }


        // -------------------------------------------------
        // SHOW FIRST QUESTION
        // -------------------------------------------------

        currentQuestionIndex = 0;
        score = 0;

        showQuestion();


    } catch (error) {

        console.error(
            "Quiz error:",
            error
        );

        showError(
            "Could not connect to the FastAPI server. Please make sure the backend is running."
        );

    }

}


// -----------------------------------------------------
// SHOW QUESTION
// -----------------------------------------------------

function showQuestion() {

    if (!quizQuestions.length) {
        return;
    }


    const question =
        quizQuestions[currentQuestionIndex];


    console.log(
        "Showing question:",
        currentQuestionIndex + 1
    );


    // -------------------------------------------------
    // RESET ANSWER STATE
    // -------------------------------------------------

    answerSelected = false;


    // -------------------------------------------------
    // QUESTION NUMBER
    // -------------------------------------------------

    if (questionNumber) {

        questionNumber.textContent =
            "Question " +
            (currentQuestionIndex + 1) +
            " of " +
            quizQuestions.length;

    }


    // -------------------------------------------------
    // QUESTION TEXT
    // -------------------------------------------------

    if (questionText) {

        questionText.textContent =
            question.question ||
            "Question unavailable.";

    }


    // -------------------------------------------------
    // CLEAR OLD OPTIONS
    // -------------------------------------------------

    if (optionsContainer) {

        optionsContainer.innerHTML = "";

    }


    // -------------------------------------------------
    // CREATE OPTIONS
    // -------------------------------------------------

    if (
        question.options &&
        typeof question.options === "object"
    ) {

        Object.keys(question.options).forEach(
            function(optionKey) {

                const optionButton =
                    document.createElement("button");

                optionButton.type = "button";

                optionButton.className =
                    "quiz-option";


                // Example:
                // A. What is prompt engineering?

                optionButton.innerHTML =
                    "<strong>" +
                    optionKey +
                    ".</strong> " +
                    question.options[optionKey];


                optionButton.addEventListener(
                    "click",
                    function() {

                        selectAnswer(
                            optionButton,
                            optionKey
                        );

                    }
                );


                optionsContainer.appendChild(
                    optionButton
                );

            }
        );

    } else {

        showError(
            "This question does not contain valid answer options."
        );

        return;
    }


    // -------------------------------------------------
    // NEXT BUTTON
    // -------------------------------------------------

    if (nextButton) {

        nextButton.style.display = "none";

        nextButton.textContent =
            currentQuestionIndex ===
            quizQuestions.length - 1
                ? "Finish Quiz"
                : "Next Question";

    }

}


// -----------------------------------------------------
// SELECT ANSWER
// -----------------------------------------------------

function selectAnswer(
    selectedButton,
    selectedOption
) {

    // Prevent selecting multiple answers
    if (answerSelected) {
        return;
    }


    answerSelected = true;


    const question =
        quizQuestions[currentQuestionIndex];


    const correctAnswer =
        question.correct_answer;


    console.log(
        "Selected:",
        selectedOption
    );

    console.log(
        "Correct:",
        correctAnswer
    );


    // -------------------------------------------------
    // GET ALL OPTION BUTTONS
    // -------------------------------------------------

    const optionButtons =
        document.querySelectorAll(
            ".quiz-option"
        );


    // -------------------------------------------------
    // DISABLE ALL OPTIONS
    // -------------------------------------------------

    optionButtons.forEach(
        function(button) {

            button.disabled = true;

        }
    );


    // -------------------------------------------------
    // CHECK ANSWER
    // -------------------------------------------------

    if (
        selectedOption ===
        correctAnswer
    ) {

        selectedButton.classList.add(
            "correct"
        );

        score++;

    } else {

        selectedButton.classList.add(
            "wrong"
        );


        // Highlight correct answer
        optionButtons.forEach(
            function(button) {

                const buttonText =
                    button.textContent.trim();


                const correctPrefix =
                    correctAnswer + ".";


                if (
                    buttonText.startsWith(
                        correctPrefix
                    )
                ) {

                    button.classList.add(
                        "correct"
                    );

                }

            }
        );

    }


    // -------------------------------------------------
    // SHOW NEXT BUTTON
    // -------------------------------------------------

    if (nextButton) {

        nextButton.style.display =
            "inline-block";

    }

}


// -----------------------------------------------------
// NEXT QUESTION
// -----------------------------------------------------

if (nextButton) {

    nextButton.addEventListener(
        "click",
        function() {

            if (!answerSelected) {
                return;
            }


            currentQuestionIndex++;


            // -------------------------------------------------
            // MORE QUESTIONS
            // -------------------------------------------------

            if (
                currentQuestionIndex <
                quizQuestions.length
            ) {

                showQuestion();

            }


            // -------------------------------------------------
            // QUIZ FINISHED
            // -------------------------------------------------

            else {

                showResult();

            }

        }
    );

}


// -----------------------------------------------------
// SHOW RESULT
// -----------------------------------------------------

function showResult() {

    console.log(
        "Quiz finished. Score:",
        score,
        "/",
        quizQuestions.length
    );


    // Hide quiz

    if (quizContainer) {

        quizContainer.style.display =
            "none";

    }


    // Show result

    if (resultContainer) {

        resultContainer.style.display =
            "block";

    }


    // Show score

    if (scoreText) {

        scoreText.textContent =
            score +
            " / " +
            quizQuestions.length;

    }


    // -------------------------------------------------
    // RESULT MESSAGE
    // -------------------------------------------------

    if (resultMessage) {

        const percentage =
            (
                score /
                quizQuestions.length
            ) * 100;


        if (percentage === 100) {

            resultMessage.textContent =
                "Excellent! You answered every question correctly.";

        } else if (percentage >= 80) {

            resultMessage.textContent =
                "Great work! You have a strong understanding of this material.";

        } else if (percentage >= 60) {

            resultMessage.textContent =
                "Good attempt! Review the material once more and try again.";

        } else {

            resultMessage.textContent =
                "Keep practicing! Revising the study notes can help you improve.";

        }

    }

}


// -----------------------------------------------------
// SHOW ERROR
// -----------------------------------------------------

function showError(message) {

    console.error(
        "Quiz error message:",
        message
    );


    // Hide loading

    if (loadingBox) {

        loadingBox.style.display =
            "none";

    }


    // Hide quiz

    if (quizContainer) {

        quizContainer.style.display =
            "none";

    }


    // Hide result

    if (resultContainer) {

        resultContainer.style.display =
            "none";

    }


    // Show error box

    if (errorBox) {

        errorBox.style.display =
            "block";

    }


    // Show error message

    if (errorMessage) {

        errorMessage.textContent =
            message;

    }

}


// -----------------------------------------------------
// BACK TO DASHBOARD
// -----------------------------------------------------

if (backButton) {

    backButton.addEventListener(
        "click",
        function() {

            window.location.href =
                "dashboard.html";

        }
    );

}


if (backToDashboard) {

    backToDashboard.addEventListener(
        "click",
        function() {

            window.location.href =
                "dashboard.html";

        }
    );

}


console.log(
    "Quiz JavaScript ready!"
);