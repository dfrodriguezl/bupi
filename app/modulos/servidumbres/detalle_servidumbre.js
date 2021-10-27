import React, { useState, useEffect, Fragment } from "react";

//import {Info} from './estadisticas'
import { servidorPost } from "../../js/request.js";
import { useParams } from 'react-router-dom';

import FaceIcon from '@material-ui/icons/Face';


const DetalleServidumbre = () => {


  let { id } = useParams();

  const [data, setData] = useState([]);
  const [expediente, setExpediente] = useState(id);
  const [estadoTecnico, setEstadoTecnico] = useState({});



  useEffect(() => {

    var datos = { "id_consulta": "get_asignacion", "id_expediente": id }

    servidorPost('/backend', datos).then((response) => {
      setData(response.data)
    });

    var datosTecnico = { "id_consulta": "get_estados_depuracion_servidumbres", "id_servidumbre": id }

    servidorPost('/backend', datosTecnico).then((response) => {
      setEstadoTecnico(response.data[0])
    });

  }, [])


  return (

    <div id="seccion">

      <div id="titulo_seccion">{expediente}

        <Fragment>
          <p id="title-estados">Estado depuración Técnica: {estadoTecnico ? estadoTecnico.dep_tec : null}</p>
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

export default DetalleServidumbre;