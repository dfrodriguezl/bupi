import React, { useState, useEffect, Fragment } from "react";

//import {Info} from './estadisticas'

import { servidorPost } from '../js/request.js'
import { useParams } from 'react-router-dom';

import FaceIcon from '@material-ui/icons/Face';
import DescargaShape from "./componentes/descarga_shape.js";
import DescargaSalida from "./componentes/descarga_salida_grafica.js";
import DescargaReportePredio from "./componentes/descarga_reporte_predio.js";


const DetallePredio = () => {


  let { id } = useParams();

  const [expediente, setExpediente] = useState(id);
  // const [tipologia, setTopologia] = useState({});
  const [estadoTecnico, setEstadoTecnico] = useState({});
  const [tareaActiva, setTareaActiva] = useState({});
  // const [observacionSIG, setObservacionSIG] = useState({});
  // const [estadoPrestamo, setEstadoPrestamo] = useState();



  useEffect(() => {

    // var datosTipologia = { "id_consulta": "get_tipologia", "id_expediente": id }

    // servidorPost('/backend', datosTipologia).then((response) => {
    //   setTopologia(response.data[0])
    // });

    var datosTecnico = { "id_consulta": "get_estados_depuracion", "id_expediente": id }

    servidorPost('/backend', datosTecnico).then((response) => {
      setEstadoTecnico(response.data[0])
    });

    const datosTarea = { "id_consulta": "get_tarea_activa", "id_expediente": id }

    servidorPost('/backend', datosTarea).then((response) => {
      setTareaActiva(response.data[0])
    });

    // var observacion = { "id_consulta": "get_observacion", "id_expediente": id }

    // servidorPost('/backend', observacion).then((response) => {
    //   setObservacionSIG(response.data[0])
    // });

    // var prestamo = { "id_consulta": "get_estado_prestamo", "id_expediente": id }

    // servidorPost('/backend', prestamo).then((response) => {
    //   const count = response.data[0].count;
    //   setEstadoPrestamo(count === "0" ? "DISPONIBLE" : "EN PRÉSTAMO")
    // });

  }, [])


  return (

    <div id="seccion">

      <div id="titulo_seccion" style={{ display: 'inline-block' }}>
        Código BUPI: {expediente}
        {/* {tipologia ?
          tipologia.descripcion ?
            <Fragment>
              <br />Tipología impuesto 2021: {tipologia.descripcion}
            </Fragment> : null : null
        } */}

        {/* {observacionSIG ?
          observacionSIG.descripcion ?
            <Fragment>
              <br />Observación SIG: {observacionSIG.descripcion}
            </Fragment> : null : null
        } */}

        <Fragment>
          <p id="title-estados">Estado Estructuración: {estadoTecnico ? estadoTecnico.dep_tec : null}</p>
          <p id="title-estados">Usuario asignado: {tareaActiva ? tareaActiva.usuario : null}</p>
          
          <p id="title-estados">Fecha de asignación: {tareaActiva ? new Date(tareaActiva.fecha_asignacion).toLocaleDateString() + " " + new Date(tareaActiva.fecha_asignacion).toLocaleTimeString() : null}</p>
          {/* <p id="title-estados">Estado depuración Jurídica: {estadoTecnico ? estadoTecnico.dep_jur : null}</p> */}
          {/* <p id="title-estados">Estado préstamo expediente: {estadoPrestamo}</p> */}
        </Fragment>

      </div>

      {/* <div class="opciones" style={{ display: 'inline-block', paddingLeft: 50, paddingTop: 20 }}>
        <DescargaShape id_expediente={expediente} />
      </div>
      <div class="opciones" style={{ display: 'inline-block', paddingLeft: 50, paddingTop: 20 }}>
        <DescargaSalida id_expediente={expediente} />
      </div>
      <div class="opciones" style={{ display: 'inline-block', paddingLeft: 50, paddingTop: 20 }}>
        <DescargaReportePredio id_expediente={expediente} />
      </div> */}


    </div>
  );

}

export default DetallePredio;