// Shared name rules: used by the form (validation.js) and by the contacts table (contacts.js)
 
// Regular expression: Only english letters, space char and hyphen, 2-50 chars
// const NAME_REGEX = /^[A-Za-z\-\s]{2,50}$/;

// Updated regExp supports Unicode, \-\, \'\, \s\
const NAME_REGEX = /^(?=.{2,60}$)\p{L}+(?:[ -'\u{2019}]\p{L}+)*$/u;


// Regular expression: universal international phone format.
// Starts with '+', followed by 7 to 15 digits total (country code + number), no spaces.
const PHONE_REGEX = /^\+[1-9]\d{6,14}$/;

// Returns an error message or null if the full name is valid
function validateFullName(value) {
    value = value.trim();
    if (value === "")
        return "Field cannot be empty";
    if (value.length < 2)
        return "Minimum 2 chars";
    if (value.length > 60)
        return "Maximum 60 chars";
    if (!NAME_REGEX.test(value))
        return "Name field supporst letters, spaces, hyphens and apostrophes";
    return null;
}

// Returns an error message or null if the phone number is valid
function validatePhone(value) {
    value = value.trim();
    if (value === "")
        return "Field cannot be empty";
    if (!PHONE_REGEX.test(value))
        return "Enter a valid international number, e.g. +14155552671 (starts with +, 7-15 digits, no spaces)";
    return null;
}