import React, { useState  } from 'react';
import ReactDOM from 'react-dom';

import {url} from '../js/request'

function Excel({titulo,descripcion,link}) {
    // Declara una nueva variable de estado, la cual llamaremos “count”
    const [count, setCount] = useState(0);
  
    return (
      <div>
        <div className="reporte">
          <p>{titulo}</p>  
          <a href={link} target="_blank" className="button">Descargar reporte</a>
        </div>
      </div>
    );
}
  


const Report = () => {
  
  return(
    <div id="seccion">
      <div id="titulo_seccion">Descarga de reportes </div>
      <p id="descripcion_seccion">Sección para la descarga de los reportes del sistema.</p>

      <Excel titulo="Reporte de tareas asignadas" link={url+'/excel/reporte_general'} />

    </div>

)

}


export default Report