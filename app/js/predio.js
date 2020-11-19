import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Estructura from './page'
import Pred from '../modulos/predio'
import Mapa from '../modulos/visor_individual'
import Documentos from '../modulos/documentos'
import {CustomizedTimeline} from '../modulos/flujo'

const Predio = () => {
    
    return (
        <Estructura>
            <CustomizedTimeline/>
            <Pred />
            <Mapa />
            <Documentos/>
        </Estructura>
    )


}
export default Predio;