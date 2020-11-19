import React, { useState  } from 'react';
import ReactDOM from 'react-dom';

import {url} from '../js/request'

import {servidorGet} from '../js/request'


function Help({ titulo,  doc }) {
  // Declara una nueva variable de estado, la cual llamaremos “count”
  const [count, setCount] = useState(0);
  


  const download = (doc) => {
    
    window.open(`${url}/help/${doc}`,'_blank')


  }


  
    return (
      <div>
        <div className="reporte">
          <p className="titulo">{titulo}</p>  
          <button className="secondary" onClick={()=>download(doc)}>Descargar guía</button>
        </div>
      </div>
    );
}
  

/*
<Help titulo="Reporte Tareas" descripcion="Reporte completo de las tareas asignadas en el sistema"  />

*/


export default Help