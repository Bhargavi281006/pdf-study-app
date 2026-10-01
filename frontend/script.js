// =====================================================
// PDF STUDY ASSISTANT
// LOGIN + REGISTER JAVASCRIPT
// =====================================================

console.log("Login JavaScript loaded");


// =====================================================
// BACKEND URL
// =====================================================

const API_URL = "http://127.0.0.1:8000";


// =====================================================
// GET ELEMENTS
// =====================================================

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const loginButton = document.getElementById("loginButton");
const registerButton = document.getElementById("registerButton");

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");


// =====================================================
// CREATE MESSAGE AREA
// =====================================================

function showMessage(message, type = "error") {

    let messageBox =
        document.getElementById("messageBox");

    if (!messageBox) {

        messageBox =
            document.createElement("div");

        messageBox.id = "messageBox";

        messageBox.style.marginBottom = "20px";

        messageBox.style.padding = "12px 15px";

        messageBox.style.borderRadius = "8px";

        messageBox.style.fontSize = "14px";

        messageBox.style.lineHeight = "1.5";

        messageBox.style.display = "none";

        const authCard =
            document.querySelector(".auth-card");

        authCard.insertBefore(
            messageBox,
            authCard.firstChild
        );
    }


    messageBox.textContent = message;

    messageBox.style.display = "block";


    if (type === "success") {

        messageBox.style.background = "#e6f4ea";

        messageBox.style.color = "#137333";

        messageBox.style.border =
            "1px solid #b7dfbd";

    } else {

        messageBox.style.background = "#fce8e6";

        messageBox.style.color = "#c5221f";

        messageBox.style.border =
            "1px solid #f5b7b1";
    }
}


// =====================================================
// HIDE MESSAGE
// =====================================================

function hideMessage() {

    const messageBox =
        document.getElementById("messageBox");

    if (messageBox) {

        messageBox.style.display = "none";

    }
}


// =====================================================
// EMAIL VALIDATION
// =====================================================

function isValidEmail(email) {

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);

}


// =====================================================
// SHOW LOGIN
// =====================================================

if (showLogin) {

    showLogin.addEventListener(
        "click",
        function () {

            loginForm.style.display = "block";

            registerForm.style.display = "none";

            hideMessage();

        }
    );

}


// =====================================================
// SHOW REGISTER
// =====================================================

if (showRegister) {

    showRegister.addEventListener(
        "click",
        function () {

            loginForm.style.display = "none";

            registerForm.style.display = "block";

            hideMessage();

        }
    );

}


// =====================================================
// LOGIN
// =====================================================

if (loginButton) {

    loginButton.addEventListener(
        "click",
        async function () {

            hideMessage();


            // -----------------------------------------
            // GET VALUES
            // -----------------------------------------

            const email =
                document.getElementById(
                    "loginEmail"
                ).value.trim();


            const password =
                document.getElementById(
                    "loginPassword"
                ).value;


            // -----------------------------------------
            // CHECK EMPTY EMAIL
            // -----------------------------------------

            if (!email) {

                showMessage(
                    "Please enter your email address."
                );

                return;
            }


            // -----------------------------------------
            // CHECK EMAIL FORMAT
            // -----------------------------------------

            if (!isValidEmail(email)) {

                showMessage(
                    "Please enter a valid email address, for example: name@gmail.com"
                );

                return;
            }


            // -----------------------------------------
            // CHECK PASSWORD
            // -----------------------------------------

            if (!password) {

                showMessage(
                    "Please enter your password."
                );

                return;
            }


            // -----------------------------------------
            // LOGIN BUTTON
            // -----------------------------------------

            loginButton.textContent =
                "Signing in...";

            loginButton.disabled = true;


            try {

                // FastAPI OAuth2 expects
                // application/x-www-form-urlencoded

                const formData =
                    new URLSearchParams();

                formData.append(
                    "username",
                    email
                );

                formData.append(
                    "password",
                    password
                );


                const response =
                    await fetch(
                        API_URL + "/auth/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/x-www-form-urlencoded"
                            },

                            body: formData
                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "Login response:",
                    data
                );


                // -------------------------------------
                // LOGIN SUCCESS
                // -------------------------------------

                if (response.ok) {

                    // Save JWT token

                    localStorage.setItem(
                        "access_token",
                        data.access_token
                    );


                    showMessage(
                        "Login successful! Opening your dashboard...",
                        "success"
                    );


                    // Go to dashboard

                    setTimeout(
                        function () {

                            window.location.href =
                                "dashboard.html";

                        },
                        700
                    );


                }


                // -------------------------------------
                // LOGIN FAILED
                // -------------------------------------

                else {

                    if (
                        response.status === 401
                    ) {

                        showMessage(
                            "Incorrect email or password. Please try again."
                        );

                    } else {

                        showMessage(
                            data.detail ||
                            "Login failed. Please try again."
                        );

                    }

                }


            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );


                showMessage(
                    "Could not connect to the server. Please make sure FastAPI is running."
                );

            }


            loginButton.textContent =
                "Sign in";

            loginButton.disabled = false;

        }
    );

}


