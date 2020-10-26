import React, { Component } from 'react';
import { BrowserRouter, Route, Switch,Link } from 'react-router-dom';

import { servidorPost } from './request'

import { Home,Search,InsertDriveFile,Public,AttachFile,GroupAdd,EmojiPeople,ExitToApp} from '@material-ui/icons';

import MenuIcon from '@material-ui/icons/Menu';
import {Notifi} from '../modulos/encabezado'


const Estructura = ({children}) => {
    
  const [session, setSession] = React.useState(0);
  
  React.useEffect(() => {

  var data={"id_consulta":"session"}

    servidorPost('/backend', data).then(function (response) {
  
    var datos = response.data[0]
    setSession(datos)

  });
    
  }, []);
  

  const click = () => {
  
    const tog = document.getElementById('toggle')
    const panel=document.getElementById('panel_izquierdo')
    const container = document.getElementById('contenedor')

    if(panel.classList.contains("toggle")) {
      panel.classList.remove("toggle");
      container.style.gridTemplateColumns = "180px 1fr";
      panel.style.display = "block";
    }
    else {
      panel.classList.add("toggle");
      container.style.gridTemplateColumns = "1fr";
      panel.style.display = "none";
    }


}

  const salida = () => {
    
    document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    localStorage.removeItem('jwt')
    sessionStorage.removeItem('jwt')
  }


    return (
        <div id="contenedor">
    <div id="panel_izquierdo">
      <div id="logo">
        <img src="../img/logo.png" alt=""/>
      </div>
          <div id="items-nav">
          <div className="elemento">
        <Link to="/">
          <Home/>
          <p>Inicio</p>
        </Link>
      </div>
        <div className="elemento">
            <Link to="/buscar">
              <Search/>
              <p>Buscador</p>
            </Link>
        </div>
       <div className="elemento">
        <Link to="/documentos">
          <InsertDriveFile/>
           <p>Documentos</p>
        </Link>
       </div>
       <div className="elemento">
        <Link to="/visor">
          <Public/>
          <p>Visor geográfico</p>
        </Link>
      </div>
      <div className="elemento">
        <Link to="/reportes">
          <AttachFile/>
          <p>Reportes</p>
        </Link>
      </div>

      <div className="elemento">
        <Link to="/asignar">
          <GroupAdd/>
          <p>Asignar</p>
        </Link>
      </div>
      </div>
    </div>
        <div id="panel_superior">

        <div id="toggle" onClick={click}><MenuIcon/></div>

      <p id="titulo_sistema">
        Modulo de depuración predial
      </p>
        
      <Notifi/>    
           
           { /*<EmojiPeople/>
            <p>{session.usuario_nombre}</p>
        <Link to="/login" onClick={salida}>
            <div id="exit"><ExitToApp/></div>
           </Link>*/}
          
        
      
    </div>
    <div id="panel_centro">
      {children}
    </div>
</div>

)


}
export default Estructura;