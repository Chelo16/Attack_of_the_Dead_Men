<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$dbhost="localhost";
$dbuser="u552150474_Angel";
$dbpass="AttackDead16";
$dbdata="u552150474_AttackOfTheDea";

$mysqli = new mysqli($dbhost,$dbuser,$dbpass,$dbdata) or die ('Error de conexion a mysql: ' . $msqli->error.'<br>');
if ($mysqli->connect_errno) {
    echo "Error en la conexión a MySQL: " . $mysqli->connect_error;
    exit();
}

// Obtener los datos del formulario
$username = $_POST['userName'];
$email = $_POST['email'];
$firstName = $_POST['firstName'];
$lastName = $_POST['lastName'];
$phoneNumber = $_POST['phoneNumber'];
$password = md5($_POST['password']);



// Preparar la consulta SQL para insertar un nuevo usuario
$query = "INSERT INTO users (user_name, email_address, first_name, last_name, phonenumber, password) 
          VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $mysqli->prepare($query);
$stmt->bind_param("ssssss", $username, $email, $firstName, $lastName, $phoneNumber, $password);

// Ejecutar la consulta
if ($stmt->execute()) {
    $response = array("success" => true, "message" => "Usuario creado correctamente");

} else {
    // Error en el INSERT del usuario, enviar una respuesta de error
    $response = array("success" => false, "message" => "Error al crear usuario: " . $mysqli->error);
}

// Enviar la respuesta como JSON
header('Content-Type: application/json');
echo json_encode($response);