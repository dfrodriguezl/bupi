import React, { Fragment, useEffect, useState } from 'react';
import { servidorPost } from '../js/request.js'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Help from './help.js';
import { getPermisos } from '../variables/permisos.js';

const asignaciones = {
  tecnico: 2,
  juridico: 3,
  sup_tec: 5,
  sup_jur: 4,
  sig: 6,
  doc: 8
}

const tareas_iniciales = {
  tecnico: { ruta: 1, tarea_next: 2 },
  juridico: { ruta: 2, tarea_next: 3 }
}

const CrearPredioMasivo = () => {

  const [expediente, setExpediente] = useState();
  const [exps, setExps] = React.useState([]);
  const [permiso, setPermiso] = React.useState(false);

  useEffect(() => {
    getUltimoExpediente();
    getPermisos().then((response) => {
      console.log("PERMISOS", response.data)
      setPermiso(response.some(r => [1,2].includes(r)))
    })
  }, [])

  const getUltimoExpediente = () => {
    var datos = { "id_consulta": "get_ultimo_expediente", }
    servidorPost('/backend', datos).then((response) => {
      const data = response.data;
      setExpediente(data[0].expediente);
    });
  }

  const onChange = (e) => {

    const yourFile = e.target.files[0]
    const formData = new FormData();
    formData.append('file', yourFile);

    servidorPost('/xls', formData).then((response) => {
      const data = response.data;
      console.log(data.json[0])
      if (typeof data.json[0].codigo_bupi != "undefined") {
        setExps(data.json)
      } else {
        alert("Seleccione un documento csv válido")
        setExps([])
      }

    });

  }

  const crearAsignaciones = (codigo_bupi, us_tecnico, us_juridico, us_sup_tec, us_sup_jur) => {
    Object.keys(asignaciones).forEach((asignacion) => {

      const usuarioResponsable = asignacion === "tecnico" ? us_tecnico : asignacion === "juridico" ?
        us_juridico : asignacion === "sup_tec" ?
          us_sup_tec : asignacion === "sup_jur" ?
            us_sup_jur : null;

      const datosAsignacion = {
        "id_consulta": "insertar_asignacion_tecnico",
        codigo_bupi: codigo_bupi,
        id_tarea: asignaciones[asignacion],
        usuario_responsable: usuarioResponsable
      };

      servidorPost('/backend', datosAsignacion).then((responseAsignacion) => {
        if (responseAsignacion.data) {
          insertarTareas(codigo_bupi);
        }
      });
    })

  }

  const insertarTareas = (codigo_bupi) => {
    Object.entries(tareas_iniciales).forEach((tarea) => {
      const datosTarea = {
        codigo_bupi: codigo_bupi,
        ruta_destino: tarea[1].ruta,
        tarea_next: tarea[1].tarea_next,
        id_consulta: "insertar_notificacion"
      }
      servidorPost('/backend', datosTarea).then((responseTareas) => {

      });
    })
  }


  const insertCalidadJuridica = (codigo_bupi) => {
    const datosCalJur = {
      codigo_bupi: codigo_bupi,
      id_consulta: "insert_expediente_4"
    }
    servidorPost('/backend', datosCalJur).then((responseTareas) => {

    });
  }


  const crearExpedientes = () => {
    exps.forEach((exp) => {
      crearExpediente(parseFloat(expediente) + parseFloat(exp.codigo_bupi), exp.tec, exp.jur, exp.sup_tec, exp.sup_jur)
      console.log("EXP", exp)
    })
  };

  const crearExpediente = (codigo_bupi, us_tecnico, us_juridico, us_sup_tec, us_sup_jur) => {
    var datos = { "id_consulta": "insert_expediente_2", codigo_bupi: codigo_bupi }
    servidorPost('/backend', datos).then((response) => {
      var datos2 = { "id_consulta": "insert_expediente_1", codigo_bupi: codigo_bupi }
      servidorPost('/backend', datos2).then((responseSan) => {
        if (responseSan.data) {
          crearAsignaciones(codigo_bupi, us_tecnico, us_juridico, us_sup_tec, us_sup_jur);
          insertCalidadJuridica(codigo_bupi);
          toast.success("Expediente " + codigo_bupi + " creado y asignado exitosamente")
        }
      });
    });
  }

  return (
    <div id="seccion">
      <div id="titulo_seccion">Creación masiva de predios</div>
      <p id="descripcion_seccion">En la siguiente sección, por favor seleccione el archivo csv con la estructura definida para hacer la creación y asignación masiva de predios</p>
      {permiso ?
        <Fragment>
          <Help titulo="Modelo" doc='guia_crear_masivo.csv' />
          <br />
          <div >
            <label htmlFor="file1" className="label-input" >Seleccionar csv
              <input type="file" id="file1" onChange={onChange} className="input" />
            </label>
          </div>
          <button type="button" className="primmary" onClick={() => crearExpedientes()}>Crear predios</button>
          <p>Se crearan: {Object.keys(exps).length} Registros</p>
          <ToastContainer />
        </Fragment>
        : <p className="no-permiso">No cuentas con permisos para usar esta herramienta</p>}



    </div>
  )
}

export default CrearPredioMasivo;