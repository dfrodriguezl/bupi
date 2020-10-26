import React, { useState } from "react";

//import {Info} from './estadisticas'

import {url, servidorPost } from '../js/request.js'
import { useParams } from 'react-router-dom'

import FindInPageIcon from '@material-ui/icons/FindInPage';

const Documentos=()=>{
  
  const [info, setInfo] = React.useState([]);
  const [meta, setMeta] = React.useState([]);
  
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
    
  var data={"id_consulta":"get_metadata"}
  servidorPost('/backend/', data).then((response) => {
      
      console.log(response.data)
      setMeta(response.data)
      
  })
    
    
}, []);

const download=( id)=> {


    window.open(url+'/descargar/'+id)


  }
  

  const hola = (name) => {


    var nombre = name;
    var tipo=nombre.split('-')[1]  
    var tipo_documento=""
      meta.map((item, e) => {
        if (item.cod_grupo==tipo) {
            tipo_documento = item.nombre
            return
        }
      })
    
    return <p>{tipo_documento}</p>
  }
    
        return (

          <div id="seccion">
            
            <div id="titulo_seccion">Documentos</div>
            <p id="descripcion_seccion">Sección para visualizar los documentos escaneados</p>
             
            <div id="documentos">
            <div className="item head" >
                  <p>Documento</p>
                  <p>Descripcion</p>
                  <p>Responsable</p>
                  <p>Fecha de cargue</p>
                  <p>Ver</p>
                </div>
              {info.map((e,i) => (
                <div className="item" key={e.id}>
                  <p>{e.nombre}</p>
                  <p>{hola(e.nombre)}</p>
                  <p>{e.usuario}</p>
                  <p>{e.fecha}</p>
                  <FindInPageIcon onClick={()=>download(e.id)}></FindInPageIcon>
                </div>
              ))}
             </div>
            </div>
          );
    
  }

  export default Documentos;