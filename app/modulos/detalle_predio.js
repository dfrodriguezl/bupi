import React, { useState, useEffect, Fragment } from "react";

//import {Info} from './estadisticas'

import { servidorPost } from '../js/request.js'
import { useParams } from 'react-router-dom';

import FaceIcon from '@material-ui/icons/Face';


const DetallePredio = () => {


  let { id } = useParams();

  const [expediente, setExpediente] = useState(id);
  const [tipologia, setTopologia] = useState({});
  const [estadoTecnico, setEstadoTecnico] = useState({});
  const [observacionSIG, setObservacionSIG] = useState({});
  const [estadoPrestamo, setEstadoPrestamo] = useState();



  useEffect(() => {

    var datosTipologia = { "id_consulta": "get_tipologia", "id_expediente": id }

    servidorPost('/backend', datosTipologia).then((response) => {
      setTopologia(response.data[0])
    });

    var datosTecnico = { "id_consulta": "get_estados_depuracion", "id_expediente": id }

    servidorPost('/backend', datosTecnico).then((response) => {
      setEstadoTecnico(response.data[0])
    });

    var observacion = { "id_consulta": "get_observacion", "id_expediente": id }

    servidorPost('/backend', observacion).then((response) => {
      setObservacionSIG(response.data[0])
    });

    var prestamo = { "id_consulta": "get_estado_prestamo", "id_expediente": id }

    servidorPost('/backend', prestamo).then((response) => {
      const count = response.data[0].count;
      setEstadoPrestamo(count === "0" ? "DISPONIBLE" : "EN PRÉSTAMO")
    });

  }, [])


  return (

    <div id="seccion">

      <div id="titulo_seccion">{expediente}
        {tipologia.descripcion ?
          <Fragment>
            <br />Tipología impuesto 2021: {tipologia.descripcion}
          </Fragment> : null
        }

        {observacionSIG.descripcion ?
          <Fragment>
            <br />Observación SIG: {observacionSIG.descripcion}
          </Fragment> : null
        }

        <Fragment>
          <p id="title-estados">Estado depuración Técnica: {estadoTecnico ? estadoTecnico.dep_tec : null}</p>
          <p id="title-estados">Estado depuración Jurídica: {estadoTecnico ? estadoTecnico.dep_jur : null}</p>
          <p id="title-estados">Estado préstamo expediente: {estadoPrestamo}</p>
        </Fragment>

      </div>

    </div>
  );

}

export default DetallePredio;