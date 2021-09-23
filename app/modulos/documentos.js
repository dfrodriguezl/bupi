import React, { useState } from "react";

//import {Info} from './estadisticas'

import {url, servidorPost } from '../js/request.js'
import { useParams } from 'react-router-dom'

import FindInPageIcon from '@material-ui/icons/FindInPage';

import {Modal} from './popup'

import SearchBar from "material-ui-search-bar";


const Documentos=()=>{
  
  const [info, setInfo] = React.useState([]);
  const [refresh, setRefresh] = React.useState(false);
  const [filtro, setFiltro] = React.useState([]);
  
  let { id } = useParams();
  

  var meta;

  React.useEffect(() => {
       
    
  var datos={"id_consulta":"get_documentos","identificador":id}

  servidorPost('/backend',datos).then((response) =>{
    
    if (response.data.length > 0) {
      var datos = response.data
     

      var data={"id_consulta":"get_metadata"}
      servidorPost('/backend/', data).then((response) => {
          
          // console.log(response.data)
          meta=response.data
          
          datos = datos.map((e,i) => ({"descripcion":hola(e.nombre),...e}));

          setInfo(datos)
          setFiltro(datos)
        
        
      })





    }
    
  });
    

    
    
}, [refresh]);

const download=( id)=> {


    window.open(url+'/descargar/'+id)


  }
  

  const hola = (name) => {

    // console.log(name)
    var nombre = name;
    var tipo=nombre.split('-')[1]  
    var tipo_documento = ""

    meta.map((item, e) => {
        
        if (item.cod_grupo==tipo) {
          tipo_documento = item.nombre
            return
        }
      })
    
    return tipo_documento
  }

  const filtrar = (valor) => {
    const filtro = valor.toUpperCase();

    var arr=info.filter(e => e.descripcion.includes(filtro));
    setFiltro(arr)

  }

    
        return (

          <div id="seccion">
            
            <div id="titulo_seccion">Documentos</div>
            <p id="descripcion_seccion">Sección para visualizar los documentos escaneados</p>

            <p className="enfasis">Total de documentos: {info.length}</p>
             
            <SearchBar
              placeholder="Filtrar"
              onChange={(newValue) => filtrar(newValue)}
              onRequestSearch={() => console.log("hola")}
            />
            
            

            <div id="documentos">
            <div className="item head" >
                  <p>Documento</p>
                  <p>Descripcion</p>
                  <p>Responsable</p>
                <p>Fecha de cargue</p>
                <p>Borrar</p>
                  <p>Ver</p>
                </div>
              {filtro.map((e,i) => (
                <div className="item" key={e.id}>
                  <p>{e.nombre}</p>
                  <p>{e.descripcion}</p>
                  <p>{e.usuario}</p>
                  <p>{e.fecha}</p>
                  <Modal  nombre={e.nombre} refresh={setRefresh}/>
                  <FindInPageIcon onClick={()=>download(e.id)}></FindInPageIcon>
                </div>
              ))}
             </div>
            </div>
          );
    
  }

  export default Documentos;