import React, { Component } from 'react';
import { BrowserRouter, Route, Switch,Link } from 'react-router-dom';

import { servidorPost } from './request'

const Estructura = ({children}) => {
    
  const [session, setSession] = React.useState(0);
  
  React.useEffect(() => {

  var data={"id_consulta":"session"}

    servidorPost('/backend', data).then(function (response) {
  
    var datos = response.data[0]
    setSession(datos)

  });
    
}, []);


    return (
        <div id="contenedor">
    <div id="panel_izquierdo">
      <div id="logo">
        <img src="../img/logo.png" alt=""/>
      </div>
          <div id="items-nav">
          <div className="elemento">
        <Link to="/bienes-raices/">
          <div className="gg-browser"></div>
          <p>Inicio</p>
        </Link>
      </div>
        <div className="elemento">
            <Link to="/bienes-raices/buscar">
              <div className="gg-search"></div>
              <p>Buscador</p>
            </Link>
        </div>
       <div className="elemento">
        <Link to="/bienes-raices/documentos">
          <div className="gg-file-document"></div>
           <p>Documentos</p>
        </Link>
       </div>
       <div className="elemento">
        <Link to="/bienes-raices/visor">
          <div className="gg-image"></div>
          <p>Visor geográfico</p>
        </Link>
      </div>
      <div className="elemento">
        <Link to="/bienes-raices/reportes">
          <div className="gg-file-add"></div>
          <p>Reportes</p>
        </Link>
      </div>

      <div className="elemento">
        <Link to="/bienes-raices/asignar">
          <div className="gg-external"></div>
          <p>Asignar</p>
        </Link>
      </div>
      </div>
    </div>
    <div id="panel_superior">
      <p id="titulo_sistema">
        Modulo de depuración predial
      </p>
        <div id="util_superior">
            
            <div className="gg-boy"></div>
            <p>{session.usuario_nombre}</p>
        <Link to="/bienes-raices/login">
            <div id="exit"><i className="gg-log-off"></i></div>
        </Link>
        

      </div>
      
    </div>
    <div id="panel_centro">
      {children}
    </div>
</div>

)


}
export default Estructura;