## Requirements for "client-server-demo" mini-project

+ **Project name:** client-server-demo.
+ **Platforms:** web.
+ **Technologies:** REST API.

### 1. Objectives
- Objective: contact creation through the contact form with the ability to render the table of contacts, and options to modify and delete a contact from the table.

### 2. Entities
- **Contact:** id, full_name, phone_number.

### 3. Pages
1. **Main page:** header, contacts page link, contact form
2. **Contacts page:** header, index page link, contacts table
	- **contacts table header:** id, full_name, phone_number, actions
		+ **actions:** edit, delete
		
### 4. Contact input
- **full_name and phone_number:** Name field supporst Unicode format letters, spaces, hyphens and apostrophes. 2-60 symbols

### 5. Submit button
1. Always enabled.
2. Clicking the button prompts client-side input field validation.
	- If client-side input field validation passed, clicking the button creates a new contact.

### 6. contacts table
1. If empty shows "No contacts found yet" message.
2. Otherwise renders contacts ordered by id DESC.
3. **Actions:** has two buttons: Edit, Delete.
	- **Edit:** has two buttons: Cancel, Save.
		- **Cancel:** cancels editing mode.
		- **Save:** prompts client-side input field validation.
			- If client-side input field validation passed, clicking the button updates a contact.
	- **Delete:** prompts an alert message: "Delete {full_name, phone_number}?"
		- **Alert message:** has two options: OK, Cancel.

### 7. Localisation and format
- **Languages:** EN
- **Resources:** JSON

### 8. API
- **contacts**
	+ GET /api/contacts.php
	+ POST /api/contacts.php
	+ UPDATE /api/contacts.php?id=N
	+ DELETE /api/contacts.php?id=N

## contact stories
### 1. As a User, I want to enter any full_name and phone_number so that it is saved into a database.
#### Acceptance criteria
+ contact form GUI is completed and contains full_name, phone_number input fields, submit button.
+ Client-side field validation logic is completed.
+ Server-side data validation logic is completed.
+ contact data can be created and saved to the database.
### 2. As a User, I want to navigate to the contacts page and come back with ease.
#### Acceptance criteria
+ The Main page has a visible link to the contacts page.
+ The contacts page has a visible link to the Main page. 
+ All links work as intended.
### 3. As a User, I want to be able to see a list of created contacts on a dedicated page.
#### Acceptance criteria
+ The contacts table is rendered with all data.
+ The contacts table and all its contents are readable on most screen resolutions including mobile.
### 4. As a User, I want to update and delete data in the contacts table so that it is saved into a database and so that I would see the changes right away.
#### Acceptance criteria
+ The contacts table has "Actions" column with two buttons: Edit, Delete.
+ Edit allows the contact to modify data inside the contacts table and either save it by pressing Save button or cancel by pressing Cancel button.
+ Delete allows the contact to delete the whole row with all the data from the contacts table after confirming this action on an alert message.
+ Alert message contains the corresponding data which is about to be deleted, and two button: OK and Cancel.
+ Modified data is also updated in the database.
+ Deleted data is deleted from the database.