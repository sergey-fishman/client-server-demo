// validateFullname() and validatePhone() live in name-rules.js (it must be loaded before this file)

const fullNameInput = document.getElementById("fullName");
const phoneNumberInput = document.getElementById("phoneNumber");
const fullNamePopup = document.getElementById("fullNamePopup");
const phoneNumberPopup = document.getElementById("phoneNumberPopup");

// Updates only the field border
function updateBorder(input, validator){
    const error = validator(input.value);
    input.classList.remove("valid", "invalid");
    input.classList.add(error ? "invalid" : "valid");
    return error;
}

function showPopup (popupElement, message) {
    popupElement.textContent = message;
    popupElement.classList.add("show");
}

function hidePopup(popupElement){
    popupElement.classList.remove("show");
}

// Ckeck both fields at once, return true/false
function isFormValid() {
    const fullNameError = validateFullName(fullNameInput.value);
    const phoneNumberError = validatePhone(phoneNumberInput.value);
    return fullNameError === null && phoneNumberError === null;
}

// Shows popup at each invalid field
function showAllErrors() {
    const fullNameError = validateFullName(fullNameInput.value);
    const phoneNumberError = validatePhone(phoneNumberInput.value);

    if (fullNameError) {
        showPopup(fullNamePopup, fullNameError);
    }
    if (phoneNumberError) {
        showPopup(phoneNumberPopup, phoneNumberError);
    }
}

// Live input update: border color changes, popup hides as soon as the input is valid
fullNameInput.addEventListener("input", () => {
    const error = updateBorder(fullNameInput, validateFullName);
    if (!error) {
        hidePopup(fullNamePopup);
    } else if (fullNamePopup.classList.contains("show")) {
        showPopup(fullNamePopup, error);
    }
});

phoneNumberInput.addEventListener("input", () => {
    const error = updateBorder(phoneNumberInput, validatePhone);
    if (!error) {
        hidePopup(phoneNumberPopup);
    } else if (phoneNumberPopup.classList.contains("show")) {
        showPopup(phoneNumberPopup, error);
    }
});