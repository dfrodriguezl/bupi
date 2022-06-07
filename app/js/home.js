import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Estructura from './page'
import  Info from '../modulos/estadisticas'
import  Graficos from '../modulos/graficos'


const Home = () => {
    
    return (
        <Estructura>
            <Info />
            {/* <Graficos/> */}
        </Estructura>
    )


}
export default Home;