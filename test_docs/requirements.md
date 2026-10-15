# Requirements for the "client-server-demo" mini-project

- **Project name:** client-server-demo
- **Platform:** web
- **Technologies:** REST API
- **Language:** EN
- **Data exchange format:** JSON (UTF-8)

## Objectives

Allow a User to create contacts through the contact form, view them in a table on a separate page, and modify or delete a contact directly in the table.

### REQ-1. Entities
- REQ-1-1. **Contact** consists of the following fields:
    - REQ-1-1-1. **id**: int(11), assigned by the server, unique;
    - REQ-1-1-2. **full_name**: varchar(60), mandatory;
    - REQ-1-1-3. **phone_number**: varchar(16), mandatory.

### REQ-2. Pages
- REQ-2-1. **Main page** contains a header, a link to the Contacts page and the contact form.
- REQ-2-2. **Contacts page** contains a header, a link to the Main page and the contacts table.

### REQ-3. API
- REQ-3-1. **Contacts endpoint** is a single REST resource at `/api/contacts.php`. The HTTP method determines the operation. Requests and responses use JSON.
    - REQ-3-1-1. **GET** `/api/contacts.php` returns the list of all contacts.
        - REQ-3-1-1-1. On success the response has status 200 and the body `{"status":"success","contacts":[...]}`.
        - REQ-3-1-1-2. Each element of `contacts` is an object with the fields `id` (integer), `full_name` (string) and `phone_number` (string) and no other fields.
        - REQ-3-1-1-3. Contacts are sorted by `id` in descending order.
        - REQ-3-1-1-4. If there are no contacts, the response has status 200 and an empty array: `"contacts":[]`.
        - REQ-3-1-1-5. GET requires no parameters. Query parameters, if any, are ignored.
    - REQ-3-1-2. **POST** `/api/contacts.php` creates a contact.
        - REQ-3-1-2-1. The request body is a JSON object `{"full_name":"...","phone_number":"..."}` (see REQ-3-2).
        - REQ-3-1-2-2. The data is validated according to REQ-3-3.
        - REQ-3-1-2-3. On success the response has status 201 and the body `{"status":"success","id":N}`, where N is the id of the created contact.
        - REQ-3-1-2-4. The id is assigned by the server. Fields other than `full_name` and `phone_number` (including `id`) are ignored.
        - REQ-3-1-2-5. The trimmed values (REQ-4-5) are stored.
        - REQ-3-1-2-6. There is no uniqueness check: posting the same data twice creates two separate contacts with different ids.
    - REQ-3-1-3. **PUT** `/api/contacts.php?id=N` updates the contact with id N.
        - REQ-3-1-3-1. The `id` parameter is validated according to REQ-3-4.
        - REQ-3-1-3-2. The request body has the same format as for POST and is validated according to REQ-3-2 and REQ-3-3.
        - REQ-3-1-3-3. On success the response has status 200 and the body `{"status":"success","id":N,"full_name":"...","phone_number":"..."}` with the saved (trimmed) values.
        - REQ-3-1-3-4. Both fields of the contact are replaced. All other contacts remain unchanged.
        - REQ-3-1-3-5. If the new values are identical to the stored ones, the response is still a success (status 200). The operation is idempotent and never creates a duplicate.
        - REQ-3-1-3-6. If no contact with this id exists, the response has status 404 and the body `{"error":"Contact not found"}`.
    - REQ-3-1-4. **DELETE** `/api/contacts.php?id=N` deletes the contact with id N.
        - REQ-3-1-4-1. The `id` parameter is validated according to REQ-3-4.
        - REQ-3-1-4-2. On success the response has status 200 and the body `{"status":"success","id":N}`. The contact is removed and all other contacts remain unchanged.
        - REQ-3-1-4-3. If no contact with this id exists (including a contact that has already been deleted), the response has status 404 and the body `{"error":"Contact not found"}`.
