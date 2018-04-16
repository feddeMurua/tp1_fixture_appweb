/*

CICLO DE LAS FUNCIONES ADICIONALES

init - datos
datos: recibe json
recorrer_grupo: json, grupos, fecha y partido

**** termino la carga de grupos ***

**** fase octavos ****
clasificacion_equipos - crear_puntaje_equipo - calcular_puntos
calcular_puntos - actualizar_tabla
generar_octavos - octavos
octavos - armar_llaves

*/

//equipo_clasificado
function crear_clasificado(nombre_equipo) {
  return {nombre:nombre_equipo,
        };
}

//partidos de la llave
function crear_partido_llave(nombre_llave) {
  return {nombre_llave:nombre_llave,
          equipo_1:'',
          goles_eq_1:'',
          equipo_2:'',
          goles_eq_2:''
        };
}

//crea los cruces y asigna valores a los inputs
function armar_llaves(json, ganador_grupo_1, ganador_grupo_2, llave, fase) {

  $.each(json["partidos"][llave], function(i, f) {

    var nombre_equipo1 = f.equipo_1.replace(f.equipo_1, ganador_grupo_1);
    var nombre_equipo2 = f.equipo_2.replace(f.equipo_2, ganador_grupo_2);
    var equipo_1 = "<label id='"+f.equipo_1+"'>" + nombre_equipo1 + "</label>" ;
    var input_equipo_1 = "<input id='"+f.equipo_1+"_"+f.fecha+"' type='number' min='0' style='width:12%; text-align:center;'/>  ";
    var input_equipo_2 = "<input id='"+f.equipo_2+"_"+f.fecha+"' type='number' min='0' style='width:12%; text-align:center;'/>";
    var equipo_2 = "<label id='"+f.equipo_2+"'>" + nombre_equipo2 + "</label>" ;
    var fecha = "<label>" + f.fecha + "</label>";
    var estadio = "<label>" + f.estadio + "</label>";
    var ciudad = "<label>" + f.ciudad + "</label> ";
    var hora = "<label>" + f.hora + "</label> <br>";
    var nombreEquipo1 = "'../imagenes/"+nombre_equipo1+".png'";
    var nombreEquipo2 = "'../imagenes/"+nombre_equipo2+".png'";
    var imgEquipo1 = "<img src="+nombreEquipo1+" width='38' height='30'/>";
    var imgEquipo2 = "<img src="+nombreEquipo2+" width='38' height='30'/> <br>";

    $(imgEquipo1).appendTo(llave);
    $(llave).append(" ");
    $(equipo_1).appendTo(llave);
    $(llave).append(" ");
    $(input_equipo_1).appendTo(llave);
    $(llave).append(" ");
    $(input_equipo_2).appendTo(llave);
    $(llave).append(" ");
    $(equipo_2).appendTo(llave);
    $(llave).append(" ");
    $(imgEquipo2).appendTo(llave);
    $(fecha).appendTo(llave);
    $(llave).append(" | ");
    $(estadio).appendTo(llave);
    $(llave).append(" | ");
    $(ciudad).appendTo(llave);
    $(llave).append(" | ");
    $(hora).appendTo(llave);

    partido_llave = crear_partido_llave(llave);
    partido_llave["equipo_1"] = ganador_grupo_1;
    partido_llave["goles_eq_1"] = f.equipo_1+"_"+f.fecha;
    partido_llave["equipo_2"] = ganador_grupo_2;
    partido_llave["goles_eq_2"] = f.equipo_2+"_"+f.fecha;

 });

 if (fase == '8vos') {
    list_partidos_llave_8vos.push(partido_llave);
 } else if (fase == '4tos') {
   list_partidos_llave_4tos.push(partido_llave);
 } else if (fase == 'semis') {
   list_partidos_llave_semis.push(partido_llave);
 }


}

