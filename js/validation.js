// Regular expression: Only english letters, space char and hyphen, 2-50 chars
const NAME_REGEX = /^[A-Za-z\-\s]{2,50}$/;

const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const firstNamePopup = document.getElementById("firstNamePopup");
const lastNamePopup = document.getElementById("lastNamePopup");


function validateField(value) {
    value = value.trim();
    if (value === "")
        return "Field cannot be empty";
    if (value.length < 2)
        return "Minimum 2 chars";
    if (value.length > 50)
        return "Maximum 50 chars";
    if (!NAME_REGEX.test(value))
        return "Only english letters, space char and hyphen allowed";
    return null;
}

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
// Обновление при вводе: рамка меняется всегда, попап скрывается,
// как только поле становится валидным
firstNameInput.addEventListener("input", () => {
    const error = updateBorder(firstNameInput);
    if (!error) {
        hidePopup(firstNamePopup);
    } else if (firstNamePopup.classList.contains("show")) {
        // если попап уже был показан ранее — обновляем текст в реальном времени
        showPopup(firstNamePopup, error);
    }
});

lastNameInput.addEventListener("input", () => {
    const error = updateBorder(lastNameInput);
    if (!error) {
        hidePopup(lastNamePopup);
    } else if (lastNamePopup.classList.contains("show")) {
        // если попап уже был показан ранее — обновляем текст в реальном времени
        showPopup(lastNamePopup, error);
    }
});
