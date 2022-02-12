import { servidorPost } from '../js/request'


const back = async (data) => {
  const result = await servidorPost('/backend/', data)

  return result;
}


export const notificacion_saneamientos = (data, tipo, consecutivo) => {

  const ruta = data.ruta;
  data.opcion = 1;

  // console.log("DATA NOT", data)


  if (ruta === 0) {

    //alert(ruta);
    var info = {
      id_consulta: "insertar_asignacion_tecnico",
      id_expediente: data.id_expediente,
      id_tarea: 3,
      usuario_responsable: data.usuario_responsable
    };
    var info1 = {
      id_consulta: "insertar_asignacion_tecnico",
      id_expediente: data.id_expediente,
      id_tarea: 4,
      usuario_responsable: data.usuario_responsable
    };
    var info2 = {
      id_consulta: "insertar_asignacion_tecnico",
      id_expediente: data.id_expediente,
      id_tarea: 5,
      usuario_responsable: data.usuario_responsable
    };
    var info3 = {
      id_consulta: "insertar_asignacion_tecnico",
      id_expediente: data.id_expediente,
      id_tarea: 2,
      usuario_responsable: data.usuario_responsable
    };

    (async () => {
      await back(info);
      await back(info1);
      await back(info2);
      await back(info3);


      var not1 = {
        id_consulta: "insertar_notificacion",
        tarea_next: 2,
        ruta_destino: 1,
        id_expediente: data.id_expediente
      };

      var not2 = {
        id_consulta: "insertar_notificacion",
        tarea_next: 3,
        ruta_destino: 2,
        id_expediente: data.id_expediente
      };


      (async () => {
        await back(not2)

        await back(not1)

      })()



    })()



  }
  else if (ruta === 1 || ruta == 7) {//el tecnico se desprende de su tarea

    //alert();

    (async () => {

      var post2 = {
        id_consulta: "insertar_notificacion_saneamiento",
        tarea_next: 5,
        ruta_destino: 3,
        opcion: 1,
        id_expediente: data.id_expediente,
        consecutivo: consecutivo,
        tabla: tipo
      }


      await back(post2)


    })()

  }
  else if (ruta === 2 || ruta == 5) {//el juridico se desprende de su tarea

    data.id_consulta = "insertar_notificacion_saneamiento";
    data.tarea_next = 4;
    data.ruta_destino = 4;
    data.consecutivo = consecutivo;
    data.tabla = tipo;

    (async () => {
      await back(data)

    })()

  }

  else if (ruta === 4) {//el sup. juridico se desprende de su tarea

    data.id_consulta = "aprobado_juridico_saneamiento";
    data.consecutivo = consecutivo;

    (async () => {
      var result = await back(data);

      console.log(result);

      if (!result.data[0].aprobado) {//se encuentra aprobado el estudio juridico

        //alert("NO aprobado");

        data.id_consulta = "insertar_notificacion_saneamiento"
        data.tarea_next = 3;
        data.ruta_destino = 5;
        data.consecutivo = consecutivo;
        data.tabla = tipo;

        await back(data)



      } else {

        //ESTUDIO APROBADO, NO PASA NADA
        data.id_consulta = "insertar_notificacion_saneamiento"
        data.tarea_next = 3;
        data.ruta_destino = 9;
        data.consecutivo = consecutivo;
        data.tabla = tipo;

        await back(data)

      }

    })()

  }

  else if (ruta == 3) {// tarea a cargo del sup tecnico



    // if (data.id_expediente.includes("S_")) {
    //   data.id_consulta = "aprobado_tecnico_servidumbre";
    // } else {
    //   data.id_consulta = "aprobado_tecnico";
    // }
    data.id_consulta = "aprobado_tecnico_saneamiento";
    data.consecutivo = consecutivo;

    (async () => {
      var result = await back(data);

      if (!result.data[0].aprobado) {// NO se encuentra aprobado el estudio tecnico

        //alert("NO aprobado");

        (async () => {

          //alert()

          var post2 = {
            id_consulta: "insertar_notificacion_saneamiento",
            tarea_next: 2,
            ruta_destino: 7,
            opcion: 1,
            id_expediente: data.id_expediente,
            consecutivo: consecutivo,
            tabla: tipo
          }
          await back(post2)



        })()



      } else {

        //alert("se acabo todo el flujo de momento...");

        data.id_consulta = "insertar_notificacion_saneamiento"
        data.tarea_next = 2;
        data.ruta_destino = 8;
        data.consecutivo = consecutivo;
        data.tabla = tipo;

        await back(data)

      }

    })()

  } else if (ruta === 8 || ruta === 12) {
    (async () => {

      var post2 = {
        id_consulta: "insertar_notificacion_saneamiento",
        tarea_next: 5,
        ruta_destino: 10,
        opcion: 1,
        id_expediente: data.id_expediente,
        consecutivo: consecutivo,
        tabla: tipo
      }


      await back(post2)


    })()

  } else if (ruta === 10) {
    data.id_consulta = "aprobado_tecnico_saneamiento_final";
    data.consecutivo = consecutivo;

    (async () => {
      var result = await back(data);

      if (!result.data[0].aprobado) {// NO se encuentra aprobado el estudio tecnico

        //alert("NO aprobado");

        (async () => {

          //alert()

          var post2 = {
            id_consulta: "insertar_notificacion_saneamiento",
            tarea_next: 2,
            ruta_destino: 12,
            opcion: 1,
            id_expediente: data.id_expediente,
            consecutivo: consecutivo,
            tabla: tipo
          }
          await back(post2)



        })()



      } else {

        //alert("se acabo todo el flujo de momento...");

        // data.id_consulta = "insertar_notificacion_saneamiento"
        // data.tarea_next = 2;
        // data.ruta_destino = 8;
        // data.consecutivo = consecutivo;
        // data.tabla = tipo;

        // await back(data)

      }

    })()
  } else if (ruta === 9 || ruta === 13) { // Tarea en usuario SIG

    (async () => {

      var post2 = {
        id_consulta: "insertar_notificacion_saneamiento",
        tarea_next: 4,
        ruta_destino: 11,
        opcion: 1,
        id_expediente: data.id_expediente,
        consecutivo: consecutivo,
        tabla: tipo
      }


      await back(post2)


    })()



  } else if (ruta === 11) {
    data.id_consulta = "aprobado_juridico_saneamiento_final";
    data.consecutivo = consecutivo;

    (async () => {
      var result = await back(data);

      if (!result.data[0].aprobado) {// NO se encuentra aprobado el estudio tecnico

        //alert("NO aprobado");

        (async () => {

          //alert()

          var post2 = {
            id_consulta: "insertar_notificacion_saneamiento",
            tarea_next: 3,
            ruta_destino: 13,
            opcion: 1,
            id_expediente: data.id_expediente,
            consecutivo: consecutivo,
            tabla: tipo
          }
          await back(post2)



        })()



      } else {

        //alert("se acabo todo el flujo de momento...");

        // data.id_consulta = "insertar_notificacion_saneamiento"
        // data.tarea_next = 2;
        // data.ruta_destino = 8;
        // data.consecutivo = consecutivo;
        // data.tabla = tipo;

        // await back(data)

      }

    })()
  } else if (ruta === -1) {//esta es la forma de quitarme una tarea actualizando su estado

    data.id_consulta = "update_tareas_estado_saneamientos";

    (async () => {
      await back(data)

    })()

  } else if (ruta === -2) { // Tarea para asignar a supervisor documental

    let post = {
      id_consulta: "insertar_notificacion_documental",
      tarea_next: 8,
      ruta_destino: 13,
      opcion: 1,
      id_expediente: data.id_expediente,
      usuario: data.usuario_prestamo
    };


    (async () => {
      await back(post)

    })()

  } else if (ruta === -3) {

    let post = {
      id_consulta: "update_tareas_estado_documental",
      id_expediente: data.id_expediente,
      usuario_prestamo: data.usuario_prestamo
    };


    (async () => {
      await back(post)

    })()
  }


}
