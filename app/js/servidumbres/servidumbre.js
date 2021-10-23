import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Estructura from '../page'
// import Pred from '../modulos/predio'
// import Mapa from '../modulos/visor_individual'
import Documentos from '../../modulos/documentos'
import {  FlujoServidumbre } from '../../modulos/servidumbres/flujo_servidumbre'
// import DetallePredio from '../modulos/detalle_predio'
import DetalleServidumbre from '../../modulos/servidumbres/detalle_servidumbre';
import Serv from '../../modulos/servidumbres/servidumbre';
import Mapa from '../../modulos/servidumbres/visor_individual_servidumbre';

const Servidumbre = () => {

    return (
        <Estructura>
            <div id="popup" class="ol-popup">
                <a href="#" id="popup-closer" class="ol-popup-closer"></a>
                <div id="popup-content"></div>
            </div>
            <DetalleServidumbre />
            <FlujoServidumbre />
            <Serv />
            <Mapa />
            <Documentos />
            {/* <CustomizedTimeline/> */}
            {/* <Flujo />
            <Pred />
            <Mapa /}
            <Documentos /> */}

        </Estructura>
    )


}
export default Servidumbre;