- REQ-3-2. **Request format** (POST and PUT).
    - REQ-3-2-1. The `Content-Type` header must contain `application/json`. Otherwise the response has status 415 and the body `{"error":"Content-Type must be application/json"}`.
    - REQ-3-2-2. The body must be valid JSON. Otherwise (including an empty body) the response has status 400 and the body `{"error":"Invalid JSON object"}`.
    - REQ-3-2-3. The JSON value must be an object. An array, string, number, boolean or `null` results in status 422 and the body `{"error":"JSON body must be an object"}`.
    - REQ-3-2-4. Both `full_name` and `phone_number` are required. A missing field or a field with the value `null` results in status 422, the body `{"error":"Missing required field(s): [...]}` and lists all missing fields.
    - REQ-3-2-5. Both fields must be strings. Otherwise the response has status 422 and the body `{"error":"Field(s) must be of type string:[...]}` and lists all fields of the wrong type.
	- REQ-3-2-6. Both field cannot be empty strings. Otherwise the response has status 422 and the body `{"error":"Input fields cannot be empty"}`
- REQ-3-3. **Server-side data validation** (POST and PUT).
    - REQ-3-3-1. Leading and trailing space characters are removed from both values before validation (REQ-4-5).
    - REQ-3-3-2. `full_name` must meet REQ-4-1. Otherwise the response has status 422 and the body `{"error":"Name field supports letters, spaces, hyphens and apostrophes, 60 chars max"}`. The same message is used for a name that is too short, too long or in a wrong format.
    - REQ-3-3-3. `phone_number` must meet REQ-4-2. Otherwise the response has status 422 and the body `{"error":"Phone number must start with '+', contain a country code and 7 to 15 digits in total, with no spaces"}`.
- REQ-3-4. **Parameter `id`** (PUT and DELETE).
    - REQ-3-4-1. The `id` query parameter is required and must be a positive integer (1 or greater).
    - REQ-3-4-2. A missing, empty, zero, negative, decimal or non-numeric `id` results in status 422 and the body `{"error":"Query parameter 'id' must be a positive integer"}`.
- REQ-3-5. **Responses and status codes.**
    - REQ-3-5-1. An unsupported HTTP method (anything except GET, POST, PUT and DELETE) results in status 405, the header `Allow: GET, POST, PUT, DELETE` and the body `{"error":"Method not allowed"}`.
    - REQ-3-5-2. If the database is unavailable, the response has status 503 and a JSON error body.
- REQ-3-6. **Data integrity.**
    - REQ-3-6-1. Values up to the maximum lengths (REQ-1-1-2, REQ-1-1-3) are stored and returned in full, without truncation.
    - REQ-3-6-2. Unicode letters are stored and returned unchanged.
    - REQ-3-6-3. SQL special characters in any parameter or body field do not change the query or the database (prepared statements are used).
    - REQ-3-6-4. GET and PUT are idempotent. Repeating DELETE leads to the same final state (the first response is 200, the following ones are 404). POST is not idempotent (REQ-3-1-2-6).

### REQ-4. Input fields
- REQ-4-1. **Full name:** May contain only Unicode letters and the following delimiters: space, hyphen (-) and apostrophe (U+0027). Must start and end with a letter. A delimiter must be placed between two letters. Two or more delimiters in a row are not allowed. Length: 2 to 60 characters.
- REQ-4-2. **Phone number:** starts with '+', then one country code digit (1-9), followed by 6 to 14 digits (7 to 15 digits in total). No other characters are allowed.
- REQ-4-3. **Input fields borders:** The border of each input field is validated on every input event. A field that has not been edited yet keeps its default border, even if it is empty. If the value is invalid or empty, the field has a solid red border.If the value is valid, the field has a solid green border.
- REQ-4-4. **Input fields:** Both are mandatory.
- REQ-4-5. **Input fields:** Leading and trailing space characters must be trimmed from the values before validation and before saving.
 
### REQ-5. Submit button
- REQ-5-1. **Submit Button** is always enabled.
- REQ-5-2. Clicking the button triggers client-side validation of the input fields.
	- REQ-5-2-1. If the validation passes, the data is sent to the server. After a successful response the message {"status":"success","id":N} appears.
	- REQ-5-2-2. If the data of any field is invalid, clicking the button shows error messages and the data is not sent.
	- REQ-5-2-3. If the data of any field is empty, clicking the button shows error messages and the data is not sent.
	
