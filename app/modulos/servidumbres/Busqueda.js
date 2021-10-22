import React, { useState } from "react";
import { servidorPost } from '../../js/request'
import { Link } from 'react-router-dom';
import SearchIcon from '@material-ui/icons/Search';

const Busqueda = () => {
  
  const [data, setData] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [vacio, setVacio] = useState(0);
    
  const ver_servidumbre = (e) => {
    
    var datos={"id_consulta":"get_servidumbres","filtro":filtro}

    servidorPost('/backend',datos).then((response) =>{
        console.log(response)
      setData(response.data)
      if (response.data.length>0) {
        setVacio(0)
      }
      else {
        setVacio(1) 
      }
    });

    
  }
  
    const onChangeHandler = e => {
        setFiltro(e.target.value);
    };
    
        return (

          <div id="seccion">
            
            <div id="titulo_seccion">Busqueda servidumbres</div>
            <p id="descripcion_seccion">Sección para la busqueda de servidumbres, puede hacer busquedas con id_servidumbre, identificador de proyecto, nombre de proyecto, chip catastral, número de matricula inmobiliaria, código catastral, barrio/vereda, UPZ ó dirección. (Se muestran máximo 50 resultados)</p>
            <div className="search">
                <input type="text" className="searchTerm" onChange={onChangeHandler}/>
                <button type="submit" className="searchButton primmary" onClick={ver_servidumbre}>
                    <SearchIcon/>
                </button>
            </div>
                <div id='cuadro_busqueda'>
                {data.map((el,key) => (
                  <div className="item" key={key} >
                        <div>
    
                    <p className="item_titulo"> {el.id_servidumbre}</p>
                    <p className="item_des">Proyecto: {el.id_proyecto_s}</p>
                      <p className="item_des">Nombre: {el.nom_proy_res}</p>
                      <p className="item_des">CHIP: {el.chip_cat}</p>
                      <p className="item_des">Dirección: {el.direccion}</p>
                      <p className="item_des">Barrio/Vereda: {el.bar_ver}</p>
                      <button >

                      <Link to={"/servidumbres/servidumbre/" + el.id_servidumbre}>
                        
                        <p>Ver servidumbre</p>
                        </Link>
                        
                      </button>
                      
                      


                  </div>
                </div>
                ))}
              {vacio==1?<p>Sin resultados</p>:''}
                </div>
            </div>
          );
    
  }

  export default Busqueda;