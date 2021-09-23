import React, { useState, useEffect, Fragment } from "react";

//import {Info} from './estadisticas'

import { servidorPost } from '../js/request.js'
import { useParams } from 'react-router-dom';

import FaceIcon from '@material-ui/icons/Face';


const DetallePredio = () => {


  let { id } = useParams();

  const [data, setData] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [expediente, setExpediente] = useState(id);
  const [tipologia, setTopologia] = useState({});
  const [estadoTecnico, setEstadoTecnico] = useState({});
  const [observacionSIG, setObservacionSIG] = useState({});



  useEffect(() => {

    var datos = { "id_consulta": "get_asignacion", "id_expediente": id }

    servidorPost('/backend', datos).then((response) => {
      setData(response.data)
    });

    var datosTipologia = { "id_consulta": "get_tipologia", "id_expediente": id }

    servidorPost('/backend', datosTipologia).then((response) => {
      // console.log(response.data[0])
      setTopologia(response.data[0])
    });

    var datosTecnico = { "id_consulta": "get_estados_depuracion", "id_expediente": id }

    servidorPost('/backend', datosTecnico).then((response) => {
      // console.log(response.data[0])
      setEstadoTecnico(response.data[0])
    });

    var observacion = { "id_consulta": "get_observacion", "id_expediente": id }

    servidorPost('/backend', observacion).then((response) => {
      console.log(response.data[0])
      setObservacionSIG(response.data[0])
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
        </Fragment>

      </div>

      {/* {data.map((i, e) => (
        <div className="grupo-detalle-predio">
          <FaceIcon />
          <p className="cargo">{i.usuario_cargo}</p>
          <p className="usuario">{i.usuario_nombre}</p>
        </div>
      ))} */}
      {/* <div id="estados">
                <br/>
                <div><p>Estado depuración Técnica: {estadoTecnico?estadoTecnico.dep_tec:null}</p></div><br/>
                <div><p>Estado depuración Jurídica: {estadoTecnico?estadoTecnico.dep_jur:null}</p></div>
              </div> */}
    </div>
  );

}

export default DetallePredio;