// =====================================================
// REGISTER
// =====================================================

if (registerButton) {

    registerButton.addEventListener(
        "click",
        async function () {

            hideMessage();


            // -----------------------------------------
            // GET VALUES
            // -----------------------------------------

            const name =
                document.getElementById(
                    "registerName"
                ).value.trim();


            const email =
                document.getElementById(
                    "registerEmail"
                ).value.trim();


            const password =
                document.getElementById(
                    "registerPassword"
                ).value;


            // -----------------------------------------
            // NAME VALIDATION
            // -----------------------------------------

            if (!name) {

                showMessage(
                    "Please enter your name."
                );

                return;
            }


            // -----------------------------------------
            // EMAIL EMPTY
            // -----------------------------------------

            if (!email) {

                showMessage(
                    "Please enter your email address."
                );

                return;
            }


            // -----------------------------------------
            // EMAIL FORMAT
            // -----------------------------------------

            if (!isValidEmail(email)) {

                showMessage(
                    "Please enter a valid email address, for example: name@gmail.com"
                );

                return;
            }


            // -----------------------------------------
            // PASSWORD
            // -----------------------------------------

            if (!password) {

                showMessage(
                    "Please enter a password."
                );

                return;
            }


            // -----------------------------------------
            // PASSWORD LENGTH
            // -----------------------------------------

            if (password.length < 6) {

                showMessage(
                    "Password must contain at least 6 characters."
                );

                return;
            }


            // -----------------------------------------
            // BUTTON
            // -----------------------------------------

            registerButton.textContent =
                "Creating account...";

            registerButton.disabled = true;


            try {

                // Your FastAPI /users endpoint
                // accepts these as query parameters

                const params =
                    new URLSearchParams();


                params.append(
                    "name",
                    name
                );


                params.append(
                    "email",
                    email
                );


                params.append(
                    "password",
                    password
                );


                const response =
                    await fetch(
                        API_URL +
                        "/users?" +
                        params.toString(),
                        {
                            method: "POST"
                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "Registration response:",
                    data
                );


                // -------------------------------------
                // SUCCESS
                // -------------------------------------

                if (response.ok) {

                    showMessage(
                        "Account created successfully! You can now sign in.",
                        "success"
                    );


                    // Clear registration fields

                    document.getElementById(
                        "registerName"
                    ).value = "";


                    document.getElementById(
                        "registerEmail"
                    ).value = "";


                    document.getElementById(
                        "registerPassword"
                    ).value = "";


                    // Switch to login after 1 second

                    setTimeout(
                        function () {

                            loginForm.style.display =
                                "block";

                            registerForm.style.display =
                                "none";

                        },
                        1000
                    );

                }


                // -------------------------------------
                // REGISTRATION ERROR
                // -------------------------------------

                else {

                    showMessage(
                        data.detail ||
                        "Could not create the account."
                    );

                }


            } catch (error) {

                console.error(
                    "Registration error:",
                    error
                );


                showMessage(
                    "Could not connect to the server. Please make sure FastAPI is running."
                );

            }


            registerButton.textContent =
                "Create account";

            registerButton.disabled = false;

        }
    );

}


// =====================================================
// START
// =====================================================

console.log(
    "Login and registration are ready!"
);