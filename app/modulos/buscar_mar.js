import React, { useState, useEffect } from "react";

//import {Info} from './estadisticas'

import { servidorPost } from '../js/request.js'
import { Link } from 'react-router-dom';

import SearchIcon from '@material-ui/icons/Search';
import { useParams } from 'react-router-dom';

const Busqueda_mar = () => {

  const { id } = useParams();
  const [data, setData] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [vacio, setVacio] = useState(0);

  useEffect(() => {
    if (id) {
      setFiltro(id)
      ver_expediente(id);
    }
  }, [])

  const ver_expediente = (filter) => {

    var datos = { "id_consulta": "get_concesiones", "filtro": filter ? filter : filtro }

    servidorPost('/backend', datos).then((response) => {
      console.log(response)
      setData(response.data)
      if (response.data.length > 0) {
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

      <div id="titulo_seccion">Consulta</div>
      <p id="descripcion_seccion">Sección para la busqueda de registros, puede hacer busquedas con nombre concesión, contrato o matricula. (Se muestran máximo 50 resultados)</p>
      <div className="search">
        <input type="text" className="searchTerm" onChange={onChangeHandler} value={filtro} />
        <button type="submit" className="searchButton primmary" onClick={() => ver_expediente()}>
          <SearchIcon />
        </button>
      </div>
      <div id='cuadro_busqueda'>
        {data.map((el, key) => (
          <div className="item" key={key} >
            <div>
              <p className="item_titulo">{el.id_concesion} {el.nombre_concesionario}</p>
              <p className="item_des">Dirección concesión: {el.direccion_nomenclatura_concesion}</p>
              <p className="item_des">Departamento: {el.departamento}</p>
              <p className="item_des">Municipio: {el.municipio}</p>
              <p className="item_des">Número Contrato: {el.numero_documento_contrato}</p>
              <p className="item_des">Código BUPI: {el.codigo_bupi}</p>
              <button >
                <Link to={"/concesiones/concesion/" + el.id_concesion}>
                  <p>Ver concesión</p>
                </Link>
              </button>
            </div>
          </div>
        ))}
        {vacio == 1 ? <p>Sin resultados</p> : ''}
      </div>
    </div>
  );

}

export default Busqueda_mar;