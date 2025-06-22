<?php
$servername = "localhost";
$username = "root"; // Change this to your database username
$password = ""; // Change this to your database password
$dbname = "expense_tracker";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$id = $_GET['id'];

// Use prepared statement to prevent SQL injection
$stmt = $conn->prepare("DELETE FROM transactions WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo "Record deleted successfully";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>