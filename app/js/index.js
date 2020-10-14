
import '../css/styles.scss';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';


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
                <Route exact path='/bienes-raices' component={Home} />
                <Route exact path='/bienes-raices/buscar' component={Buscar}/>
                <Route exact path='/bienes-raices/documentos' component={Documentos}/>
                <Route exact path='/bienes-raices/login' component={Login}/>
                <Route exact path='/bienes-raices/visor' component={Visor}/>
                <Route exact path='/bienes-raices/reportes' component={Reportes}/>
                <Route exact path='/bienes-raices/asignar' component={Asignar}/>
                
                <Route exact path="/predio/:id" component={Predio} />
                <Route  component={() => <p>No funciona</p>} />
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