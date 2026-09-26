<?php
// Shared helpers for the contacts API (api/contacts.php)

// const NAME_PATTERN = '/^[A-Za-z\-\s]{2,50}$/';
const NAME_PATTERN = '/^(?=.{2,60}$)\p{L}+(?:[ -\'\x{2019}]\p{L}+)*$/u';
const PHONE_PATTERN = '/^\+[1-9]\d{6,14}$/';

// Sends a JSON response with the given HTTP status code and stops the script
function sendJson(int $status, array $payload): void {
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

// Content-Type validation, reading and parsing the body.
// Returns the decoded JSON object (stdClass) or stops with an error.
function readJsonObject(): object {
    $contentType = $_SERVER["CONTENT_TYPE"] ?? "";
    if (stripos($contentType, "application/json") === false) {
        sendJson(415, ["error" => "Content-Type must be application/json"]);
    }

    $rawInput = file_get_contents("php://input");
    $data = json_decode($rawInput);

    if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
        sendJson(400, ["error" => "Invalid JSON object"]);
    }

    if (!is_object($data)) {
        sendJson(422, ["error" => "JSON body must be an object"]);
    }

    return $data;
}

// Validates full_name and phone_number from the request body.
// Returns [$fullName, $phoneNumber] (trimmed) or stops with an error.
function validateContactPayload(object $data): array {
    $requiredFields = ["full_name", "phone_number"];

    // Required fields check
    $missingFields = [];
    foreach ($requiredFields as $field) {
        if (!isset($data->$field)) {
            $missingFields[] = $field;
        }
    }
    if (!empty($missingFields)) {
        sendJson(422, [
            "error" => "Missing required field(s): " . implode(", ", $missingFields),
            "missing_fields" => $missingFields
        ]);
    }

    // Field data type string validation
    $invalidTypeFields = [];
    foreach ($requiredFields as $field) {
        if (!is_string($data->$field)) {
            $invalidTypeFields[] = $field;
        }
    }
    if (!empty($invalidTypeFields)) {
        sendJson(422, [
            "error" => "Field(s) must be of type string: " . implode(", ", $invalidTypeFields),
            "invalid_fields" => $invalidTypeFields
        ]);
    }

    $fullName = trim($data->full_name); // '->' gets an object property in PHP
    $phoneNumber = trim($data->phone_number);

    // Input fields cannot be empty
    if ($fullName === "" || $phoneNumber === "") {
        sendJson(422, ["error" => "Input fields cannot be empty"]);
    }

    // Regular expression for the full name
    if(!preg_match(NAME_PATTERN, $fullName)) {
        sendJson(422, ["error" => "Name field supporst letters, spaces, hyphens and apostrophes, 60 chars max"]);
    }

    // Regular expression for the phone number
    if(!preg_match(PHONE_PATTERN, $phoneNumber)) {
        sendJson(422, ["error" => "Phone number must start with '+', contain a country code and 7 to 15 digits in total, with no spaces"]);
    }

    return [$fullName, $phoneNumber];
}

// Reads the user id from the query string (?id=5) and validates it
function getIdFromQuery(): int {
    $id = filter_var($_GET["id"] ?? null, FILTER_VALIDATE_INT, ["options" => ["min_range" => 1]]);
    if ($id === false) {
        sendJson(422, ["error" => "Query parameter 'id' must be a positive integer"]);
    }
    return $id;
}

// Checks if contact with this id exists
function contactExists(mysqli $conn, int $id): bool {
    $stmt = $conn->prepare("SELECT 1 FROM contacts WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->store_result();
    $exists = $stmt->num_rows > 0;
    $stmt->close();
    return $exists;
}