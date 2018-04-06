<?php
  // The JSON standard MIME header.
  header('Content-type: application/json');

  $fase = $_GET['fase'];

  if ($fase == "grupos") {
    echo json_encode(json_decode(file_get_contents("../datos/fixture.json"), true));
  }
?>