//resultado de la llave
function calcular_resultados(list_partidos, dict_partidos_llave){

  for (var j = 0; j < list_partidos.length; j++) {

      goles_eq_1 = document.getElementById(list_partidos[j]["goles_eq_1"]).value;
      goles_eq_2 = document.getElementById(list_partidos[j]["goles_eq_2"]).value;

      if (goles_eq_1 > goles_eq_2){
        clasificado = crear_clasificado(list_partidos[j]["equipo_1"]);
      }
      else if (goles_eq_2 > goles_eq_1) {
        clasificado = crear_clasificado(list_partidos[j]["equipo_2"]);
      }
      else {
        clasificado = crear_clasificado(list_partidos[j]["equipo_1"]);
      }
      dict_partidos_llave[list_partidos[j]["nombre_llave"]] = clasificado;
  }

}

/* **************** FINAL **************** */

function final(json_final){

  armar_llaves(json_final, dict_partidos_llave_final["#semis_1"].nombre , dict_partidos_llave_final["#semis_2"].nombre, "#final_1", "semis");

}

function generar_final(){
  $.getJSON(
    "../server.php", // Server URL
    { fase: "final" }, // Dato que se envia al servidor
    final
  );
}

function clasificacion_final() {

  //deshabilitar boton semis
  document.getElementById("btn-final").disabled = true;


  calcular_resultados(list_partidos_llave_semis, dict_partidos_llave_final);

  generar_final();

}

/* ***************************************** */

/* **************** SEMIS **************** */

function semis(json_semis){

  armar_llaves(json_semis, dict_partidos_llave_semis["#cuartos_1"].nombre , dict_partidos_llave_semis["#cuartos_2"].nombre, "#semis_1", "semis");
  armar_llaves(json_semis, dict_partidos_llave_semis["#cuartos_3"].nombre , dict_partidos_llave_semis["#cuartos_4"].nombre, "#semis_2", "semis");

  document.getElementById("btn-final").disabled = false; //habilitar boton de final

}

function generar_semis(){
  $.getJSON(
    "../server.php", // Server URL
    { fase: "semis" }, // Dato que se envia al servidor
    semis
  );
}

function clasificacion_semis() {

  //deshabilitar boton semis
  document.getElementById("btn-semis").disabled = true;

  calcular_resultados(list_partidos_llave_4tos, dict_partidos_llave_semis);

  generar_semis();

}

/* ***************************************** */

/* **************** CUARTOS **************** */

function cuartos(json_4vos){

  armar_llaves(json_4vos, dict_partidos_llave_4vos["#octavos_1"].nombre , dict_partidos_llave_4vos["#octavos_2"].nombre, "#cuartos_1", "4tos");
  armar_llaves(json_4vos, dict_partidos_llave_4vos["#octavos_5"].nombre , dict_partidos_llave_4vos["#octavos_6"].nombre, "#cuartos_2", "4tos");
  armar_llaves(json_4vos, dict_partidos_llave_4vos["#octavos_3"].nombre , dict_partidos_llave_4vos["#octavos_4"].nombre, "#cuartos_3", "4tos");
  armar_llaves(json_4vos, dict_partidos_llave_4vos["#octavos_7"].nombre , dict_partidos_llave_4vos["#octavos_8"].nombre, "#cuartos_4", "4tos");

  document.getElementById("btn-semis").disabled = false; //habilitar boton de semis

}

function generar_cuartos(){
  $.getJSON(
    "../server.php", // Server URL
    { fase: "cuartos" }, // Dato que se envia al servidor
    cuartos
  );
}

function clasificacion_cuartos() {

  //deshabilitar boton 4vos
  document.getElementById("btn-cuartos").disabled = true;

  calcular_resultados(list_partidos_llave_8vos, dict_partidos_llave_4vos);

  generar_cuartos();

}

/* ***************************************** */

/* **************** OCTAVOS **************** */

