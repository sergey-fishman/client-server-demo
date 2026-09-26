## Requirements for "client-server-demo" mini-project

+ **Project name:** client-server-demo.
+ **Platforms:** web.
+ **Technologies:** REST API.

### 1. Objectives

- Objective: user creation through the user form with the ability to render the table of users, and options to modify and delete a user from the table.


### 2. Entities
- **User:** id, first_name, last_name.

### 3. Pages
1. **Main page:** header, users page link, user form
2. **Users page:** header, index page link, users table
	- **users table header:** id, first_name, last_name, actions
		+ **actions:** edit, delete
		
### 4. User input
- **first_name and last_name:** the English alphabet, and not more than one space and/or hyphen in a row, 2-30 symbols. RegExp example:
`^(?=.{2,30}$)[A-Za-z]+(?:[ -\s][A-Za-z]+)*$`

### 5. Submit button
1. Always enabled.
2. Clicking the button prompts client-side input field validation.
	- If client-side input field validation passed, clicking the button creates a new user.

### 6. Users table
1. If empty shows "No users found yet" message.
2. Otherwise renders users ordered by id DESC.
3. **Actions:** has two buttons: Edit, Delete.
	- **Edit:** has two buttons: Cancel, Save.
		- **Cancel:** cancels editing mode.
		- **Save:** prompts client-side input field validation.
			- If client-side input field validation passed, clicking the button updates a user.
	- **Delete:** prompts an alert message: "Delete {first_name, last_name}?"
		- **Alert message:** has two options: OK, Cancel.

### 7. Localisation and format
- **Languages:** EN
- **Resources:** JSON

### 8. API
- **Users**
	+ GET /api/users.php
	+ POST /api/users.php
	+ UPDATE /api/users.php?id=N
	+ DELETE /api/users.php?id=N

## User stories
### 1. As a User, I want to enter any first_name and last_name so that it is saved into a database.
#### Acceptance criteria
+ User form GUI is completed and contains first_name, last_name input fields, submit button.
+ Client-side field validation logic is completed.
+ Server-side data validation logic is completed.
+ User data can be created and saved to the database.
### 2. As a User, I want to navigate to the Users page and come back with ease.
#### Acceptance criteria
+ The Main page has a visible link to the Users page.
+ The Users page has a visible link to the Main page. 
+ All links work as intended.
### 3. As a User, I want to be able to see a list of created users on a dedicated page.
#### Acceptance criteria
+ The Users table is rendered with all data.
+ The Users table and all its contents are readable on most screen resolutions including mobile.
### 4. As a User, I want to update and delete data in the Users table so that it is saved into a database and so that I would see the changes right away.
#### Acceptance criteria
+ The Users table has "Actions" column with two buttons: Edit, Delete.
+ Edit allows the User to modify data inside the Users table and either save it by pressing Save button or cancel by pressing Cancel button.
+ Delete allows the User to delete the whole row with all the data from the Users table after confirming this action on an alert message.
+ Alert message contains the corresponding data which is about to be deleted, and two button: OK and Cancel.
+ Modified data is also updated in the database.
+ Deleted data is deleted from the database.