import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Estructura from './page'
import Mapa from '../modulos/visor_general'
import Leyenda from '../modulos/leyenda'

const Visor = () => {
    
    return (
        <Estructura>
            <div id="popup" class="ol-popup">
                <a href="#" id="popup-closer" class="ol-popup-closer"></a>
                <div id="popup-content"></div>
            </div>
            <Mapa />
            <Leyenda/>
        </Estructura>
    )


}
export default Visor;