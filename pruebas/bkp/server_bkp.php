<?php

  // The JSON standard MIME header.
  header('Content-type: application/json');

  $fase = $_GET['fase'];

  if ($fase == "grupos") {
    echo json_encode(json_decode(file_get_contents("../datos/fixture.json"), true));
  }

  /*

  // Here's some data that we want to send via JSON.
  // We'll include the $id parameter so that we
  // can show that it has been passed in correctly.
  // You can send whatever data you like.
  $data = array("Hello", $fase);

  // Send the data.
  echo json_encode($data);

  */

?>
