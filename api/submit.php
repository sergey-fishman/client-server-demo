<?php
header("Content-Type: application/json");
require __DIR__ . "/db.php";

// Читаем "сырое" тело запроса
$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);

//Проверка, что JSON вообще распарсился
if ($data === null) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON"]);
    exit;
}

// Проверка наличия полей и их типа (валидация на string)
if (
    !isset($data["first_name"]) || !isset($data["last_name"]) ||
    !is_string($data["first_name"]) || !is_string($data["last_name"])
) {
    http_response_code(422);
    echo json_encode(["error" => "Input fields must be string format"]);
    exit;
}

$firstName = trim($data["first_name"]);
$lastName = trim($data["last_name"]);

$namePattern = '/^[A-Za-z\-\s]{2,50}$/';

if (!preg_match($namePattern, $firstName) || !preg_match($namePattern, $lastName)) {
    http_response_code(422);
    echo json_encode(["error" => "Only letters, space char and hyphen allowed"]);
    exit;
}

// Проверка, что строки не пустые
if ($firstName === "" || $lastName === "") {
    http_response_code(422);
    echo json_encode(["error" => "Input fields cannot be empty"]);
    exit;
}

// Запись в БД через prepared statement (защита от SQL-инъекций)
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