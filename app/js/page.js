import React, { Fragment } from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';

import { servidorPost } from './request'

import { Home, Search, InsertDriveFile, Public, AttachFile, GroupAdd, FilterList } from '@material-ui/icons';

import FaceIcon from '@material-ui/icons/Face';
import HelpIcon from '@material-ui/icons/Help';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import PublishIcon from '@material-ui/icons/Publish';
import MenuIcon from '@material-ui/icons/Menu';
import { Grid } from '@material-ui/core';
import { Link as Link2} from '@material-ui/core';
import { Notifi } from '../modulos/encabezado'
import { getPermisos } from '../variables/permisos'
import { useHistory } from 'react-router-dom'


const Estructura = ({ children }) => {

  const [session, setSession] = React.useState(0);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isConsulta, setIsConsulta] = React.useState(false);
  const [isEstructurador, setIsEstructurador] = React.useState(false);
  const [isControlCalidad, setIsControlCalidad] = React.useState(false);
  const [isCoordinador, setIsCoordinador] = React.useState(false);
  const history = useHistory();
  const isServidumbre = history.location.pathname.indexOf('servidumbres') > -1;

  React.useEffect(() => {

    var data = { "id_consulta": "session" }

    servidorPost('/backend', data).then(function (response) {

      var datos = response.data[0]
      setSession(datos)
      // setIsConsulta(datos.usuario_rol === 0 ? true : false);
      setIsEstructurador(datos.usuario_rol === 9 ? true : false);
      setIsControlCalidad(datos.usuario_rol === 6 ? true : false);
      setIsCoordinador(datos.usuario_rol === 1 ? true : false);
    });

    getPermisos().then((response) => {

      if (response.some(r => r == 10)) {
        setIsAdmin(true)
      }

    });

  }, []);


  const click = () => {

    const tog = document.getElementById('toggle')
    const panel = document.getElementById('panel_izquierdo')
    const container = document.getElementById('contenedor')

    if (panel.classList.contains("toggle")) {
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
      <Grid container className="container-images encabezado-app">
          <Grid item xs={6}>
          <Link2 href="https://www.mintransporte.gov.co/" target="_blank" rel="noreferrer">
            <img src="https://www.invias.gov.co/images/logos/colombia_potencia_vida.png" className="encabezado-logo-Colombia-Potencia-Vida" alt="Logo Colombia Potencia Vida" />   
          </Link2>
          </Grid>
          <Grid item xs={6}>
          <Link2 href="https://www.invias.gov.co/" target="_blank" rel="noreferrer">
            <img src="predios/img/LOGO-INVIAS-Simplificado.png" className="encabezado-logo-invias" alt="Logo INVIAS" />
          </Link2> 
          </Grid>
      </Grid>
      <div id="panel_izquierdo">
        {/* <div id="logo">
          <img src="predios/img/LOGO-INVIAS-Simplificado.png" className="login-logo-invias" alt="Logo INVIAS" />
        </div> */}
        <div id="items-nav">
          {!isServidumbre ?
            <div className="elemento">
              <Link to={isConsulta ? "/consulta" : "/"}>
                <Home />
                <p>Inicio</p>
              </Link>
            </div> : null
          }

          {isServidumbre ?
            <div className="elemento">
              <Link to="/servidumbres/buscar">
                <Search />
                <p>Buscador</p>
              </Link>
            </div> :
            <Fragment>
              <div className="elemento">
                <Link to="/buscar">
                  <Search />
                  <p>Consulta código BUPI - Matrícula</p>
                </Link>
              </div>
              <div className="elemento">
                <Link to="/buscarAvanzado">
                  <FilterList />
                  <p>Consulta avanzada</p>
                </Link>
              </div>
            </Fragment>
          }


          {/* <div className="elemento">
            <Link to="/documentos">
              <InsertDriveFile />
              <p>Documentos</p>
            </Link>
          </div> */}
          <div className="elemento">
            <Link to="/visor">
              <Public />
              <p>Visor geográfico</p>
            </Link>
          </div>
          {isServidumbre ?
            <div className="elemento">
              <Link to="/servidumbres/reportes">
                <AttachFile />
                <p>Reportes</p>
              </Link>
            </div> :
            <div className="elemento">
              <Link to="/reportes">
                <AttachFile />
                <p>Reportes</p>
              </Link>
            </div>

          }

          <div className="elemento">
            <Link to="/personal">
              <FaceIcon />
              <p>Usuario</p>
            </Link>
          </div>
          {isAdmin ?
            <Fragment>
              <div className="elemento">
                <Link to="/asignar">
                  <GroupAdd />
                  <p>Asignar</p>
                </Link>
              </div>
              <div className="elemento">
                <Link to="/actualizar">
                  <PublishIcon />
                  <p>Actualizar</p>
                </Link>
              </div>
              <div className="elemento">
                <Link to="/admin">
                  <SupervisorAccountIcon />
                  <p>Administración</p>
                </Link>
              </div>
            </Fragment> :
            isEstructurador || isControlCalidad ?
              <div className="elemento">
                <Link to="/actualizar">
                  <PublishIcon />
                  <p>Actualizar</p>
                </Link>
              </div> :
              isCoordinador ?
                <div className="elemento">
                  <Link to="/asignar">
                    <GroupAdd />
                    <p>Asignar</p>
                  </Link>
                </div>
                : null
          }

          <div className="elemento">
            <Link to="/ayuda">
              <HelpIcon />
              <p>Ayuda</p>
            </Link>
          </div>
        </div>
      </div>
      <div id="panel_superior">

        {/* <div id="toggle" onClick={click}><MenuIcon /></div> */}

        <p id="titulo_sistema">
          BUPI
        </p>

        <Notifi />

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