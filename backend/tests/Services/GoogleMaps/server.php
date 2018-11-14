<?php

const API_KEY = 'AEFKjh3e2q389adjkh32qASD';
if ($_GET['key'] !== API_KEY) {
    header('HTTP/1.1 401 Unauthorized');
    exit;
}

header('Content-Type: application/json; charset=UTF-8');
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_SERVER['PHP_SELF'] === '/geocode/json') {
    $dataPath = __DIR__ . '/data';
    $placeId = $_GET['place_id'];
    $latlng = $_GET['latlng'];
    $filePath = null;
    if ($placeId !== null) {
        $filePath = "${dataPath}/place-id/${placeId}.json";
    } elseif ($latlng !== null) {
        $filePath = "${dataPath}/latlng/${latlng}.json";
    }
    if ($filePath !== null && file_exists($filePath)) {
        echo file_get_contents($filePath);
        exit;
    }
    header('HTTP/1.1 400 Bad Request');
    echo "
{
   \"error_message\" : \"Invalid request.\",
   \"results\" : [],
   \"status\" : \"INVALID_REQUEST\"
}
";
    exit;
}

error_log($_SERVER['REQUEST_METHOD']);
error_log($_SERVER['REQUEST_URI']);
header('HTTP/1.1 404 Not Found');
