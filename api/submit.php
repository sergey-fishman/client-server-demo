<?php
header("Content-Type: application/json");
require __DIR__ . "/db.php";

// 1. Method validation - POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    header("Allow: POST");
    echo json_encode(["error" => "Only POST method is allowed"]);
    exit;
}

// 2. Content-Type validation - application/json
$contentType = $_SERVER["CONTENT_TYPE"] ?? "";
if (stripos($contentType, "application/json") === false) {
    http_response_code(415);
    echo json_encode(["error" => "Content-Type must be application/json"]);
    exit;
}

/*
3. Reading and parsing a request body
    Without the second argument (true) json_decode returns:
    - stdClass for a JSON-object {...}
    - array for a JSONS-array [...]
    - string/int,bool/null for scalar data types and null
    This lets us identify an object by a type, not by keys
*/
$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput);

if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON object"]);
    exit;
}

// 4. 'JSON body must be an object' validation
if (!is_object($data)) {
    http_response_code(422);
    echo json_encode(["error" => "JSON body must be an object"])
}

// 5. Required fields check
$requiredFields = ["first_name", "last_name"];
$missingFields = [];

foreach ($requiredFields as $field) {
    if (!isset($data->$field)) {
        $missingFields[] = $field;
    }
}

if (!empty($missingFields)) {
    http_response_code(422) {
        echo json_encode([
            "error" => "Missing required field(s): " . implode(", ", $missingFields),
            "missing_fields" => $missingFields
        ]);
        exit;
    }
}

//6. Field data type string validation
$invalidTypeFields = [];

foreach ($requiredFields as $field) {
    if (!is_string($data->$field)) {
        $invalidTypeFields[] = $field;
    }
}

if (!empty($invalidTypeFields)) {
    http_response_code(422);
    echo json_encode([
        "error" => "Field(s) must be of type string: " . implode(", ", $invalidTypeFields),
        "invalid_fields" => $invalidTypeFields
    ]);
    exit;
}

$firstName = trim($data->first_name); // '->' gets an object property in PHP
$lastName = trim($data->last_name);

// 7. Input fields cannot be empty
if ($firstName === "" || $lastName === "") {
    http_response_code(422);
    echo json_encode(["error" => "Input fields cannot be empty"]);
    exit;
}

// 8. Regular expression
$namePattern = '/^[A-Za-z\-\s]{2,50}$/';

if (!preg_match($namePattern, $firstName) || !preg_match($namePattern, $lastName)) {
    http_response_code(422);
    echo json_encode(["error" => "Only letters, space char and hyphen allowed"]);
    exit;
}

// Write to the DB via prepared statement (protection against SQL-injections)
$stmt = $conn->prepare("INSERT INTO users (first_name, last_name) VALUES (?, ?)");
$stmt->bind_param("ss", $firstName, $lastName);

if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode(["status" => "success", "id" => $stmt->insert_id]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Error writing to DB"]);
}

$stmt->close();
$conn->close();