<?php
header("Content-Type: application/json");
require __DIR__ . "/db.php";

$users = [];
$result = $conn->query("SELECT id, first_name, last_name
                        FROM users ORDER BY id DESC");

if($result) {
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
    $result->free();
    $conn->close();
    http_response_code(200);
    echo json_encode(["status" => "success", "users" => $users]);
} else {
    $conn->close();
    http_response_code(500);
    echo json_encode(["error" => "Error reading from DB"]);
}