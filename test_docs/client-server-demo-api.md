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

**Content-Type:** applicaton/json

**Request body:** required

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

**Content-Type:** applicaton/json

**Request body:** required

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
## Appendix A. API status codes

| Status | Condition | Response body |
|---|---|---|
| 200 | GET, PUT or DELETE succeeded | see REQ-3-1-1-1, REQ-3-1-3-3, REQ-3-1-4-2 |
| 201 | POST succeeded | `{"status":"success","id":N}` |
| 400 | Request body is not valid JSON (including an empty body) | `{"error":"Invalid JSON object"}` |
| 404 | PUT or DELETE: contact with this id does not exist | `{"error":"Contact not found"}` |
| 405 | HTTP method is not GET, POST, PUT or DELETE (header `Allow: GET, POST, PUT, DELETE`) | `{"error":"Method not allowed"}` |
| 415 | `Content-Type` is not `application/json` (POST, PUT) | `{"error":"Content-Type must be application/json"}` |
| 422 | JSON body is not an object | `{"error":"JSON body must be an object"}` |
| 422 | Required field is missing or `null` | `{"error":"Missing required field(s): ...","missing_fields":[...]}` |
| 422 | Field is not a string | `{"error":"Field(s) must be of type string: ...","invalid_fields":[...]}` |
| 422 | Value is empty after trimming | `{"error":"Input fields cannot be empty"}` |
| 422 | `full_name` is invalid | `{"error":"Name field supports letters, spaces, hyphens and apostrophes, 60 chars max"}` |
| 422 | `phone_number` is invalid | `{"error":"Phone number must start with '+', contain a country code and 7 to 15 digits in total, with no spaces"}` |
| 422 | `id` is missing or not a positive integer (PUT, DELETE) | `{"error":"Query parameter 'id' must be a positive integer"}` |
| 500 | Database connection failed | `{"error":"Error connection to DB"}` |
| 500 | Database operation failed | `{"error":"Error reading from DB"}`, `{"error":"Error writing to DB"}`, `{"error":"Error updating DB"}` or `{"error":"Error deleting from DB"}` |