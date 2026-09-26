// Requires name-rules.js (validateFullName, validatePhone) to be loaded before this file

// Single REST resource: same URL, the HTTP method decides the operation
// GET api/contacts.php -> list, POST -> create, PUT ?id=N -> update, DELETE ?id=N -> delete

const CONTACTS_URL = "api/contacts.php";

document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.getElementById("contactsTableBody");
    const table = document.getElementById("contactsTable");
    const message = document.getElementById("contactsMessage");

    // Last loaded contacts  by id: needed to restore a row on "Cancel"
    let contactsById = {};

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
            throw new Error((result && result.error) || "Error loading contacts");
        }
        return result;
    }

    // Returns true if the table was refreshed successfully
    async function loadContacts() {
        try {
            const result = await apiRequest(CONTACTS_URL);
            contactsById = {};
            result.contacts.forEach(function (contact) {
                contactsById[contact.id] = contact;
            });
            renderContacts(result.contacts);
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

    function createInputCell(name, value, ariaLabel) {
        const td = document.createElement("td");
        const input = document.createElement("input");
        input.type = name === "phone_number" ? "tel" : "text";
        input.name = name;
        input.value = value;
        input.setAttribute("aria-label", ariaLabel);
        td.appendChild(input);
        return td;
    }

    // Normal (read-only) row
    function createRow(contact) {
        const row = document.createElement("tr");
        row.dataset.id = contact.id;
        row.appendChild(createCell(contact.id));
        row.appendChild(createCell(contact.full_name));
        row.appendChild(createCell(contact.phone_number));
        row.appendChild(createActionsCell(
            createButton("Edit", "edit"),
            createButton("Delete", "delete", "btn-danger")
        ));
        return row;
    }

    function renderContacts(contact) {
        tableBody.replaceChildren();

        if (contact.length === 0) {
            const row = document.createElement("tr");
            const cell = createCell("No contacts found yet");
            cell.colSpan = 4;
            cell.className = "empty";
            row.appendChild(cell);
            tableBody.appendChild(row);
            return;
        }

        contact.forEach(function (contact) {
            tableBody.appendChild(createRow(contact))
        });
    }

    // --------- edit mode ---------

    function enterEditMode(row) {
        const contact = contactsById[row.dataset.id];
        row.replaceChildren(
            createCell(contact.id),
            createInputCell("full_name", contact.full_name, "Full name"),
            createInputCell("phone_number", contact.phone_number, "Phone number"),
            createActionsCell(
                createButton("Cancel", "cancel"),
                createButton("Save", "save", "btn-primary")
            )
        );
        row.querySelector("input").focus();
    }

    function leaveEditMode(row) {
        row.replaceWith(createRow(contactsById[row.dataset.id]));
    }

    function markInput(input, error) {
        input.classList.remove("valid", "invalid");
        input.classList.add(error ? "invalid" : "valid");
    }

    function validatorFor(input) {
        return input.name === "phone_number" ? validatePhone : validateFullName;
    }

    // --------- UPDATE ----------

    async function saveRow(row, button) {
        if (!button || button.disabled) return;

        const fullNameInput = row.querySelector('input[name="full_name"]');
        const phoneInput = row.querySelector('input[name="phone_number"]');
        const fullNameError = validateFullName(fullNameInput.value);
        const phoneError = validatePhone(phoneInput.value);

        markInput(fullNameInput, fullNameError);
        markInput(phoneInput, phoneError);

        // Client-side check first; the server validates the same rules again
        if (fullNameError || phoneError) {
            showMessage(fullNameError ? "Full name: " + fullNameError : "Phone number: " + phoneError, "error");
            (fullNameError ? fullNameInput : phoneInput).focus();
            return;
        }

        button.disabled = true;
        try {
            await apiRequest(CONTACTS_URL + "?id=" + encodeURIComponent(row.dataset.id), {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    full_name: fullNameInput.value.trim(),
                    phone_number: phoneInput.value.trim()
                })
            });
            if (await loadContacts()) {
                showMessage("Changes saved", "success");
            }
        } catch (err) {
            button.disabled = false;
            showMessage(err.message, "error");
        }
    }

    // ------------ DELETE ------------

    async function deleteRow(row, button) {
        const contact = contactsById[row.dataset.id];
        if (!confirm("Delete " + contact.full_name + " (ID " + contact.id + ")?")) {
            return;
        }

        button.disabled = true;
        try {
            await apiRequest(CONTACTS_URL + "?id=" + encodeURIComponent(contact.id), {
                method: "DELETE"
            });
            if (await loadContacts()) {
                showMessage("Contact deleted", "success");
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
            markInput(e.target, validatorFor(e.target)(e.target.value));
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

    loadContacts();
});