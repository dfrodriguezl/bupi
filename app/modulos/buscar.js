import React, { useState } from "react";

//import {Info} from './estadisticas'

import { servidorPost } from '../js/request.js'
import { Link } from 'react-router-dom';

const Busqueda=()=>{
  
  const [data, setData] = useState([]);
const [filtro, setFiltro] = useState("");
    
  const ver_expediente = e => {
    
    var datos={"id_consulta":"get_proyectos","filtro":filtro}

    servidorPost('/backend',datos).then((response) =>{
        console.log(response)
        setData(response.data)
    });

    
    }
    const onChangeHandler = e => {
        setFiltro(e.target.value);
    };
    
        return (

          <div id="seccion">
            
            <div id="titulo_seccion">Busqueda</div>
            <p id="descripcion_seccion">Sección para la busqueda de predios, ingrese cualquier palabra para comenzar la búsqueda.</p>
            <div className="search">
                <input type="text" className="searchTerm" onChange={onChangeHandler}/>
                <button type="submit" className="searchButton primmary" onClick={ver_expediente}>
                    <i className="gg-search"></i>
                </button>
            </div>
                <div id='cuadro_busqueda'>
                {data.map((el,key) => (
                  <div className="item" key={key} >
                        <div>
    
                    <p className="item_titulo"> {el.id_expediente}</p>
                    <p className="item_des">Proyecto: {el.id_proyecto}</p>
                    <p className="item_des">Nombre: {el.nom_proy}</p>
                      <button >

                      <Link to={"predio/" + el.id_expediente}>
                        
                        <p>Ver expediente</p>
                        </Link>
                        
                      </button>
                      
                      


                  </div>
                </div>
                ))}
                </div>
            </div>
          );
    
  }

  export default Busqueda;