
import '../css/styles.scss';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useLocation } from 'react-router-dom'


import Documentos from './documentos'
import Login from './login'
import Visor from './visor'
import Reportes from './reportes'
import Home from './home'
import Predio from './predio'
import Buscar from './buscar'
import Buscar_mar from './buscar_mar'
import Asignar from './asignar'
import User from './usuario'
import Ayuda from './ayuda';
import Administracion from './administracion';
import Actualizacion from './actualizacion';
import BusquedaServ from './servidumbres/Busqueda'
import Concesion from './concesion'
import Servidumbre from './servidumbres/servidumbre'
import ReporteServidumbre from './servidumbres/reportes'
import BusquedaAvanzada from './busqueda_avanzada';
import HomeConsulta from './home_consulta';



const Tree = () => {

    return (
        <BrowserRouter>
            <Switch>
                <BrowserRouter basename='/predios/web'>
                    <Route exact path='/' component={Home} />
                    <Route exact path='/buscar/:id' component={Buscar} />
                    <Route exact path='/buscar' component={Buscar} />
                    <Route exact path='/buscar_mar' component={Buscar_mar} />
                    <Route exact path='/buscarAvanzado' component={BusquedaAvanzada} />
                    <Route exact path='/documentos' component={Documentos} />
                    <Route exact path='/login' component={Login} />
                    <Route exact path='/visor' component={Visor} />
                    <Route exact path='/reportes' component={Reportes} />
                    <Route exact path='/asignar' component={Asignar} />
                    <Route exact path="/predio/:id" component={Predio} />
                    <Route exact path='/personal' component={User} />
                    <Route exact path='/ayuda' component={Ayuda} />
                    <Route exact path='/admin' component={Administracion} />
                    <Route exact path='/actualizar' component={Actualizacion} />
                    <Route exact path='/servidumbres/buscar' component={BusquedaServ} />
                    <Route exact path='/concesiones/concesion/:id' component={Concesion} />
                    <Route exact path='/servidumbres/servidumbre/:id' component={Servidumbre} />
                    <Route exact path='/servidumbres/reportes' component={ReporteServidumbre} />
                    <Route exact path='/consulta' component={HomeConsulta} />
                </BrowserRouter>
            </Switch>
        </BrowserRouter>

    )


}

ReactDOM.render(<Tree />, document.getElementById('pagina'));



function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
}

const images = importAll(require.context('../img/', false, /\.(png|jpg|svg)$/));