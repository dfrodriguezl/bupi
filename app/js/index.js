
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
import Asignar from './asignar'



const Tree = () => {
    
    return (
    <BrowserRouter>
            <Switch>
                <Route exact path='/bienes-raices/web' component={Home} />
                <Route exact path='/bienes-raices/web/buscar' component={Buscar}/>
                <Route exact path='/bienes-raices/web/documentos' component={Documentos}/>
                <Route exact path='/bienes-raices/web/login' component={Login}/>
                <Route exact path='/bienes-raices/web/visor' component={Visor}/>
                <Route exact path='/bienes-raices/web/reportes' component={Reportes}/>
                <Route exact path='/bienes-raices/web/asignar' component={Asignar}/>
                
                <Route exact path="/bienes-raices/web/predio/:id" component={Predio} />
                <Route  component={() => <p>No funciona  </p>} />
            </Switch>
    </BrowserRouter>

    )


}

ReactDOM.render(<Tree/>, document.getElementById('pagina'));



function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
}
  
const images = importAll(require.context('../img/', false, /\.(png|jpg|svg)$/));