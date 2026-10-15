<?php
$host = "localhost";
$user = "root";
$password = "";
$dbname = "testdb";

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $conn = new mysqli($host, $user, $password, $dbname);
    $conn->set_charset("utf8mb4");
} catch (mysqli_sql_exception $e) {
    error_log("DB connection failed: " . $e->getMessage());
    http_response_code(503);
    header("Content-Type: application/json");
    die(json_encode(["error" => "Database is unavailable, please try again later"]));
}