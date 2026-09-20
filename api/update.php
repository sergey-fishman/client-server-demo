<?php
header("Content-Type: application/json");
require __DIR__"/db.php";
require __DIR__"/helpers.php";

// UPDATE: PUT api/update.php?id=5
// Body: {"first_name": "...", "last_name": "..."}
requireMethod("PUT");
$id = getIdFromQuery();
$data = readJsonObject();
[$firstName, $lastName] = validateUserPayload($data);

$stmt = $conn->prepare("UPDATE users SET first_name = ?, last_name = ? WHERE id = ?");
$stmt->bind_param("ssi", $firstName, $lastName, $id);

if (!$stmt->execute()) {
    $stmt->close();
    $conn->close();
    sendJson(500, ["error" => "Error updating DB"]);
}

$affectedRows = $stmt->affected_rows;
$stmt->close();

/*
    MySQL returns 0 affected rows not only when the id doesn't exist,
    but also when the new values are identical to the old ones.
    So with 0 we have to check separately the the row really exists.
*/
if ($affectedRows === 0 && !userExists($conn, $id)) {
    $conn->close();
    sendJson(404, ["error" => "User not found"]);
}

$conn->close();
sendJson(200, [
    "status" => "success",
    "id" => $id,
    "first_name" => $firstName,
    "last_name" => $lastName
]);