import React, { useState  } from 'react';
import ReactDOM from 'react-dom';

import {url} from '../js/request'

import {servidorDocs} from '../js/request'


function Excel({titulo,descripcion,data}) {
    // Declara una nueva variable de estado, la cual llamaremos “count”
  const [count, setCount] = useState(0);
  


  const download=(data) => {
    
    servidorDocs('/excel', data)


  }


  
    return (
      <div>
        <div className="reporte">
          <p className="titulo">{titulo}</p>  
          <p className="descripcion">{descripcion}</p>
          <button className="secondary" onClick={()=>download(data)}>Descargar Reporte</button>
        </div>
      </div>
    );
}
  


const Report = () => {
  
  return(
    <div id="seccion">
      <div id="titulo_seccion">Descarga de reportes </div>
      <p id="descripcion_seccion">Sección para la descarga de los reportes del sistema.</p>
      <Excel titulo="Reporte Tareas" descripcion="Reporte completo de las tareas asignadas en el sistema" data={{ 'id_consulta': 'reporte_general' }} />
      <Excel titulo="Reporte Documentos" descripcion="Reporte completo de los documentos cargados al sistema" data={{ 'id_consulta': 'reporte_documentos' }} />
      <Excel titulo="Reporte Seguimiento Expedientes" descripcion="Reporte completo del seguimiento de los expedientes en el sistema, identifica la trazabilidad de los mismos." data={{ 'id_consulta': 'reporte_seguimiento_expedientes' }} />

    </div>

)

}


export default Report