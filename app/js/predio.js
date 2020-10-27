import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Estructura from './page'
import Pred from '../modulos/predio'
import Mapa from '../modulos/visor_individual'
import Documentos from '../modulos/documentos'
import {Flujo} from '../modulos/flujo'

const Predio = () => {
    
    return (
        <Estructura>
            <Flujo/>
            <Pred />
            <Mapa />
            <Documentos/>
        </Estructura>
    )


}
export default Predio;