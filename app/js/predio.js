import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Estructura from './page'
import Pred from '../modulos/predio'
import Mapa from '../modulos/visor_individual'
import Documentos from '../modulos/documentos'


const Predio = () => {
    
    return (
        <Estructura>
            <Pred />
            <Mapa />
            <Documentos/>
        </Estructura>
    )


}
export default Predio;