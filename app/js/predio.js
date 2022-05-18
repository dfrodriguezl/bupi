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
            <div id="popup" class="ol-popup">
                <a href="#" id="popup-closer" class="ol-popup-closer"></a>
                <div id="popup-content"></div>
            </div>
            <DetallePredio />
            {/* <CustomizedTimeline/> */}
            {/* <Flujo /> */}
            <Pred />
            {/* <Mapa /> */}
            <Documentos />

        </Estructura>
    )


}
export default Predio;