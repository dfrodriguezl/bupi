import React from 'react';
import ReactDOM from 'react-dom';

//notificaciones
import { servidorPost } from '../js/request.js'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import { getPermisos } from '../variables/permisos'
import { notificacion } from '../variables/notificaciones'

import Help from './help'

const estadosTecnico = {
  asignado: {
    ruta: 1,
    rutas_next: [3, 7, 9]
  },
  "en gestion": {
    ruta: 1,
    rutas_next: [3, 7, 9]
  },
  "en revision": {
    ruta: 3,
    rutas_next: [7, 9],
    rutas_before: [1]
  },
  devuelto: {
    ruta: 7,
    rutas_next: [9],
    rutas_before: [1, 3]
  },
  aprobado: {

  }
}

const estadosJuridico = {
  asignado: {
    ruta: 2,
    rutas_next: [4, 5]
  },
  "en gestion": {
    ruta: 2,
    rutas_next: [4, 5]
  },
  "en revision": {
    ruta: 4,
    rutas_next: [5],
    rutas_before: [2]
  },
  devuelto: {
    ruta: 5,
    rutas_before: [2, 4]
  },
  aprobado: {
    rutas_next: [14, 15, 16]
  }
}



const Aprobacion = () => {

  const [doc, setdoc] = React.useState([]);
  const [user, setUser] = React.useState([]);
  const [juridico, setJuridico] = React.useState([]);

  const [responsable, setResponsable] = React.useState();

  const [permiso, setpermiso] = React.useState(false);



  React.useEffect(() => {
    var datos = { "id_consulta": "get_usuarios_rol_tecnico", }
    servidorPost('/backend', datos).then((response) => {
      const data = response.data;
      setUser(data)
    });

    var datos = { "id_consulta": "get_usuarios_rol_juridico", }
    servidorPost('/backend', datos).then((response) => {
      const data = response.data;
      setJuridico(data)
    });


    getPermisos().then((response) => {
      setpermiso(response.some(r => [1, 2].includes(r)))
    })


  }, []);

  const onChange = (e) => {

    const yourFile = e.target.files[0]
    const formData = new FormData();
    formData.append('file', yourFile);

    servidorPost('/xls', formData).then((response) => {
      const data = response.data;
      console.log(data.json[0])
      if (typeof data.json[0].codigo_bupi != "undefined") {
        setdoc(data.json)
      } else {
        alert("Seleccione un documento csv válido")
        setdoc([])
      }

    });

  }
  const asignar = e => {

    var usuario_asigna = 'dangarita';
    var usuario_responsable = responsable;

    if (usuario_responsable != null) {


      envio();

      async function envio() {


        for (var i = 0; i < doc.length; i++) {

          var datos = {
            "codigo_bupi": doc[i].codigo_bupi,
            "ruta": 0,
            "usuario_responsable": usuario_responsable
          }

          notificacion(datos)




        }

        toast.success("Expedientes asignados correctamente");

        setdoc([])

      }



    } else {
      toast.error("Seleccione un usuario ");
    }

  }

  const sendRequest = (data) => {
    return servidorPost('/backend', data);
  }

  const aprobar = (e) => {

    // var usuario_asigna='dangarita';
    // var usuario_responsable=responsable;

    // if (usuario_responsable != null) {

    // console.log(doc);
    // console.log(doc.length);

    for (var i = 0; i < doc.length; i++) {
      let tec = doc[i].tec
      let jur = doc[i].jur
      let expediente = doc[i].codigo_bupi

      // console.log(tec)
      if (tec !== '') {
        let datosTec = {
          codigo_bupi: expediente
        }
        let rutas = estadosTecnico[tec.toLowerCase()];
        // console.log(rutas);

        if (tec.toLowerCase() != "aprobado") {
          let datosClose = {
            codigo_bupi: expediente,
            id_consulta: 'insert_calidad_tecnico',
            aprobado: null,
            obs: 'CAMBIO DE ESTADO'
          }

          sendRequest(datosClose).then((res) => {
            // console.log(datosClose)
          })
        } else if (tec.toLowerCase() == "aprobado") {
          let datosTec = {
            codigo_bupi: expediente,
            id_consulta: "update_tareas_calidad_tecnico"
          }
          // datos.id_consulta = "update_tareas_calidad_tecnico"
          // console.log(datosTec)
          sendRequest(datosTec).then((response) => {
            // console.log(response)
            if (response.data.length > 0) {
              let datosClose = {
                codigo_bupi: expediente,
                id_consulta: 'insert_calidad_tecnico',
                aprobado: 1,
                obs: 'APROBACIÓN MASIVA'
              }

              sendRequest(datosClose).then((res) => {
                toast.success("Registro predial " + expediente + " aprobado ");
                var datos={
                  ruta: 3,
                  codigo_bupi: expediente
                }
              
                notificacion(datos)
              })
            }

          })

          // let datosAprob = {
          //   codigo_bupi: expediente,
          //   id_consulta: "aprobar_tecnico",
          //   aprobado: 1
          // }

          // sendRequest(datosAprob).then((response) => {
          //   // console.log(response)
          // })
        }
        // console.log(rutas)
        if (rutas.rutas_next) {
          let datosDel = {
            id_consulta: 'borrar_tarea',
            ruta_close: rutas.rutas_next,
            codigo_bupi: expediente
          }

          sendRequest(datosDel).then((response) => {
            datosTec.id_consulta = 'abrir_tarea';
            datosTec.ruta_close = [rutas.ruta];
            sendRequest(datosTec).then((response2) => {
              console.log(response2)
            })
          })
        }

        if (rutas.rutas_before) {
          datosTec.id_consulta = 'cerrar_tarea';
          datosTec.ruta_close = rutas.rutas_before;
          // console.log(datosTec)
          sendRequest(datosTec).then((response) => {
            console.log(response)
          })
        }

      }

      // if(jur !== ''){
      //   let datosJur = {
      //     codigo_bupi: expediente
      //   }
      //   let rutas = estadosJuridico[jur.toLowerCase()];

      //   if(jur.toLowerCase() != "aprobado"){
      //     let datosClose = {
      //               codigo_bupi: expediente,
      //               id_consulta: 'insert_calidad_juridico',
      //               aprobado: null,
      //               obs: 'CAMBIO DE ESTADO'
      //             }

      //       sendRequest(datosClose).then((res) => {
      //         console.log(datosClose)
      //       })
      //   }else if(jur.toLowerCase() == "aprobado"){
      //     let datosJur = {
      //           codigo_bupi: expediente,
      //           id_consulta: "update_tareas_calidad_juridico"
      //         }
      //         // datos.id_consulta = "update_tareas_calidad_tecnico"
      //         console.log(datosJur)
      //         sendRequest(datosJur).then((response) => {
      //           console.log(response)
      //           if(response.data.length > 0){
      //             let datosClose = {
      //               codigo_bupi: expediente,
      //               id_consulta: 'insert_calidad_juridico',
      //               aprobado: 1,
      //               obs: 'APROBACIÓN MASIVA'
      //             }

      //             sendRequest(datosClose).then((res) => {
      //               toast.success("Registro predial " + expediente + " aprobado jurídico");
      //             })
      //           }

      //         })
      //   }
      //   // console.log(rutas)
      //   if(rutas.rutas_next){
      //     let datosDel = {
      //       id_consulta: 'borrar_tarea',
      //       ruta_close: rutas.rutas_next,
      //       codigo_bupi: expediente
      //     }
      //     sendRequest(datosDel).then((response) => {
      //       // console.log(response)
      //       datosJur.id_consulta = 'abrir_tarea';
      //       datosJur.ruta_close = [rutas.ruta];
      //       // console.log(datosJur)
      //       sendRequest(datosJur).then((response2) => { 
      //         console.log(response2)
      //       })
      //     })
      //   }

      //   if(rutas.rutas_before){
      //     datosJur.id_consulta = 'cerrar_tarea';
      //     datosJur.ruta_close = rutas.rutas_before;
      //     sendRequest(datosJur).then((response) => {
      //       console.log(response)
      //     })
      //   }

      // }



      // let datos = {}
      // datos.codigo_bupi = expediente


      // if(tec === "SI"){ 
      //   let datosTec = {
      //     codigo_bupi: expediente,
      //     id_consulta: "update_tareas_calidad_tecnico"
      //   }
      //   // datos.id_consulta = "update_tareas_calidad_tecnico"
      //   console.log(datosTec)
      //   sendRequest(datosTec).then((response) => {
      //     console.log(response)
      //     if(response.data.length > 0){
      //       let datosClose = {
      //         codigo_bupi: expediente,
      //         id_consulta: 'insert_calidad_tecnico',
      //         aprobado: 1,
      //         obs: 'APROBACIÓN MASIVA'
      //       }

      //       sendRequest(datosClose).then((res) => {
      //         toast.success("Expediente " + expediente + " aprobado técnico");
      //       })
      //     }

      //   })
      // }

      // if(jur === "SI"){
      //   let datosJur = {
      //     codigo_bupi: expediente,
      //     id_consulta: "update_tareas_calidad_juridico"
      //   }
      //   // datos.id_consulta = "update_tareas_calidad_juridico"
      //   console.log(datosJur)
      //   sendRequest(datosJur).then((response) => {
      //     console.log(response)
      //     if(response.data.length > 0){
      //       let datosClose = {
      //         codigo_bupi: expediente,
      //         id_consulta: 'insert_calidad_juridico',
      //         aprobado: 1,
      //         obs: 'APROBACIÓN MASIVA'
      //       }
      //       sendRequest(datosClose).then((res) => {
      //         toast.success("Expediente " + expediente + " aprobado jurídico");
      //       })
      //     }

      //   })

      // }
    }


    toast.success("Cambio de estado a " + doc.length + " expediente(s)");


    //   envio();

    //   async function envio() {


    //     for (var i = 0; i < doc.length; i++){

    //       var datos={
    //         "codigo_bupi":doc[i].codigo_bupi,
    //         "ruta": 0,
    //         "usuario_responsable":usuario_responsable
    //       }

    //       notificacion(datos)




    //     }

    //     toast.success("Expedientes asignados correctamente");

    //     setdoc([])

    //   }



    //   }else{
    //     toast.error("Seleccione un usuario ");
    //   }

  }

  const select = e => {
    const resp = e.target.value;
    setResponsable(resp)
  }

  return (
    <div id="seccion">
      <div id="titulo_seccion">Cambio de estados</div>
      <p id="descripcion_seccion">En la siguiente sección, por favor seleccione el archivo csv con los registros para cambiar el estado según la guia.</p>


      {permiso ? <>

        <Help titulo="Modelo" doc='guia_aprobacion_masiva.csv' />

        <br />
        <div>
          {/* <select  onChange={select}>
      <option value="">Seleccione...</option>     
      {user.map((el,key) => (

          <option value={el.usuario_usuario} key={key}>{el.usuario_nombre} </option>

      ))}
        
      </select> */}
        </div>
        <div>

        </div>
        <div >
          <label htmlFor="file1" className="label-input" >Seleccionar csv
            <input type="file" id="file1" onChange={onChange} className="input" />
          </label>
        </div>

        <button type="button" className="primmary" onClick={aprobar}>Cambiar de estado</button>

        <ToastContainer />

        <p>Se modificaran: {Object.keys(doc).length} Registros</p>

        {doc.map((item, key) =>
          <div className="col-12 mb-1" key={key}>
            <p> 📁{item.codigo_bupi}</p>
          </div>

        )
        }

      </>
        : <p className="no-permiso">No cuentas con permisos para usar esta herramienta</p>}

    </div>
  )
}


export default Aprobacion;





