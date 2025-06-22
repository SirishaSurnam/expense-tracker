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

$sql = "SELECT id, name, amount, date, type, category FROM transactions";
$result = $conn->query($sql);

$transactions = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $transactions[] = $row;
    }
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($transactions);
?>