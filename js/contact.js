/* =========================================================
   FRESHO CONTACT PAGE
   DOM + VALIDATION + ERROR HANDLING
========================================================= */


/* =========================================================
   GET HTML ELEMENTS
========================================================= */

const contactForm = document.getElementById("contactForm");

const nameInput = document.getElementById("name");

const emailInput = document.getElementById("email");

const subjectInput = document.getElementById("subject");

const messageInput = document.getElementById("message");

const nameError = document.getElementById("nameError");

const emailError = document.getElementById("emailError");

const subjectError = document.getElementById("subjectError");

const messageError = document.getElementById("messageError");

const characterCount = document.getElementById("characterCount");

const successMessage = document.getElementById("successMessage");

const subjectHelp = document.getElementById("subjectHelp");

const resetButton = document.getElementById("resetButton");



/* =========================================================
   SHOW ERROR MESSAGE
========================================================= */

function showError(input, errorElement, message) {

    const formGroup = input.closest(".form-group");

    formGroup.classList.add("has-error");

    errorElement.textContent = message;

}



/* =========================================================
   CLEAR ERROR MESSAGE
========================================================= */

function clearError(input, errorElement) {

    const formGroup = input.closest(".form-group");

    formGroup.classList.remove("has-error");

    errorElement.textContent = "";

}



/* =========================================================
   VALIDATE NAME
========================================================= */

function validateName() {

    const name = nameInput.value.trim();

    if (name === "") {

        showError(
            nameInput,
            nameError,
            "Please enter your full name."
        );

        return false;

    }


    if (name.length < 2) {

        showError(
            nameInput,
            nameError,
            "Name must contain at least 2 characters."
        );

        return false;

    }


    if (!/^[A-Za-z\s.'-]+$/.test(name)) {

        showError(
            nameInput,
            nameError,
            "Please enter a valid name."
        );

        return false;

    }


    clearError(nameInput, nameError);

    return true;

}



/* =========================================================
   VALIDATE EMAIL
========================================================= */

function validateEmail() {

    const email = emailInput.value.trim();


    if (email === "") {

        showError(
            emailInput,
            emailError,
            "Please enter your email address."
        );

        return false;

    }


    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailPattern.test(email)) {

        showError(
            emailInput,
            emailError,
            "Please enter a valid email address."
        );

        return false;

    }


    clearError(emailInput, emailError);

    return true;

}



/* =========================================================
   VALIDATE SUBJECT
========================================================= */

function validateSubject() {

    const subject = subjectInput.value;


    if (subject === "") {

        showError(
            subjectInput,
            subjectError,
            "Please select a subject."
        );

        return false;

    }


    clearError(subjectInput, subjectError);

    return true;

}



/* =========================================================
   VALIDATE MESSAGE
========================================================= */

function validateMessage() {

    const message = messageInput.value.trim();


    if (message === "") {

        showError(
            messageInput,
            messageError,
            "Please enter your message."
        );

        return false;

    }


    if (message.length < 10) {

        showError(
            messageInput,
            messageError,
            "Message must contain at least 10 characters."
        );

        return false;

    }


    if (message.length > 500) {

        showError(
            messageInput,
            messageError,
            "Message cannot exceed 500 characters."
        );

        return false;

    }


    clearError(messageInput, messageError);

    return true;

}



/* =========================================================
   REAL-TIME VALIDATION
========================================================= */

nameInput.addEventListener("input", function () {

    if (nameInput.value.trim() !== "") {

        validateName();

    }

});


emailInput.addEventListener("input", function () {

    if (emailInput.value.trim() !== "") {

        validateEmail();

    }

});


subjectInput.addEventListener("change", function () {

    validateSubject();

    updateSubjectHelp();

});


messageInput.addEventListener("input", function () {

    updateCharacterCount();

    if (messageInput.value.trim() !== "") {

        validateMessage();

    }

});



/* =========================================================
   CHARACTER COUNTER
========================================================= */

