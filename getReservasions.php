<?php
$servername = "localhost";
$username = "root"; // Ganti dengan username database Anda
$password = ""; // Ganti dengan password database Anda
$dbname = "booking_db"; // Ganti dengan nama database Anda

// Koneksi ke database
$conn = new mysqli($servername, $username, $password, $dbname);

// Cek koneksi
if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}

// Query untuk mengambil data pemesanan
$sql = "SELECT * FROM reservations";
$result = $conn->query($sql);

$reservations = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $reservations[] = [
            'name' => $row['name'],
            'field' => $row['field'],
            'date' => $row['date'],
            'time' => $row['time']
        ];
    }
}

// Menampilkan data dalam format JSON
echo json_encode($reservations);

// Menutup koneksi
$conn->close();
?>