function octavos(json_8vos){

  //funcion lodash para trabajar los diccionarios
  var ganadores_ga = _.slice((_.sortBy(dict_puntajes_grupoA, ['puntos','dif_gol','goles_a_favor','goles_en_contra'])),2); // slice toma las ultimas dos posiciones, pos 0: segundo en la tabla
  var ganadores_gb = _.slice((_.sortBy(dict_puntajes_grupoB, ['puntos','dif_gol','goles_a_favor','goles_en_contra'])),2);
  armar_llaves(json_8vos, ganadores_ga[1].nombre, ganadores_gb[0].nombre, "#octavos_1", "8vos");
  armar_llaves(json_8vos, ganadores_gb[1].nombre, ganadores_ga[0].nombre, "#octavos_3", "8vos");

  var ganadores_gc = _.slice((_.sortBy(dict_puntajes_grupoC, ['puntos','dif_gol','goles_a_favor','goles_en_contra'])),2);
  var ganadores_gd = _.slice((_.sortBy(dict_puntajes_grupoD, ['puntos','dif_gol','goles_a_favor','goles_en_contra'])),2);
  armar_llaves(json_8vos, ganadores_gc[1].nombre, ganadores_gd[0].nombre, "#octavos_2", "8vos");
  armar_llaves(json_8vos, ganadores_gd[1].nombre, ganadores_gc[0].nombre, "#octavos_4", "8vos");

  var ganadores_ge = _.slice((_.sortBy(dict_puntajes_grupoE, ['puntos','dif_gol','goles_a_favor','goles_en_contra'])),2);
  var ganadores_gf = _.slice((_.sortBy(dict_puntajes_grupoF, ['puntos','dif_gol','goles_a_favor','goles_en_contra'])),2);
  armar_llaves(json_8vos, ganadores_ge[1].nombre, ganadores_gf[0].nombre, "#octavos_5", "8vos");
  armar_llaves(json_8vos, ganadores_gf[1].nombre, ganadores_ge[0].nombre, "#octavos_7", "8vos");

  var ganadores_gg = _.slice((_.sortBy(dict_puntajes_grupoG, ['puntos','dif_gol','goles_a_favor','goles_en_contra'])),2);
  var ganadores_gh = _.slice((_.sortBy(dict_puntajes_grupoH, ['puntos','dif_gol','goles_a_favor','goles_en_contra'])),2);
  armar_llaves(json_8vos, ganadores_gg[1].nombre, ganadores_gh[0].nombre, "#octavos_6", "8vos");
  armar_llaves(json_8vos, ganadores_gh[1].nombre, ganadores_gg[0].nombre, "#octavos_8", "8vos");

  document.getElementById("btn-cuartos").disabled = false; //habilitar boton de 4tos

}

function generar_octavos(){
  $.getJSON(
    "../server.php", // Server URL
    { fase: "octavos" }, // Dato que se envia al servidor
    octavos
  );
}

/* ***************************************** */

//actualiza las posiciones en el torneo
function actualizar_tabla(goles_a_favor, goles_en_contra, equipo, dict_puntajes_grupo) {

  // trabajar sobre la tabla de puntaje
  dict_puntajes_grupo[equipo].goles_a_favor = dict_puntajes_grupo[equipo].goles_a_favor + parseInt(goles_a_favor);
  dict_puntajes_grupo[equipo].goles_en_contra = dict_puntajes_grupo[equipo].goles_en_contra + parseInt(goles_en_contra);
  dict_puntajes_grupo[equipo].dif_gol =  dict_puntajes_grupo[equipo].dif_gol + (parseInt(goles_a_favor) - parseInt(goles_en_contra));

  if ( goles_a_favor > goles_en_contra ) {
    dict_puntajes_grupo[equipo].puntos = dict_puntajes_grupo[equipo].puntos + 3;
  } else if (goles_a_favor == goles_en_contra) {
    dict_puntajes_grupo[equipo].puntos = dict_puntajes_grupo[equipo].puntos + 1;
  }
}

//compara resultados de cada partido
function calcular_puntos(json, grupo, fechas, nro_partidos, dict_puntajes_grupo){

    // 3 fechas por grupo.
    for (k = 0 ; k < 3 ; k++) {

      $.each(json[grupo][fechas[k]]["partidos"], function(i, f) {

        goles_eq_1 = document.getElementById(f.equipo_1+nro_partidos[k]).value;
        goles_eq_2 = document.getElementById(f.equipo_2+nro_partidos[k]).value;

        actualizar_tabla(goles_eq_1, goles_eq_2, f.equipo_1, dict_puntajes_grupo);
        actualizar_tabla(goles_eq_2, goles_eq_1, f.equipo_2, dict_puntajes_grupo);

      });
    }
}

//puntajes por cada equipo
function crear_puntaje_equipo(nombre_equipo) {
  return {nombre:nombre_equipo,
          puntos:0,
          goles_a_favor:0,
          goles_en_contra:0,
          dif_gol:0
        };
}