function updateCharacterCount() {

    const length = messageInput.value.length;

    characterCount.textContent =
        length + " / 500";


    characterCount.classList.remove(
        "limit-warning",
        "limit-reached"
    );


    if (length >= 400 && length < 500) {

        characterCount.classList.add(
            "limit-warning"
        );

    }


    if (length >= 500) {

        characterCount.classList.add(
            "limit-reached"
        );

    }

}



/* =========================================================
   SUBJECT-BASED DOM CHANGE
========================================================= */

function updateSubjectHelp() {

    const selectedSubject =
        subjectInput.value;


    subjectHelp.classList.remove("show");


    if (selectedSubject === "product") {

        subjectHelp.textContent =
            "Tell us which product you would like to know more about.";

        subjectHelp.classList.add("show");

    }


    else if (selectedSubject === "order") {

        subjectHelp.textContent =
            "Please include your order details if available.";

        subjectHelp.classList.add("show");

    }


    else if (selectedSubject === "planner") {

        subjectHelp.textContent =
            "Ask us anything about planning your grocery shopping.";

        subjectHelp.classList.add("show");

    }


    else if (selectedSubject === "calculator") {

        subjectHelp.textContent =
            "You can ask about grocery cost calculations and sales tax.";

        subjectHelp.classList.add("show");

    }


    else if (selectedSubject === "feedback") {

        subjectHelp.textContent =
            "We appreciate your feedback and suggestions.";

        subjectHelp.classList.add("show");

    }

}



/* =========================================================
   FORM SUBMISSION
========================================================= */

contactForm.addEventListener(
    "submit",
    function (event) {

        /*
         Prevent normal form submission.
         This is DOM event handling.
        */

        event.preventDefault();


        /* Validate every field */

        const validName =
            validateName();

        const validEmail =
            validateEmail();

        const validSubject =
            validateSubject();

        const validMessage =
            validateMessage();


        /* Check validation result */

        if (
            !validName ||
            !validEmail ||
            !validSubject ||
            !validMessage
        ) {

            /*
             * Error handling:
             * If any field is invalid,
             * stop the form.
            */

            successMessage.classList.remove("show");

            return;

        }


        /*
         * If everything is valid,
         * display success message dynamically.
        */

        successMessage.classList.add("show");


        /*
         * Reset form values.
        */

        contactForm.reset();


        /*
         * Reset character counter.
        */

        characterCount.textContent =
            "0 / 500";


        characterCount.classList.remove(
            "limit-warning",
            "limit-reached"
        );


        /*
         * Hide subject help.
        */

        subjectHelp.classList.remove("show");


        /*
         * Scroll to success message.
        */

        successMessage.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });


        /*
         * Automatically hide success
         * message after 5 seconds.
        */

        setTimeout(function () {

            successMessage.classList.remove("show");

        }, 5000);

    }
);



/* =========================================================
   RESET BUTTON
========================================================= */

resetButton.addEventListener(
    "click",
    function () {

        /*
         * Clear all error states.
        */

        clearError(
            nameInput,
            nameError
        );

        clearError(
            emailInput,
            emailError
        );

        clearError(
            subjectInput,
            subjectError
        );

        clearError(
            messageInput,
            messageError
        );


        /*
         * Reset character counter.
        */

        characterCount.textContent =
            "0 / 500";


        characterCount.classList.remove(
            "limit-warning",
            "limit-reached"
        );


        /*
         * Hide subject help.
        */

        subjectHelp.classList.remove("show");


        /*
         * Hide success message.
        */

        successMessage.classList.remove("show");

    }
);



/* =========================================================
   MOBILE NAVIGATION
========================================================= */

const menuButton =
    document.querySelector(".mobile-menu-btn");

const navigation =
    document.querySelector(".main-nav");


if (menuButton && navigation) {

    menuButton.addEventListener(
        "click",
        function () {

            navigation.classList.toggle(
                "nav-open"
            );

        }
    );

}