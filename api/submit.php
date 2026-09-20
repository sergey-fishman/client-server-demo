<?php
header("Content-Type: application/json");
require __DIR__ . "/db.php";
require __DIR__ . "/helpers.php";

// CREATE: POST api/submit.php
// Body: {"first_name": "...", "last_name": "..."}
requireMethod("POST");
$data = readJsonObject();
[$fistName, $lastName] = validateUserPayload($data);

// Write to DB via prepared statement (protection against SQl-injections)
$stmt = $conn->prepare("INSERT INTO users (first_name, last_name) VALUES (?, ?)");
$stmt->bind_param("ss", $fistName, $lastName);

if ($stmt->execute()) {
    $newId = $stmt->insert_id;
    $stmt->close();
    $conn->close();
    sendJson(201, ["status" => "success", "id" => $newId]);
}

$stmt->close();
$conn->close();
sendJson(500, ["error" => "Error writing to DB"]);