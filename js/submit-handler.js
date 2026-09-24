document.getElementById("userForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    // Check if the form is valid one more time before sending it to the server
    if (!isFormValid()) {
        showAllErrors();
        return; // sending to the server is blocked
    }

    const data = {
        first_name: document.getElementById("firstName").value,
        last_name: document.getElementById("lastName").value
    };

    const response = await fetch("api/users.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    document.getElementById("result").textContent = JSON.stringify(result);
});