### REQ-6. Error messages
- REQ-6-1. An error message appears under the corresponding input field when the Submit button is clicked and the value of the field is invalid or empty.
- REQ-6-2. An error message appears automatically when the entered data is not valid.
- REQ-6-3. An error message disappears automatically when the entered data becomes valid.
- REQ-6-4. Error messages contain clear and helpful text for the User:
	+ REQ-6-4-1. If a field is empty: "Field cannot be empty".
	+ REQ-6-4-2. If the full name has fewer than 2 characters: "Minimum 2 chars".
	+ REQ-6-4-3.If the full name has more than 60 characters: "Maximum 60 chars".
	+ REQ-6-4-4. If the full name does not meet the allowed format (REQ-4-1-1 to REQ-4-1-3): "Name can start and end with a letter, can contain not more than one space, hyphen or apostrophe between".
	+ REQ-6-4-5. If the phone number does not meet the allowed format (REQ-4-2): "Enter a valid international number, e.g. +14155552671 (starts with +, 7-15 digits, no spaces)".

### REQ-7. Contacts table
- REQ-7-1. **Table header** consists of the columns ID, Full name, Phone number and Actions.
- REQ-7-2. If there are no contacts, the table shows one row with the message "No contacts found yet".
- REQ-7-3. If there are contacts, the table renders them in descending order by id.
- REQ-7-4. **Actions:** each row has two buttons: Edit and Delete.
- REQ-7-5. **Edit:** clicking Edit opens the edit mode of the row. The Full name and Phone number cells become input fields, and the Cancel and Save buttons are shown.
	- REQ-7-5-1. When the edit mode opens, the cursor is focused on the Full name input field.
	- REQ-7-5-2. Clicking Cancel closes the edit mode, discards all changes in the input fields and returns the row to the read-only mode with the stored values.
	- REQ-7-5-3. Clicking Save triggers client-side validation according to REQ-4.
	- REQ-7-5-4. If the validation passes, clicking Save sends the changes to the server. After a successful response the edit mode closes, the row shows the saved values, and the message "Changes saved" appears above the table.
	- REQ-7-5-5. If the validation fails, clicking Save places the cursor in the field with invalid data. If both fields are invalid, the cursor is placed in the Full name field.
	- REQ-7-5-6. If the validation fails, clicking Save shows error messages above the table. The text of the message is the one from REQ-6-4, prefixed with the field name ("Full name: " or "Phone number: ").
	- REQ-7-5-7. If both fields are invalid, the error message refers to the Full name field only.
- REQ-7-6. **Delete:** clicking Delete opens an alert dialog with the message "Delete {full_name} (ID {id})?".
	- REQ-7-6-1. The alert dialog has two options: OK and Cancel.
	- REQ-7-6-2. Clicking OK closes the alert dialog, deletes the contact, refreshes the table and shows the message "Contact deleted" above the table.
	- REQ-7-6-3. Clicking Cancel closes the alert dialog without deleting the contact.

## User stories

### US-1. As a User, I want to enter any valid full_name and phone_number so that it is saved into the database.
#### Acceptance criteria
+ AC-1. Contact form GUI is completed and contains full_name, phone_number input fields, submit button.
+ AC-2. Client-side field validation logic is completed.
+ AC-3. Server-side data validation logic is completed.
+ AC-4. New Contact can be created and saved to the database.
### US-2. As a User, I want to navigate to the Contacts page and come back.
#### Acceptance criteria
+ AC-1. The Main page has a visible link *"Contacts page"* leading to the Contacts page.
+ AC-2. The Contacts page has a visible link *"Main page"* leading to the Main page.
### US-3. As a User, I want to be able to see a list of created contacts on a dedicated table sorted from newest to oldest.
#### Acceptance criteria
+ AC-1. The Contacts table data is rendered correctly.
+ AC-2. The Contacts table and all its records are correclty sorted by ID on descending order.
### US-4. As a User, I want to update a Contact in the contacts table.
#### Acceptance criteria
+ AC-1. The Contacts table has "Actions" column with two buttons: Edit, Delete.
+ AC-2. Edit allows the contact to modify data inside the contacts table and either save it by pressing Save button or cancel by pressing Cancel button.
+ AC-3. Updated Contact is also updated in the database.
+ AC-4. Update operation is idempotent. The server must change the resource, but not create duplicates.
### US-5. As a User, I want to delete a Contact from the Contacts table so it is also deleted from the database.
#### Acceptance criteria
+ AC-1. The Contacts table has "Actions" column with two buttons: Edit, Delete.
+ AC-2. Delete allows to delete a Contact inside the contacts table.
+ AC-3. Alert dialog message contains the corresponding data which is about to be deleted, and two options: OK and Cancel.
+ AC-4. The deleted Contact is also deleted from the database.
