import React from 'react';
import ReactDOM from 'react-dom';
import { Tarea } from './tareas.js'

const servidor = require('../js/request.js')
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';

import CloseIcon from '@material-ui/icons/Close';
import FaceIcon from '@material-ui/icons/Face';


const Notifi = () => {

  const [panel, setPanel] = React.useState(false);
  const [tarea, setTarea] = React.useState(0);
  const [session, setSession] = React.useState(0);

  function toggleButton() {
    if (!panel) setPanel(true);
    else setPanel(false);
  }

  React.useEffect(() => {
    var datos = { "id_consulta": "get_numero_tareas" }
    servidor.servidorPost('/backend', datos).then((response) => {
      const data = response.data[0].count;
      setTarea(data);

    });


    var data = { "id_consulta": "session" }

    servidor.servidorPost('/backend', data).then(function (response) {

      var datos = response.data[0]
      setSession(datos)

    }).catch((error) => {
      servidor.redireccionar(error)
    });


  }, []);

  const updateStars = (star) => {
    setTarea(star);
  }


  return (
    <div id="encabezado">
        
      <div onClick={toggleButton} className="user">
      <p>{session.usuario_nombre}</p> <FaceIcon/> <p>{tarea}</p>
      </div>
      <Link to="/login">
          <CloseIcon/>
      </Link>
      <div id="tareas">
        {panel ? <Tarea /> : null}
      </div>
    </div>
  );

}

export {Notifi}