//funcion que dispara el boton 8vos
function clasificacion_equipos() {

  //deshabilitar boton 8vos
  document.getElementById("btn-octavos").disabled = true;

  //Se carga el archivo
  json = JSON.parse(localStorage['json']);

  //fechas
  var fechas = ["fecha1","fecha2","fecha3"];

  //tabla, datos cada equipo en el torneo
  dict_puntajes_grupoA = {} ; //por definicion, como no se declaro es GLOBAL.
  dict_puntajes_grupoB = {} ;
  dict_puntajes_grupoC = {} ;
  dict_puntajes_grupoD = {} ;
  dict_puntajes_grupoE = {} ;
  dict_puntajes_grupoF = {} ;
  dict_puntajes_grupoG = {} ;
  dict_puntajes_grupoH = {} ;

  //Por cada equipo en el grupo se crea un objeto
  $.each(json["grupoA"]["equipos"], function(i, f) {

    var equipo = crear_puntaje_equipo(f.nombre);
    dict_puntajes_grupoA[f.nombre] = equipo;

  });

  $.each(json["grupoB"]["equipos"], function(i, f) {

    var equipo = crear_puntaje_equipo(f.nombre);
    dict_puntajes_grupoB[f.nombre] = equipo;

  });

  $.each(json["grupoC"]["equipos"], function(i, f) {

    var equipo = crear_puntaje_equipo(f.nombre);
    dict_puntajes_grupoC[f.nombre] = equipo;

  });

  $.each(json["grupoD"]["equipos"], function(i, f) {

    var equipo = crear_puntaje_equipo(f.nombre);
    dict_puntajes_grupoD[f.nombre] = equipo;

  });

  $.each(json["grupoE"]["equipos"], function(i, f) {

    var equipo = crear_puntaje_equipo(f.nombre);
    dict_puntajes_grupoE[f.nombre] = equipo;

  });

  $.each(json["grupoF"]["equipos"], function(i, f) {

    var equipo = crear_puntaje_equipo(f.nombre);
    dict_puntajes_grupoF[f.nombre] = equipo;

  });

  $.each(json["grupoG"]["equipos"], function(i, f) {

    var equipo = crear_puntaje_equipo(f.nombre);
    dict_puntajes_grupoG[f.nombre] = equipo;

  });

  $.each(json["grupoH"]["equipos"], function(i, f) {

    var equipo = crear_puntaje_equipo(f.nombre);
    dict_puntajes_grupoH[f.nombre] = equipo;

  });

  calcular_puntos(json, "grupoA", fechas, ["_#partido_1_ga","_#partido_2_ga","_#partido_3_ga"], dict_puntajes_grupoA);
  calcular_puntos(json, "grupoB", fechas, ["_#partido_1_gb","_#partido_2_gb","_#partido_3_gb"], dict_puntajes_grupoB);
  calcular_puntos(json, "grupoC", fechas, ["_#partido_1_gc","_#partido_2_gc","_#partido_3_gc"], dict_puntajes_grupoC);
  calcular_puntos(json, "grupoD", fechas, ["_#partido_1_gd","_#partido_2_gd","_#partido_3_gd"], dict_puntajes_grupoD);
  calcular_puntos(json, "grupoE", fechas, ["_#partido_1_ge","_#partido_2_ge","_#partido_3_ge"], dict_puntajes_grupoE);
  calcular_puntos(json, "grupoF", fechas, ["_#partido_1_gf","_#partido_2_gf","_#partido_3_gf"], dict_puntajes_grupoF);
  calcular_puntos(json, "grupoG", fechas, ["_#partido_1_gg","_#partido_2_gg","_#partido_3_gg"], dict_puntajes_grupoG);
  calcular_puntos(json, "grupoH", fechas, ["_#partido_1_gh","_#partido_2_gh","_#partido_3_gh"], dict_puntajes_grupoH);

  generar_octavos();

}

