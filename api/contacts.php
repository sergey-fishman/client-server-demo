<?php
header("Content-Type: application/json");
require __DIR__ . "/db.php";
require __DIR__ . "/helpers.php";

/*
Single REST resource for the "contacts" table.
GET api/contacts.php -> list all contacts
POST api/contacts.php -> create a contact; body: {"full_name","phone_number"}
PUT api/contacts.php?id=N -> update a contact; body: {"full_name","phone_number"}
DELETE api/contacts.php?id=N -> delete a contact
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
    $result = $conn->query("SELECT id, full_name, phone_number FROM contacts ORDER BY id DESC");

    if (!$result) {
        $conn->close();
        sendJson(500, ["error" => "Error reading from DB"]);
    }
    $contacts = [];
    while ($row = $result->fetch_assoc()) {
        $contacts[] = $row;
    }
    $result->free();
    $conn->close();
    sendJson(200, ["status" => "success", "contacts" => $contacts]);
}

// --------- CREATE ----------

function handlePost(mysqli $conn): void {
    $data = readJsonObject();
    [$fullName, $phoneNumber] = validateContactPayload($data);

    // Write to DB via prepared statement (protection against SQL-injections)
    $stmt = $conn->prepare("INSERT INTO contacts (full_name, phone_number) VALUES (?, ?)");
    $stmt->bind_param("ss", $fullName, $phoneNumber);

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
    [$fullName, $phoneNumber] = validateContactPayload($data);

    $stmt = $conn->prepare("UPDATE contacts SET full_name = ?, phone_number = ? WHERE id = ?");
    $stmt->bind_param("ssi", $fullName, $phoneNumber, $id);

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

    if ($affectedRows === 0 && !contactExists($conn, $id)) {
        $conn->close();
        sendJson(404, ["error" => "Contact not found"]);
    }

    $conn->close();
    sendJson(200, [
        "status" => "success",
        "id" => $id,
        "full_name" => $fullName,
        "phone_number" => $phoneNumber
    ]);
}

// ------- DELETE -------

function handleDelete(mysqli $conn): void {
    $id = getIdFromQuery();

    $stmt = $conn->prepare("DELETE FROM contacts WHERE id = ?");
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
        sendJson(404, ["error" => "Contact not found"]);
    }

    sendJson(200, ["status" => "success", "id" => $id]);
}