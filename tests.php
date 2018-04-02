<?php

$str = file_get_contents('datos/fixture.json');
$paises = json_decode($str, true); // decode JSON en un arreglo (Sin el True convierte a Objecto)

foreach ($paises['grupoD']['equipos'] as $key => $value) {
	 echo $value["nombre"] . "<br>";
 }

?>
