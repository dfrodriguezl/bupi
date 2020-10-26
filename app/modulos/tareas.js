import React from 'react';
import ReactDOM from 'react-dom';
const servidor = require('../js/request.js');

const Tarea = () => {

    const [data, setData] = React.useState([]);

    React.useEffect( () => {

    async function getTareas() {
        var datos = { "id_consulta": "get_tareas" }
        const result = await servidor.servidorPost('/backend', datos);
        
        console.log(result)
            
       setData(result.data);
    }

 
    getTareas();

        
  }, []);
    
    return (
        <div >

            {data.map((item, index) =>
                <div className="grupo">
                    <p>Id expediente: {item.id_expediente}</p>
                    <p>Fecha Asignación: {item.fecha_asignacion}</p>
                    <p>Quien asigna: {item.usuario_nombre}</p>
                    <p>Descripción: {item.descripcion}</p>
                </div>
            )}
            
        </div>
    );
  
}
  
export { Tarea }