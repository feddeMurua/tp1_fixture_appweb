function armar_llaves(json, ganadores_grupo_1, ganadores_grupo_2, llave) {

        $.each(json["partidos"][llave], function(i, f) {

          var equipo_1 = "<label>" + f.equipo_1.replace(f.equipo_1, ganadores_grupo_1.nombre) + "</label>" ;
          var input_equipo_1 = "<input id='"+f.equipo_1+"_"+f.fecha+"' type='number' min='0' style='width:12%; text-align:center;'/>  "   ;
          var input_equipo_2 = "<input id='"+f.equipo_2+"_"+f.fecha+"' type='number' min='0' style='width:12%; text-align:center;'/>";
          var equipo_2 = "<label>" + f.equipo_2.replace(f.equipo_2, ganadores_grupo_2.nombre) + "</label> <br>" ;
          var fecha = "<label>" + f.fecha + "</label>";
          var estadio = "<label>" + f.estadio + "</label>";
          var ciudad = "<label>" + f.ciudad + "</label> ";
          var hora = "<label>" + f.hora + "</label> <br>";

          $(equipo_1).appendTo(llave);
          $(llave).append(" ");
          $(input_equipo_1).appendTo(llave);
          $(llave).append(" ");
          $(input_equipo_2).appendTo(llave);
          $(llave).append(" ");
          $(equipo_2).appendTo(llave);
          $(llave).append(" ");
          $(fecha).appendTo(llave);
          $(llave).append(" | ");
          $(estadio).appendTo(llave);
          $(llave).append(" | ");
          $(ciudad).appendTo(llave);
          $(llave).append(" | ");
          $(hora).appendTo(llave);

       });

      }

      function octavos(json_8vos){

        /*
        CRUCES

        30/6, 15 hs. 1°A vs. 2°B, Estadio Fisht (Sochi) (octavos 1)
        30/6, 11 hs. 1° C vs. 2° D, Kazán Arena (Kazán) (octavos 2)
        1/7, 11 hs. 1° B vs. 2° A, Estadio Olímpico Luzhnikí (Moscú) (octavos 3)
        1/7, 15 hs. 1° D vs. 2° C, Estadio de Nizhni Nóvgorod (Nizhni Nóvgorod) (octavos 4)
        2/7, 11 hs. 1° E vs. 2° F, Samara Arena (Samara) (octavos 5)
        2/7, 15 hs. 1°G vs. 2° H, Rostov Arena (Rostov del Don) (octavos 6)
        3/7, 11 hs. 1° F vs. 2° E, Zenit Arena (San Petersburgo) (octavos 7)
        3/7, 15 hs. 1° H vs. 2° G, Otkrytie Arena (Moscú) (octavos 8)

        */

        //funcion lodash para trabajar los diccionarios
        var ganadores_ga = _.slice((_.sortBy(dict_puntajes_grupoA, ['puntos','goles_a_favor','goles_en_contra','dif_gol'])),2); // slice toma las ultimas dos posiciones, pos 0:segundo
        var ganadores_gb = _.slice((_.sortBy(dict_puntajes_grupoB, ['puntos','goles_a_favor','goles_en_contra','dif_gol'])),2);
        armar_llaves(json_8vos, ganadores_ga[1], ganadores_gb[0], "#octavos_1");
        armar_llaves(json_8vos, ganadores_gb[1], ganadores_ga[0], "#octavos_3");

      }

      function generar_octavos(){
        $.getJSON(
          "../server.php", // Server URL
          { fase: "octavos" }, // Dato que se envia al servidor
          octavos
        );
      }

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
          $.getJSON(
            "../server.php", // Server URL
            { fase: "grupos" }, // Dato que se envia al servidor
            datos
          );
      }

      // run AJAX query cuando carga la página.
      window.onload=init;