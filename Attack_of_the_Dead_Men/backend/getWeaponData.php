<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
// Aquí se establecería la conexión con la base de datos si fuera necesario
$dbhost="localhost";
$dbuser="u552150474_Angel";
$dbpass="AttackDead16";
$dbdata="u552150474_AttackOfTheDea";

$mysqli = new mysqli($dbhost,$dbuser,$dbpass,$dbdata) or die ('Error de conexion a mysql: ' . $msqli->error.'<br>');
if ($mysqli->connect_errno) {
    echo "Error en la conexión a MySQL: " . $mysqli->connect_error;
    exit();
}
// Endpoint para obtener datos
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Aquí iría la lógica para obtener los datos, por ejemplo:
    $id = $_GET['id'];

    $query = "SELECT *
          FROM equipment
          WHERE ID = '$id';";

    $result = $mysqli->query($query);
    if (!$result) {
        echo "Error al ejecutar la consulta: " . $mysqli->error;
        exit();
    }
    $weapon = [];
    while ($row = $result->fetch_assoc()) {
        $weapon = $row;
    }
    // Convertir los datos a JSON
    $json = json_encode($weapon);
    
    // Enviar la respuesta
    header('Content-Type: application/json');
    echo $json;
    
} else {
    // Si el método de solicitud no es GET, devolver un error
    http_response_code(405);
    echo json_encode(array('message' => 'Método no permitido'));
}
$mysqli->close();
