# client-server-demo API
**baseURL:** `http://localhost/client-server-demo`

Methods: GET, POST, PUT, DELETE
## Endpoints
### Get list of contacts
GET `/api/contacts.php`

#### Responses

|Code|Description|
|:--|:--|
|200|OK|

Example value:
```json
{
    "status": "success",
    "contacts": [
        {
            "id": "26",
            "full_name": "Москва-Alexander-Arnold O'Connor",
            "phone_number": "+391514790514766"
        },
        {
            "id": "21",
            "full_name": "AlexanderArnoldJeffersonOConnorMcGregorTheodorLinc",
            "phone_number": "+391514091514766"
        }
    ]
}
```
|405|Method not allowed|
|:--|:--|

Example value:
```json
{
    "error": "Method not allowed"
}
```
---
|500|Internal Server Error|
|:--|:--|

Example value:
```json
{
    "error": "Error reading from DB"
}
```
---
### Create a new Contact
POST `/api/contacts.php`

**Request body**: applicaton/json

Example value:
```json
{
    "full_name": "Pushkin Alexander Sergeevich",
    "phone_number": "+17991837"
}
```
#### Responses

|Code|Description|
|:--|:--|
|201|Created|

Example value:
```json
{
    "status": "success",
    "id": 30
}
```
---

|400|Bad Request|
|:--|:--|

Example value:
```json
{
    "error": "Invalid JSON object"
}
```
---
|405|Method not allowed|
|:--|:--|

Example value:
```json
{
    "error": "Method not allowed"
}
```
---
|415|Unsupported Media Type|
|:--|:--|

Example value:
```json
{
    "error": "Content-Type must be application/json"
}
```
---
|422|Unprocessable Entity|
|:--|:--|

Example value:
```json
{
    "error": "JSON body must be an object"
}
```
---
|500|Internal Server Error|
|:--|:--|

Example value:
```json
{
    "error": "Error writing to DB"
}
```
---
### Update a Contact by id
**PUT** `/api/contacts.php?id=N`

**Request body:** applicaton/json

**Parameters:** id

**Example value:**
```json
{
    "full_name": "Pushkinich Alexandros Sergeev",
    "phone_number": "+18991937"
}
```
#### Responses

|Code|Description|
|:--|:--|
|200|OK|

Example value:
```json
{
    "status": "success",
    "id": 30,
    "full_name": "Pushkinich Alexandros Sergeev",
    "phone_number": "+18991937"
}
```
---

|400|Bad Request|
|:--|:--|

Example value:
```json
{
    "error": "Invalid JSON object"
}
```
---
|404|Not found|
|:--|:--|

Example value:
```json
{
    "error": "Contact not found"
}
```
---
|405|Method not allowed|
|:--|:--|

Example value:
```json
{
    "error": "Method not allowed"
}
```
---
|415|Unsupported Media Type|
|:--|:--|

Example value:
```json
{
    "error": "Content-Type must be application/json"
}
```
---
|422|Unprocessable Entity|
|:--|:--|

Example value:
```json
{
    "error": "JSON body must be an object"
}
```
---
|500|Internal server error|
|:--|:--|

Example value:
```json
{
    "error": "Error updating DB"
}
```
### Delete a Contact by id
**DELETE** `/api/contacts.php?id=N`

**Parameters:** id

#### Responses

|Code|Description|
|:--|:--|
|200|OK|

Example value:
```json
{
    "status": "success",
    "id": 30
}
```
---
|404|Not found|
|:--|:--|

Example value:
```json
{
    "error": "Contact not found"
}
```
---
|405|Method not allowed|
|:--|:--|

Example value:
```json
{
    "error": "Method not allowed"
}
```
---
|500|Internal server error|
|:--|:--|

Example value:
```json
{
    "error": "Error deleting from DB"
}
```
---