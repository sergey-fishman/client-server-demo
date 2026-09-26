document.getElementById("contactForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    // Check if the form is valid one more time before sending it to the server
    if (!isFormValid()) {
        showAllErrors();
        return; // sending to the server is blocked
    }

    const data = {
        full_name: document.getElementById("fullName").value,
        phone_number: document.getElementById("phoneNumber").value
    };

    const response = await fetch("api/contacts.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    document.getElementById("result").textContent = JSON.stringify(result);
});