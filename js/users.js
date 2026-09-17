document.addEventListener("DOMContentLoaded", async function () {
    const tableBody = document.getElementById("usersTableBody");
    const table = document.getElementById("usersTable");
    const message = document.getElementById("usersMessage");

    try {
        const response = await fetch("api/users.php");
        const result = await response.json();

        if (!response.ok || result.error) {
            table.style.display = "none";
            message.textContent = result.error || "Error loading users";
            return;
        }

        const users = result.users;

        if (users.length === 0) {
            table.style.display = "none";
            message.textContent = "No users found yet";
            return;
        }

        users.forEach(function (user) {
            const row = document.createElement("tr");

            const idCell = document.createElement("td");
            idCell.textContent = user.id;

            const firstNameCell = document.createElement("td");
            firstNameCell.textContent = user.first_name;

            const lastNameCell = document.createElement("td");
            lastNameCell.textContent = user.last_name;

            row.appendChild(idCell);
            row.appendChild(firstNameCell);
            row.appendChild(lastNameCell);
            tableBody.appendChild(row);
        });
    } catch (err) {
        table.style.display = "none";
        message.textContent = "Failed to load users";
    }
});