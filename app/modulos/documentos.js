import React, { useState } from "react";

//import {Info} from './estadisticas'

import {url, servidorPost } from '../js/request.js'
import { useParams } from 'react-router-dom'

const Documentos=()=>{
  
  const [info, setInfo] = React.useState([]);

  let { id } = useParams();
  
  React.useEffect(() => {
       
    
  var datos={"id_consulta":"get_documentos","identificador":id}

  servidorPost('/backend',datos).then((response) =>{
    
    if (response.data.length > 0) {
      var datos = response.data
      console.log(datos)
      setInfo(datos)
    }
    
  });
    
    
    
    
}, []);

const download=( id)=> {


    window.open(url+'/descargar/'+id)


}
    
        return (

          <div id="seccion">
            
            <div id="titulo_seccion">Documentos</div>
            <p id="descripcion_seccion">Sección para visualizar los documentos escaneados</p>
             
            <div id="documentos">
            <div className="item head" >
                  <p>Tipo de documento</p>
                  <p>Responsable</p>
                  <p>Fecha de cargue</p>
                  <p>Ver</p>
                </div>
              {info.map((e,i) => (
                <div className="item" key={e.id}>
                  <p>{e.nombre}</p>
                  <p>{e.usuario}</p>
                  <p>{e.fecha}</p>
                  <i class="gg-software-download" onClick={()=>download(e.id)}></i>
                </div>
              ))}
             </div>
            </div>
          );
    
  }

  export default Documentos;