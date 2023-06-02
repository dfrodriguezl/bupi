import React, { useEffect, useState } from 'react';
import { servidorPost } from '../js/request.js'
import Popup from 'reactjs-popup'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import { Link, useHistory } from 'react-router-dom';

const asignaciones = {
  tecnico: 2,
  // juridico: 3,
  sup_tec: 5,
  // sup_jur: 4,
  // sig: 6,
  doc: 8,
  coord: 10,
  contabilidad: 11
}

const tareas_iniciales = {
  tecnico: { ruta: 1, tarea_next: 2 },
  // juridico: { ruta: 2, tarea_next: 3 }
}

const CrearPredio = () => {

  const [expediente, setExpediente] = useState();
  const [listTecnicos, setListTecnicos] = useState([]);
  const [listJuridicos, setListJuridicos] = useState([]);
  const [listSupTec, setListSupTec] = useState([]);
  const [listSupJur, setListSupJur] = useState([]);
  const [isLoadingTec, setIsLoadingTec] = useState(true);
  const [isLoadingJur, setIsLoadingJur] = useState(true);
  const [isLoadingSupTec, setIsLoadingSupTec] = useState(true);
  const [isLoadingSupJur, setIsLoadingSupJur] = useState(true);
  const [tecnico, setTecnico] = useState();
  const [juridico, setJuridico] = useState();
  const [supTec, setSupTec] = useState();
  const [supJur, setSupJur] = useState();
  const [usuarioSIG, setUsuarioSIG] = useState("jbartolo");
  const [usuarioDoc, setUsuarioDoc] = useState("documental");
  const [usuarioCoord, setUsuarioCoord] = useState("coordinador");
  const [usuarioContabilidad, setUsuarioContabilidad] = useState("contabilidad");
  const history = useHistory();

  useEffect(() => {
    getUltimoExpediente();
    const datosTec = { "id_consulta": "get_usuarios_rol_tecnico", }
    servidorPost('/backend', datosTec).then((responseTec) => {
      if (responseTec.data) {
        setListTecnicos(responseTec.data)
        setIsLoadingTec(false);
      }
    });
    const datosJur = { "id_consulta": "get_usuarios_rol_juridico", }
    servidorPost('/backend', datosJur).then((responseJur) => {
      if (responseJur.data) {
        setListJuridicos(responseJur.data)
        setIsLoadingJur(false);
      }
    });
    const datosSupTec = { "id_consulta": "get_usuarios_rol", usuario_rol: "6" }
    servidorPost('/backend', datosSupTec).then((responseSupTec) => {
      if (responseSupTec.data) {
        setListSupTec(responseSupTec.data)
        setIsLoadingSupTec(false);
      }
    });
    const datosSupJur = { "id_consulta": "get_usuarios_rol", usuario_rol: "5" }
    servidorPost('/backend', datosSupJur).then((responseSupJur) => {
      if (responseSupJur.data) {
        setListSupJur(responseSupJur.data)
        setIsLoadingSupJur(false);
      }
    });
  }, [])

  const getUltimoExpediente = () => {
    var datos = { "id_consulta": "get_ultimo_expediente", }
    servidorPost('/backend', datos).then((response) => {
      const data = response.data;
      setExpediente(data[0].expediente);
    });
  }

  const crearExpediente = () => {
    var datos = { "id_consulta": "insert_expediente_2", codigo_bupi: expediente }
    servidorPost('/backend', datos).then((response) => {
      var datos2 = { "id_consulta": "insert_expediente_1", codigo_bupi: expediente }
      servidorPost('/backend', datos2).then((responseSan) => {
        if (responseSan.data) {
          crearAsignaciones(expediente);
          insertCalidadJuridica();
          toast.success("Expediente " + expediente + " creado y asignado exitosamente")
        }
      });
    });
  }

  const onChangeSelectTecnico = (e) => {
    setTecnico(e.usuario_usuario)
  }

  const onChangeSelectJuridico = (e) => {
    setJuridico(e.usuario_usuario)
  }

  const onChangeSelectSupTec = (e) => {
    setSupTec(e.usuario_usuario)
  }

  const onChangeSelectSupJur = (e) => {
    setSupJur(e.usuario_usuario)
  }

  const crearAsignaciones = (codigo_bupi) => {
    Object.keys(asignaciones).forEach((asignacion) => {

      const usuarioResponsable = asignacion === "tecnico" ? tecnico : asignacion === "juridico" ?
        juridico : asignacion === "sup_tec" ?
          supTec : asignacion === "sup_jur" ?
            supJur : asignacion === "sig" ?
              usuarioSIG : asignacion === "coord" ?
                usuarioCoord : asignacion === "contabilidad" ?
                  usuarioContabilidad :
                  asignacion === "doc" ?
                    usuarioDoc : null;

      console.log(usuarioResponsable, "usuarioResponsable");

      const datosAsignacion = {
        "id_consulta": "insertar_asignacion_tecnico",
        codigo_bupi: codigo_bupi,
        id_tarea: asignaciones[asignacion],
        usuario_responsable: usuarioResponsable
      };

      servidorPost('/backend', datosAsignacion).then((responseAsignacion) => {
        if (responseAsignacion.data) {
          if (asignacion === "tecnico") {
            insertarTareas();
          }
        }
      });

    })

  }

  const insertarTareas = () => {
    Object.entries(tareas_iniciales).forEach((tarea) => {
      const datosTarea = {
        codigo_bupi: expediente,
        ruta_destino: tarea[1].ruta,
        tarea_next: tarea[1].tarea_next,
        id_consulta: "insertar_notificacion"
      }
      servidorPost('/backend', datosTarea).then((responseTareas) => {

      });
    })
  }


  const insertCalidadJuridica = () => {
    const datosCalJur = {
      codigo_bupi: expediente,
      id_consulta: "insert_expediente_4"
    }
    servidorPost('/backend', datosCalJur).then((responseTareas) => {
      const datosCalJur = {
        codigo_bupi: expediente,
        id_consulta: "insert_expediente_5"
      }
      servidorPost('/backend', datosCalJur).then((responseTareas) => {
        const datosCalJur = {
          codigo_bupi: expediente,
          id_consulta: "insert_expediente_6"
        }
        servidorPost('/backend', datosCalJur).then((responseTareas) => {
          const datosCalJur = {
            codigo_bupi: expediente,
            id_consulta: "insert_expediente_7"
          }
          servidorPost('/backend', datosCalJur).then((responseTareas) => {
            history.push("predio/" + expediente);
          })
        })
      })

    });
  }

  return (
    <div id="seccion">
      <div id="titulo_seccion">Crear nuevo predio</div>
      <p id="descripcion_seccion">En la siguiente sección, por favor de click en Crear Predio, confirme y haga la respectiva asignación</p>
      <div>
        <br />
        <p>Seleccione el estructurador asignado al predio</p>
        <Select
          className="basic-single"
          classNamePrefix="select"
          isLoading={isLoadingTec}
          isSearchable={true}
          name="tecnicos"
          options={listTecnicos}
          getOptionLabel={(option) => option.usuario_nombre}
          getOptionValue={(option) => option.usuario_usuario}
          placeholder="Seleccione el estructurador..."
          onChange={onChangeSelectTecnico}
        />
        <br />
        {/* <p>Seleccione el estructurador 2 asignado al predio</p>
        <Select
          className="basic-single"
          classNamePrefix="select"
          isLoading={isLoadingJur}
          isSearchable={true}
          name="juridicos"
          options={listJuridicos}
          getOptionLabel={(option) => option.usuario_nombre}
          getOptionValue={(option) => option.usuario_usuario}
          placeholder="Seleccione el estructurador..."
          onChange={onChangeSelectJuridico}
        />
        <br /> */}
        <p>Seleccione el control de calidad asignado al predio</p>
        <Select
          className="basic-single"
          classNamePrefix="select"
          isLoading={isLoadingSupTec}
          isSearchable={true}
          name="sup_tec"
          options={listSupTec}
          getOptionLabel={(option) => option.usuario_nombre}
          getOptionValue={(option) => option.usuario_usuario}
          placeholder="Seleccione el control de calidad..."
          onChange={onChangeSelectSupTec} />
        <br />
        {/* <p>Seleccione el control de calidad  asignado al predio</p>
        <Select
          className="basic-single"
          classNamePrefix="select"
          isLoading={isLoadingSupJur}
          isSearchable={true}
          name="tecnicos"
          options={listSupJur}
          getOptionLabel={(option) => option.usuario_nombre}
          getOptionValue={(option) => option.usuario_usuario}
          placeholder="Seleccione el control de calidad..."
          onChange={onChangeSelectSupJur}
        /> */}
      </div>

      <Popup
        trigger={<button type="button" className="primmary" onClick={() => getUltimoExpediente()}>Crear nuevo</button>}
        modal
        nested
      >
        {close => (
          <div className="modal">
            <button className="close" onClick={close}>
              &times;
            </button>
            <div className="header"> Confirmación </div>
            <div className="content">
              Antes de crear el registro predial verifique si ya existe la matrícula en el sistema mediante las herramientas de consulta avanzada o 
              consulta código BUPI. ¿Se encuentra seguro de crear el registro correspondiente al código BUPI : {expediente}?
            </div>
            <div className="actions">
              <button
                className="button"
                onClick={() => {
                  crearExpediente();
                  close();
                }}
              >
                Si
              </button>
              <button
                className="button"
                onClick={close}
              >
                No
              </button>
            </div>
          </div>
        )}

      </Popup>
      <ToastContainer />
    </div>
  )
}

export default CrearPredio;