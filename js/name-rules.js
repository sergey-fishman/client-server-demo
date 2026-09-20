// Shared name rules: used by the form (validation.js) and by the users table (users.js)
 
// Regular expression: Only english letters, space char and hyphen, 2-50 chars
const NAME_REGEX = /^[A-Za-z\-\s]{2,50}$/;
 
// Returns an error message or null if the value is valid
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