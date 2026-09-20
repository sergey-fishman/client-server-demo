// Requires name-rules.js (validateField) to be loaded before this file

const USERS_URL = "api/users.php"; // READ (GET)
const UPDATE_URL = "api/update.php"; // UPDATE (PUT ?id=N)
const DELETE_URL = "api/delete.php"; // DELETE (DELETE ?id=N)

document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.getElementById("usersTableBody");
    const table = document.getElementById("usersTable");
    const message = document.getElementById("usersMessage");

    // Last loaded users by id: needed to restore a row on "Cancel"
    let usersById = {};

    // ---------- messages ---------

    function showMessage(text, type) {
        message.textContent = text;
        message.className = "message " + type; // type: "success" | "error"
    }

    function clearMessage() {
        message.textContent = "";
        message.className = "message";
    }

    // --------- API -----------

    // fetch wrapper: throws an Error with a readable text if the request failed
    async function apiRequest(url, options) {
        let response;
        try {
            response = await fetch(url, options);
        } catch (err) {
            throw new Error("Server is not reachable");
        }

        let result = null;
        try {
            result = await response.json();
        } catch (err) {
            // the response is not JSON, handled below
        }

        if (!response.ok || !result || result.error) {
            throw new Error((result && result.error) || "Error loading users");
        }
        return result;
    }

    // Returns true if the table was refreshed successfully
    async function loadUsers() {
        try {
            const result = await apiRequest(USERS_URL);
            usersById = {};
            result.users.forEach(function (user) {
                usersById[user.id] = user;
            });
            renderUsers(result.users);
            table.style.display = "";
            return true;
        } catch (err) {
            table.style.display = "none";
            showMessage(err.message, "error");
            return false;
        }
    }

    // rendering

    function createCell(text) {
        const td = document.createElement("td");
        td.textContent = text;
        return td;
    }

    function createButton(label, action, extraClass) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = label;
        button.dataset.action = action;
        button.className = "btn" + (extraClass ? " " + extraClass : "");
        return button;
    }

    function createActionsCell(...buttons) {
        const td = document.createElement("td");
        td.className = "actions";
        buttons.forEach(function (button) {
            td.appendChild(button);
        });
        return td;
    }

    function createInputCell(name, value) {
        const td = document.createElement("td");
        const input = document.createElement("input");
        input.type = "text";
        input.name = name;
        input.value = value;
        input.setAttribute("aria-label", name === "first_name" ? "First name" : "Last Name");
        td.appendChild(input);
        return td;
    }

    // Normal (read-only) row
    function createRow(user) {
        const row = document.createElement("tr");
        row.dataset.id = user.id;
        row.appendChild(createCell(user.id));
        row.appendChild(createCell(user.first_name));
        row.appendChild(createCell(user.last_name));
        row.appendChild(createActionsCell(
            createButton("Edit", "edit"),
            createButton("Delete", "delete", "btn-danger")
        ));
        return row;
    }

    function renderUsers(users) {
        tableBody.replaceChildren();

        if (users.length === 0) {
            const row = document.createElement("tr");
            const cell = createCell("No users found yet");
            cell.colSpan = 4;
            cell.className = "empty";
            row.appendChild(cell);
            tableBody.appendChild(row);
            return;
        }

        users.forEach(function (user) {
            tableBody.appendChild(createRow(user))
        });
    }

    // --------- edit mode ---------

    function enterEditMode(row) {
        const user = usersById[row.dataset.id];
        row.replaceChildren(
            createCell(user.id),
            createInputCell("first_name", user.first_name),
            createInputCell("last_name", user.last_name),
            createActionsCell(
                createButton("Save changes", "save", "btn-primary"),
                createButton("Cancel", "cancel")
            )
        );
        row.querySelector("input").focus();
    }

    function leaveEditMode(row) {
        row.replaceWith(createRow(usersById[row.dataset.id]));
    }

    function markInput(input, error) {
        input.classList.remove("valid", "invalid");
        input.classList.add(error ? "invalid" : "valid");
    }

    // --------- UPDATE ----------

    async function saveRow(row, button) {
        if (!button || button.disabled) return;

        const firstInput = row.querySelector('input[name="first_name"]');
        const lastInput = row.querySelector('input[name="last_name"]');
        const firstError = validateField(firstInput.value);
        const lastError = validateField(lastInput.value);

        markInput(firstInput, firstError);
        markInput(lastInput, lastError);

        // Client-side check first; the server validates the same rules again
        if (firstError || lastError) {
            showMessage(firstError ? "First name " + firstError : "Last name " + lastError, "error");
            (firstError ? firstInput : lastInput).focus();
            return;
        }

        button.disabled = true;
        try {
            await apiRequest(UPDATE_URL + "?id=" + encodeURIComponent(row.dataset.id), {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    first_name: firstInput.value.trim(),
                    last_name : lastInput.value.trim()
                })
            });
            if (await loadUsers()) {
                showMessage("Changes saved", "success");
            }
        } catch (err) {
            button.disabled = false;
            showMessage(err.message, "error");
        }
    }

    // ------------ DELETE ------------

    async function deleteRow(row, button) {
        const user = usersById[row.dataset.id];
        if (!confirm("Delete " + user.first_name + " " + user.last_name + " (ID " + user.id + ")?")) {
            return;
        }

        button.disabled = true;
        try {
            await apiRequest(DELETE_URL + "?id=" + encodeURIComponent(user.id), {
                method: "DELETE"
            });
            if (await loadUsers()) {
                showMessage("User deleted", "success");
            }
        } catch (err) {
            button.disabled = false;
            showMessage(err.message, "error");
        }
    }

    // ----------- events (delegation: one listener for the whole table)

    tableBody.addEventListener("click", function (e) {
        const button = e.target.closest("button[data-action]");
        if (!button) return;

        const row = button.closest("tr");
        clearMessage();

        switch (button.dataset.action) {
            case "edit":
                enterEditMode(row);
                break;
            case "cancel":
                leaveEditMode(row);
                break;
            case "save":
                saveRow(row, button);
                break;
            case "delete":
                deleteRow(row, button);
                break;
        }
    });

    // Live validation while typing (same border logic as on the form page)
    tableBody.addEventListener("input", function (e) {
        if (e.target.matches("input[name]")) {
            markInput(e.target, validateField(e.target.value));
        }
    });

    // Enter = save, Escape = cancel
    tableBody.addEventListener("keydown", function (e) {
        if (!e.target.matches("input[name]")) return;

        const row = e.target.closest("tr");
        if (e.key === "Enter") {
            e.preventDefault();
            saveRow(row, row.querySelector('button[data-action="save"]'));
        } else if (e.key === "Escape") {
            clearMessage();
            leaveEditMode(row);
        }
    });

    loadUsers();
});