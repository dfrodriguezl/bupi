import React, { useState,useEffect } from "react";

//import {Info} from './estadisticas'

import { servidorPost } from '../js/request.js'
import { useParams } from 'react-router-dom';

import FaceIcon from '@material-ui/icons/Face';


const DetallePredio=()=>{
  

  let { id } = useParams();

  const [data, setData] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [expediente, setExpediente] = useState(id);
    
 

  useEffect(() => {

    var datos={"id_consulta":"get_asignacion","id_expediente":id}

    servidorPost('/backend',datos).then((response) =>{
        console.log(response)
      setData(response.data)

    });

  },[])

    
        return (

          <div id="seccion">
            
            <div id="titulo_seccion">{expediente}</div>

            {data.map((i, e) => (
              <div className="grupo-detalle-predio">
                <FaceIcon/>
                <p className="cargo">{i.usuario_cargo}</p>
                <p className="usuario">{i.usuario_nombre}</p>
              </div>
            ))}
            <div><p>Estado depuración Técnica: </p></div>
            <div><p>Estado depuración Jurídica: </p></div>
            

            </div>
          );
    
  }

  export default DetallePredio;