<?php
// Shared helpers for users.php

const NAME_PATTERN = '/^[A-Za-z\-\s]{2,30}$/';

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

// Validates first_name and last_name from the request body.
// Returns [$firstName, $lastName] (trimmed) or stops with an error.
function validateUserPayload(object $data): array {
    $requiredFields = ["first_name", "last_name"];

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

    $firstName = trim($data->first_name); // '->' gets an object property in PHP
    $lastName = trim($data->last_name);

    // Input fields cannot be empty
    if ($firstName === "" || $lastName === "") {
        sendJson(422, ["error" => "Input fields cannot be empty"]);
    }

    // Regular expression
    if(!preg_match(NAME_PATTERN, $firstName) || !preg_match(NAME_PATTERN, $lastName)) {
        sendJson(422, ["error" => "Only space, hyphen and letters allowed, up to 30 symbols in total"]);
    }

    return [$firstName, $lastName];
}

// Reads the user id from the query string (?id=5) and validates it
function getIdFromQuery(): int {
    $id = filter_var($_GET["id"] ?? null, FILTER_VALIDATE_INT, ["options" => ["min_range" => 1]]);
    if ($id === false) {
        sendJson(422, ["error" => "Query parameter 'id' must be a positive integer"]);
    }
    return $id;
}

// Checks if user with this id exists
function userExists(mysqli $conn, int $id): bool {
    $stmt = $conn->prepare("SELECT 1 FROM users WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->store_result();
    $exists = $stmt->num_rows > 0;
    $stmt->close();
    return $exists;
}