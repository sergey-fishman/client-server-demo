<?php
header("Content-Type: application/json");
require __DIR__ . "/db.php";
require __DIR__ . "/helpers.php";

/*
Single REST resource for the "users" table.
GET api/users.php -> list all users
POST api/users.php -> create a user; body: {"first_name","last_name"}
PUT api/users.php -> update a user; body: {"first_name","last_name"}
DELETE api/users.php -> delete a user
*/

switch ($_SERVER["REQUEST_METHOD"]) {
    case "GET":
        handleGet($conn);
        break;
    case "POST":
        handlePost($conn);
        break;
    case "PUT":
        handlePut($conn);
        break;
    case "DELETE":
        handleDelete($conn);
        break;
    default:
        header("Allow: GET, POST, PUT, DELETE");
        sendJson(405, ["error" => "Method not allowed"]);
}

// --------- READ --------

function handleGet(mysqli $conn): void {
    $result = $conn->query("SELECT id, first_name, last_name FROM users ORDER BY id DESC");

    if (!$result) {
        $conn->close();
        sendJson(500, ["error" => "Error reading from DB"]);
    }

    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
    $result->free();
    $conn->close();

    sendJson(200, ["status" => "success", "users" => $users]);
}

// --------- CREATE ----------

function handlePost(mysqli $conn): void {
    $data = readJsonObject();
    [$firstName, $lastName] = validateUserPayload($data);

    // Write to DB via prepared statement (protection against SQL-injections)
    $stmt = $conn->prepare("INSERT INTO users (first_name, last_name) VALUES (?, ?)");
    $stmt->bind_param("ss", $firstName, $lastName);

    if ($stmt->execute()) {
        $newId = $stmt->insert_id;
        $stmt->close();
        $conn->close();
        sendJson(201, ["status" => "success", "id" => $newId]);
    }

    $stmt->close();
    $conn->close();
    sendJson(500, ["error" => "Error writing to DB"]);
}

// ---------- UPDATE --------------

function handlePut(mysqli $conn): void {
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
       So with 0 we have to check separately that the row really exists.
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
}

// ------- DELETE -------

function handleDelete(mysqli $conn): void {
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
}