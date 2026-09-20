<?php
header("Content-Type: application/json");
require __DIR__ . "/db.php";
require __DIR__ . "/helpers.php";

// DELETE: DELETE api/delete.php?id=5
requireMethod("DELETE");
$id = getIdFromQuery();

$stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
$stmt->bind_param("i", $id);

if (!$stmt->execute()) {
    $stmt->close();
    $conn->close();
    sendJson(500, ["error" => "Error deleting from DB"]);
}

$affectedRows = $stmt->affected_rows;
$stmt->close();
$conn->close();

if ($affectedRows === 0) {
    sendJson(404, ["error" => "User not found"]);
}

sendJson(200, ["status" => "success", "id" => $id]);