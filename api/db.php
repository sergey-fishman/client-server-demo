<?php
$host = "localhost";
$user = "root";
$password = "";
$dbname = "testdb";

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(["error" => "Error connection to DB"]));
}