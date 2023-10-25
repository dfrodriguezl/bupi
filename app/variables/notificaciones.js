import { servidorPost } from '../js/request'


const back = async (data) => {
    const result = await servidorPost('/backend/', data)

    return result;
}


export const notificacion = (data) => {

    const ruta = data.ruta;
    data.opcion = 1;

    // console.log("DATA NOT", data)


    if (ruta === 0) {

        //alert(ruta);
        var info = {
            id_consulta: "insertar_asignacion_tecnico",
            codigo_bupi: data.codigo_bupi,
            id_tarea: 3,
            usuario_responsable: data.usuario_responsable
        };
        var info1 = {
            id_consulta: "insertar_asignacion_tecnico",
            codigo_bupi: data.codigo_bupi,
            id_tarea: 4,
            usuario_responsable: data.usuario_responsable
        };
        var info2 = {
            id_consulta: "insertar_asignacion_tecnico",
            codigo_bupi: data.codigo_bupi,
            id_tarea: 5,
            usuario_responsable: data.usuario_responsable
        };
        var info3 = {
            id_consulta: "insertar_asignacion_tecnico",
            codigo_bupi: data.codigo_bupi,
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
                codigo_bupi: data.codigo_bupi
            };

            var not2 = {
                id_consulta: "insertar_notificacion",
                tarea_next: 3,
                ruta_destino: 2,
                codigo_bupi: data.codigo_bupi
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
                id_consulta: "insertar_notificacion",
                tarea_next: 5,
                ruta_destino: 3,
                opcion: 1,
                codigo_bupi: data.codigo_bupi
            }

            await back(post2)

        })()

    }
    else if (ruta === 2 || ruta == 5) {//el juridico se desprende de su tarea

        data.id_consulta = "insertar_notificacion";
        data.tarea_next = 4;
        data.ruta_destino = 4;

        (async () => {
            await back(data)

        })()

    }

    else if (ruta === 4) {//el sup. juridico se desprende de su tarea

        data.id_consulta = "aprobado_juridico";

        (async () => {
            var result = await back(data);

            console.log(result);

            if (!result.data[0].aprobado) {//se encuentra aprobado el estudio juridico

                //alert("NO aprobado");

                data.id_consulta = "insertar_notificacion"
                data.tarea_next = 3;
                data.ruta_destino = 5;

                await back(data)



            } else {

                //ESTUDIO APROBADO, NO PASA NADA

            }

        })()

    }

    else if (ruta == 3 || ruta === 11) {// tarea a cargo del sup tecnico



        if (data.codigo_bupi.includes("S_")) {
            data.id_consulta = "aprobado_tecnico_servidumbre";
        } else {
            data.id_consulta = "aprobado_tecnico";
        }

        (async () => {
            var result = await back(data);

            if (!result.data[0].aprobado) {// NO se encuentra aprobado el estudio tecnico

                //alert("NO aprobado");

                (async () => {

                    //alert()

                    var post2 = {
                        id_consulta: "insertar_notificacion",
                        tarea_next: 2,
                        ruta_destino: 7,
                        opcion: 1,
                        codigo_bupi: data.codigo_bupi
                    }
                    await back(post2)



                })()



            } else {

                //alert("se acabo todo el flujo de momento...");

                data.id_consulta = "insertar_notificacion"
                data.tarea_next = 10;
                data.ruta_destino = 14;

                await back(data)

                data.id_consulta = "insertar_notificacion"
                data.tarea_next = 11;
                data.ruta_destino = 15;

                await back(data)

                data.id_consulta = "insertar_notificacion"
                data.tarea_next = 8;
                data.ruta_destino = 16;

                await back(data)

            }

        })()


    } else if (ruta === 14) {

        data.id_consulta = "info44_asignacion_saneamiento";

        (async () => {
            var result = await back(data);
            
            if((result.data[0].usuario !== null && result.data[0].usuario_catastral !== null) || 
                (data.usuario_jur !== null && data.usuario_cat !== null)){
                
                // console.log("USUARIO", info);
                (async () => {
                    var info = {
                        id_consulta: "insertar_asignacion_tecnico",
                        codigo_bupi: data.codigo_bupi,
                        id_tarea: 13,
                        usuario_responsable: result.data[0].usuario || data.usuario_jur
                    };
                    await back(info);
                    var post2 = {
                        id_consulta: "insertar_notificacion",
                        tarea_next: 13,
                        ruta_destino: 17,
                        opcion: 1,
                        codigo_bupi: data.codigo_bupi
                    }
                    await back(post2)

                    var info2 = {
                        id_consulta: "insertar_asignacion_tecnico",
                        codigo_bupi: data.codigo_bupi,
                        id_tarea: 14,
                        usuario_responsable: result.data[0].usuario_catastral || data.usuario_cat
                    };
                    await back(info2);
                    var post3 = {
                        id_consulta: "insertar_notificacion",
                        tarea_next: 14,
                        ruta_destino: 18,
                        opcion: 1,
                        codigo_bupi: data.codigo_bupi
                    }
                    await back(post3)
                })();
            }

            //alert()

            



        })()

    } else if (ruta === 9) { // Tarea en usuario SIG

        if (data.codigo_bupi.includes("S_")) {
            data.id_consulta = "info20_sig_servidumbre";
            data.id_servidumbre = data.codigo_bupi;
        } else {
            data.id_consulta = "info23_sig";
        }

        (async () => {
            var result = await back(data);

            if (!result.data[0].devolucion_pol || result.data[0].devolucion_pol === 1) { // Devolucion de geometria
                (async () => {

                    //alert()

                    var post2 = {
                        id_consulta: "insertar_notificacion",
                        tarea_next: 5,
                        ruta_destino: 11,
                        opcion: 1,
                        codigo_bupi: data.codigo_bupi
                    }
                    await back(post2)
                })()
            } else { //Termina el flujo cuando se aprueba por SIG
                data.id_consulta = "insertar_notificacion"
                data.tarea_next = 7;
                data.ruta_destino = 10;
                await back(data)
            }

        })()

    } else if (ruta === 12) {
        data.id_consulta = "info24_social";

        (async () => {
            var result = await back(data);

            if (result.data[0].informacion_social != null) { // Devolucion de geometria
                (async () => {

                    //alert()

                    var post2 = {
                        id_consulta: "insertar_notificacion",
                        tarea_next: 5,
                        ruta_destino: 11,
                        opcion: 1,
                        codigo_bupi: data.codigo_bupi
                    }
                    await back(post2)
                })()
            }

        })()

    } else if (ruta === 13) {
        data.id_consulta = "info37_prestamo_expedientes";

        (async () => {
            var result = await back(data);

            if (result.data[0].fecha_dev_usu_prestamo != null) { // Devolucion de geometria
                (async () => {

                    //alert()

                    var post2 = {
                        id_consulta: "insertar_notificacion",
                        tarea_next: 5,
                        ruta_destino: 11,
                        opcion: 1,
                        codigo_bupi: data.codigo_bupi
                    }
                    await back(post2)
                })()
            }

        })()
    } else if (ruta === 15) {
        data.id_consulta = "info43_contabilidad";

        (async () => {
            var result = await back(data);

            if (result.data[0].clasificacion_contable_mensual != '' && result.data[0].clasificacion_contable_mensual != null) { // Devolucion de geometria
                (async () => {

                    //alert()

                    var post2 = {
                        id_consulta: "insertar_notificacion",
                        tarea_next: 10,
                        ruta_destino: 19,
                        opcion: 1,
                        codigo_bupi: data.codigo_bupi
                    }
                    await back(post2)
                })()
            }

        })()
    } else if (ruta === -1) {//esta es la forma de quitarme una tarea actualizando su estado

        data.id_consulta = "update_tareas_estado";

        (async () => {
            await back(data)

        })()

    } else if (ruta === -2) { // Tarea para asignar a supervisor documental

        let post = {
            id_consulta: "insertar_notificacion_documental",
            tarea_next: 8,
            ruta_destino: 13,
            opcion: 1,
            codigo_bupi: data.codigo_bupi,
            usuario: data.usuario_prestamo
        };


        (async () => {
            await back(post)

        })()

    } else if (ruta === -3) {

        let post = {
            id_consulta: "update_tareas_estado_documental",
            codigo_bupi: data.codigo_bupi,
            usuario_prestamo: data.usuario_prestamo
        };


        (async () => {
            await back(post)

        })()
    }


}


