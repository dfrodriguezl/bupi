import React, { useState, useEffect, Fragment } from "react";

//import {Info} from './estadisticas'
import { Grid, Typography } from '@material-ui/core';
import { servidorPost } from '../js/request.js'
import { useParams } from 'react-router-dom';

import FaceIcon from '@material-ui/icons/Face';
import DescargaShape from "./componentes/descarga_shape.js";
import DescargaSalida from "./componentes/descarga_salida_grafica.js";
import DescargaReportePredio from "./componentes/descarga_reporte_predio.js";


const DetalleConcesion = () => {


  let { id } = useParams();

  const [expediente, setExpediente] = useState(id);
  // const [tipologia, setTopologia] = useState({});
  // const [estadoTecnico, setEstadoTecnico] = useState({});
  const [tareaActiva, setTareaActiva] = useState({});
  // const [estadoContabilidad, setEstadoContabilidad] = useState({});
  // const [estadoDocumental, setEstadoDocumental] = useState({});
  // const [saneamientosJuridicos, setSaneamientosJuridicos] = useState([]);
  // const [observacionSIG, setObservacionSIG] = useState({});
  // const [estadoPrestamo, setEstadoPrestamo] = useState();



  useEffect(() => {

    // var datosTipologia = { "id_consulta": "get_tipologia", "codigo_bupi": id }

    // servidorPost('/backend', datosTipologia).then((response) => {
    //   setTopologia(response.data[0])
    // });

    // var datosTecnico = { "id_consulta": "get_estados_depuracion", "codigo_bupi": id }

    // servidorPost('/backend', datosTecnico).then((response) => {
    //   setEstadoTecnico(response.data[0])
    // });

    const datosTarea = { "id_consulta": "get_tarea_activa_concesion", "id_concesion": id }

    servidorPost('/backend', datosTarea).then((response) => {
      setTareaActiva(response.data[0])
    });

    // var datosContabilidad = { "id_consulta": "get_estado_contabilidad", "codigo_bupi": id }

    // servidorPost('/backend', datosContabilidad).then((response) => {
    //   setEstadoContabilidad(response.data[0])
    // });

    // var datosDocumental = { "id_consulta": "get_estado_documental", "codigo_bupi": id }

    // servidorPost('/backend', datosDocumental).then((response) => {
    //   setEstadoDocumental(response.data[0])
    // });

    // var datosJuridico = { "id_consulta": "get_estado_san_juridico", "codigo_bupi": id }

    // servidorPost('/backend', datosJuridico).then((response) => {
    //   setSaneamientosJuridicos(response.data)
    // });

    // var observacion = { "id_consulta": "get_observacion", "codigo_bupi": id }

    // servidorPost('/backend', observacion).then((response) => {
    //   setObservacionSIG(response.data[0])
    // });

    // var prestamo = { "id_consulta": "get_estado_prestamo", "codigo_bupi": id }

    // servidorPost('/backend', prestamo).then((response) => {
    //   const count = response.data[0].count;
    //   setEstadoPrestamo(count === "0" ? "DISPONIBLE" : "EN PRÉSTAMO")
    // });

  }, [])


  return (

    <div id="seccion">

      <div id="titulo_seccion">
        CONCESIÓN PORTUARIA: {expediente}
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
        <Grid container justify="center" xs={12}>
          <Grid item container xs={12} justify="center">
            <Typography variant="h6">ESTADOS</Typography>
          </Grid>
          <Grid item container xs={3} direction="column" alignItems="center">
            <Typography variant="subtitle1">Estructuración</Typography>
            {/* <p id="title-estados">Estado: {estadoTecnico ? estadoTecnico.dep_tec : null}</p> */}
            <p id="title-estados">Usuario: {tareaActiva ? tareaActiva.usuario : null}</p>
            <p id="title-estados">Fecha de asignación: {tareaActiva ? new Date(tareaActiva.fecha_asignacion).toLocaleDateString() + " " + new Date(tareaActiva.fecha_asignacion).toLocaleTimeString() : null}</p>
          </Grid>
          {/* <Grid item container xs={3} direction="column" alignItems="center">
            <Typography variant="subtitle1">Registro contable</Typography>
            <p id="title-estados">Estado: {estadoContabilidad ? estadoContabilidad.descripcion : null}</p>
          </Grid>
          <Grid item container xs={2} direction="column" alignItems="center">
            <Typography variant="subtitle1">Expediente predial</Typography>
            <p id="title-estados">Estado: {estadoDocumental ? estadoDocumental.descripcion : null}</p>
          </Grid>
          <Grid item container xs={4} direction="column" justify="center">
            <Grid item container justify="center">
              <Typography variant="subtitle1">Saneamientos</Typography>
            </Grid>
            <Grid item container direction="row" justify="center">
              <Grid xs={6} item container justify="center" alignItems="center">
                <Typography variant="caption">Saneamientos jurídicos</Typography>
                {saneamientosJuridicos.map((sj) => 
                  <p id="title-estados" style={{color: sj.estado_actual === "PENDIENTE" ? "red" : sj.estado_actual === "TRÁMITE" ? "orange" : "green"}}>Saneamiento: {sj.saneamiento} ({sj.estado_actual})</p>
                )}
              </Grid>
              <Grid xs={6} item container justify="center" alignItems="center">
                <Typography variant="caption">Saneamientos catastrales</Typography>
              </Grid>
            </Grid>
          </Grid> */}
        </Grid>

        {/* <Fragment>
          <p id="title-estados">Estado Estructuración: {estadoTecnico ? estadoTecnico.dep_tec : null}</p>
          <p id="title-estados">Usuario asignado: {tareaActiva ? tareaActiva.usuario : null}</p>
          
          <p id="title-estados">Fecha de asignación: {tareaActiva ? new Date(tareaActiva.fecha_asignacion).toLocaleDateString() + " " + new Date(tareaActiva.fecha_asignacion).toLocaleTimeString() : null}</p>
         
        </Fragment> */}

      </div>

      {/* <div class="opciones" style={{ display: 'inline-block', paddingLeft: 50, paddingTop: 20 }}>
        <DescargaShape codigo_bupi={expediente} />
      </div>
      <div class="opciones" style={{ display: 'inline-block', paddingLeft: 50, paddingTop: 20 }}>
        <DescargaSalida codigo_bupi={expediente} />
      </div>
      <div class="opciones" style={{ display: 'inline-block', paddingLeft: 50, paddingTop: 20 }}>
        <DescargaReportePredio codigo_bupi={expediente} />
      </div> */}


    </div>
  );

}

export default DetalleConcesion;