//se crean los input para cada partido del grupo
function recorrer_grupo(json, grupo, fechas, nro_partidos) {

  // 3 fechas por grupo.
  for (k = 0 ; k < 3 ; k++) {

    $.each(json[grupo][fechas[k]]["partidos"], function(i, f) {

      var nombreEquipo1 = "'../imagenes/"+f.equipo_1+".png'";
      var string1 = ""+nombreEquipo1+"";
      var nombreEquipo2 = "'../imagenes/"+f.equipo_2+".png'";
      var imgEquipo1 = "<img src="+string1+" width='38' height='30'/> ";
      var imgEquipo2 = "<img src="+nombreEquipo2+" width='38' height='30'/> <br>";
      var equipo_1 = "<label>" + f.equipo_1 + "</label>" ;
      var input_equipo_1 = "<input id='"+f.equipo_1+"_"+nro_partidos[k]+"' type='number' min='0' style='width:12%; text-align:center;'/>  "   ;
      var input_equipo_2 = "<input id='"+f.equipo_2+"_"+nro_partidos[k]+"' type='number' min='0' style='width:12%; text-align:center;'/>";
      var equipo_2 = "<label>" + f.equipo_2 + "</label> " ;
      var fecha = "<label>" + f.fecha + "</label>";
      var estadio = "<label>" + f.estadio + "</label>";
      var ciudad = "<label>" + f.ciudad + "</label> ";
      var hora = "<label>" + f.hora + "</label> <br>";
      var espacio = "<br>";

      $(imgEquipo1).appendTo(nro_partidos[k]);
      $(nro_partidos[k]).append(" ");
      $(equipo_1).appendTo(nro_partidos[k]);
      $(nro_partidos[k]).append(" ");
      $(input_equipo_1).appendTo(nro_partidos[k]);
      $(nro_partidos[k]).append(" ");
      $(input_equipo_2).appendTo(nro_partidos[k]);
      $(nro_partidos[k]).append(" ");
      $(equipo_2).appendTo(nro_partidos[k]);
      $(nro_partidos[k]).append(" ");
      $(imgEquipo2).appendTo(nro_partidos[k]);
      $(fecha).appendTo(nro_partidos[k]);
      $(nro_partidos[k]).append(" | ");
      $(estadio).appendTo(nro_partidos[k]);
      $(nro_partidos[k]).append(" | ");
      $(ciudad).appendTo(nro_partidos[k]);
      $(nro_partidos[k]).append(" | ");
      $(hora).appendTo(nro_partidos[k]);
      $(espacio).appendTo(nro_partidos[k]);

   });

 }

}

//Se almacena el json para trabajarlo luego en cada grupo
function datos(json) {

  // Se guarda el archivo para trabajarlo luego
  localStorage['json'] = JSON.stringify(json);

  //fechas
  var fechas = ["fecha1","fecha2","fecha3"];

  recorrer_grupo(json, "grupoA", fechas, ["#partido_1_ga","#partido_2_ga","#partido_3_ga"]);
  recorrer_grupo(json, "grupoB", fechas, ["#partido_1_gb","#partido_2_gb","#partido_3_gb"]);
  recorrer_grupo(json, "grupoC", fechas, ["#partido_1_gc","#partido_2_gc","#partido_3_gc"]);
  recorrer_grupo(json, "grupoD", fechas, ["#partido_1_gd","#partido_2_gd","#partido_3_gd"]);
  recorrer_grupo(json, "grupoE", fechas, ["#partido_1_ge","#partido_2_ge","#partido_3_ge"]);
  recorrer_grupo(json, "grupoF", fechas, ["#partido_1_gf","#partido_2_gf","#partido_3_gf"]);
  recorrer_grupo(json, "grupoG", fechas, ["#partido_1_gg","#partido_2_gg","#partido_3_gg"]);
  recorrer_grupo(json, "grupoH", fechas, ["#partido_1_gh","#partido_2_gh","#partido_3_gh"]);

}

//fase de grupos
function init() {

    //Variables globales llaves
    list_partidos_llave_8vos = [];
    dict_partidos_llave_4vos = {};

    list_partidos_llave_4tos = [];
    dict_partidos_llave_semis = {};

    list_partidos_llave_semis = [];
    dict_partidos_llave_final = {};

    $.getJSON(
      "../server.php", // Server URL
      { fase: "grupos" }, // Dato que se envia al servidor
      datos
    );
}

// run AJAX query cuando carga la página.
window.onload=init;
