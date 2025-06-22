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

$name = $_POST['name'];
$amount = $_POST['amount'];
$date = $_POST['date'];
$type = isset($_POST['type']) ? $_POST['type'] : 'expense'; // Corrected type handling
$category = $_POST['category'];

if ($category == 'other') {
    $category = $_POST['newCategory'];
}

// Use prepared statements to prevent SQL injection
$stmt = $conn->prepare("INSERT INTO transactions (name, amount, date, type, category) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $name, $amount, $date, $type, $category);

if ($stmt->execute()) {
    echo "New record created successfully";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();

header('Location: index.html');
exit();
?>