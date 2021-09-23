import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Estructura from './page'
import Pred from '../modulos/predio'
import Mapa from '../modulos/visor_individual'
import Documentos from '../modulos/documentos'
import { CustomizedTimeline, Flujo } from '../modulos/flujo'
import DetallePredio from '../modulos/detalle_predio'

const Predio = () => {

    return (
        <Estructura>
            <DetallePredio />
            {/* <CustomizedTimeline/> */}
            <Flujo />
            <Pred />
            <Mapa />
            <Documentos />
        </Estructura>
    )


}
export default Predio;