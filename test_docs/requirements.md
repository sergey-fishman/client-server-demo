## Requirements for "client-server-demo" mini-project

+ **Project name:** client-server-demo.
+ **Platforms:** web.
+ **Technologies:** REST API.
+ **Languages:** EN
+ **Resources:** JSON

##  Objectives
- Objective: contact creation through the contact form with the ability to render the table of contacts, and options to modify and delete a contact from the table.

### REQ-1. Entities
- REQ-1-1. **Contact:** 
	- REQ-1-1-1. **id**: int(11);
	- REQ-1-1-2. **full_name**: varchar(60);
	- REQ-1-1-3. **phone_number**: varchar(16);

### REQ-2. Pages
- REQ-2-1. **Main page:** header, Contacts page link, contact form
- REQ-2-2. **Contacts page:** header, Main page link, contacts table

### REQ-3. API
- REQ-3-1. **contacts** endpoints
	- REQ-3-1-1. **GET** /api/contacts.php
	- REQ-3-1-2. **POST** /api/contacts.php
	- REQ-3-1-3. **PUT** /api/contacts.php?id=N
	- REQ-3-1-4. **DELETE** /api/contacts.php?id=N

### REQ-4. Input fields
- REQ-4-1. **Full name:** Name field supports Unicode  letters, must start and end with a letter. A letter can be followed by one of the allowed delimiters, which are: space, hyphen, apostrophe (U+0027). 2-60 characters.
- REQ-4-2. **Phone number:** starts with '+', then one country code digit (1-9), followed by 6 to 14 digits.
- REQ-4-3. **Input fields:** borders have live input validation, i.e. when input data is not valid or empty input fields have solid border in red color. If the data input is valid, borders have green color.
- REQ-4-4. **Input fields** both are mandatory to fill.
- REQ-4-5. **Input fields** must be trimmed of space characterss before validation.
 
### REQ-5. Submit button
- REQ-5-1. **Submit Button** is always enabled.
- REQ-5-2. Clicking the button prompts client-side input field validation.
	- REQ-5-2-1. If client-side input field validation passed, upon clicking the button message {"status":"success","id":N} appears.
	- REQ-5-2-2. If input field data is not valid, clicking the button invokes error messages.
	- REQ-5-2-3. If input field data is empty, clicking the button invokes error messages.
	
### REQ-6. Error popup messages
- REQ-6-1. Emerge upon clicking the submit button if input field data is either invalid or empty.
- REQ-6-2. Emerge automatically if entered data is not valid.
- REQ-6-3. Disappear automatically if entered data is valid.
- REQ-6-4. Contain clear and helpful text for a User.
	+ REQ-6-4-1. if any field is empty: "Field cannot be empty".
	+ REQ-6-4-2. if full name has not enough symbols: "Minimum 2 chars".
	+ REQ-6-4-3. if full name has too many symbols: "Maximum 60 chars".
	+ REQ-6-4-4. if full name does not meet the regular  expression requirement: "Name can start and end with a letter, can contain not more than one space, hyphen or apostrophe between".
	+ REQ-6-4-5. if phone number does not meet the regular  expression requirement: "Enter a valid international number, e.g. +14155552671 (starts with +, 7-15 digits, no spaces)".

### REQ-7. Contacts table
- REQ-7-1. **Table header** consists of ID, full name, Phone number, Actions.
- REQ-7-2. If empty shows "No contacts found yet" message in a table row.
- REQ-7-3. If not empty renders contacts by id in descending order.
- REQ-7-4. **Actions:** has two buttons: Edit, Delete.
- REQ-7-5. **Edit:** opens edit mode: full name and phone number input fields, Cancel and Save buttons.
	- REQ-7-5-1. Opening edit mode makes a cursor focus on the full name input.
	- REQ-7-5-2. Clicking Cancel disables edit mode, cancels all changes in the input fields and turns the table back to read only mode.
	- REQ-7-5-3. Clicking Save invokes client-side input validation logic, described in REQ-4. 
	- REQ-7-5-4. If validation is passed, clicking Save disables edit mode, saves all changes in the input fields and turns the table back to read only mode, with the message "Changes saved" appearing above the table.
	- REQ-7-5-5. If validation is not passed, clicking Save makes a cursor focus on the field with invalid data. Else if both fields have invalid data, the cursor focuses on the full name field.
	- REQ-7-5-6. If validation is not passed, clicking Save prompts **error contacts messages** to appear above the table. The **error contacts messages** have the same text, as described in REQ-6-4. 
	- REQ-7-5-7. If both fields have invalid data, the error contacts messages refer to the full_name input field only.
- REQ-7-6. **Delete:** prompts an alert dialog with the following message: "Delete {full_name, ID}?"
	- REQ-7-6-1. **Alert dialog:** has two options: OK, Cancel.
	- REQ-7-6-2. Clicking OK prompts the Alert dialog to close and the message "Contact deleted" to appear above the table.
	- REQ-7-6-3. Clicking Cancel on the Alert dialog closes it without deleting a Contact

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
