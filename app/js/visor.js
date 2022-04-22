import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Estructura from './page'
import Mapa from '../modulos/visor_general'
import Leyenda from '../modulos/leyenda'
import variables from '../variables/var_mapa'

const Visor = () => {

    const [data, setData] = React.useState({variables});
    
    return (
        <Estructura>
            <div id="popup" class="ol-popup">
                <a href="#" id="popup-closer" class="ol-popup-closer"></a>
                <div id="popup-content"></div>
            </div>
            <Mapa />
            {/* <Leyenda data_leyenda={data.variables}/> */}
        </Estructura>
    )


}
export default Visor;