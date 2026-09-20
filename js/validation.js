// NAME_REGEX and validateField() live in name-rules.js (it must be loaded before this file)

const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const firstNamePopup = document.getElementById("firstNamePopup");
const lastNamePopup = document.getElementById("lastNamePopup");


// Updates only the field border
function updateBorder(input){
    const error = validateField(input.value);
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
    const firstNameError = validateField(firstNameInput.value);
    const lastNameError = validateField(lastNameInput.value);
    return firstNameError === null && lastNameError === null;
}

// Shows popup by each invalid field
function showAllErrors() {
    const firstNameError = validateField(firstNameInput.value);
    const lastNameError = validateField(lastNameInput.value);

    if (firstNameError) {
        showPopup(firstNamePopup, firstNameError);
    }
    if (lastNameError) {
        showPopup(lastNamePopup, lastNameError);
    }
}
// Live input update: border color changes, popup hides as soon as the input is valid
firstNameInput.addEventListener("input", () => {
    const error = updateBorder(firstNameInput);
    if (!error) {
        hidePopup(firstNamePopup);
    } else if (firstNamePopup.classList.contains("show")) {
        showPopup(firstNamePopup, error);
    }
});

lastNameInput.addEventListener("input", () => {
    const error = updateBorder(lastNameInput);
    if (!error) {
        hidePopup(lastNamePopup);
    } else if (lastNamePopup.classList.contains("show")) {
        showPopup(lastNamePopup, error);
    }
});
