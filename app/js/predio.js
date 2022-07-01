import React, { Component, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import Estructura from './page'
import Pred from '../modulos/predio'
import Mapa from '../modulos/visor_individual'
import Documentos from '../modulos/documentos'
import { CustomizedTimeline, Flujo } from '../modulos/flujo'
import DetallePredio from '../modulos/detalle_predio'
import { servidorPost } from './request';

const Predio = () => {

    const [session, setSession] = useState({});

    useEffect(() => {
        const datosConsulta = {
            id_consulta: 'session'
        };

        servidorPost("/backend", datosConsulta).then((response) => {
            setSession(response.data[0])
        })
    }, [])



    return (
        <Estructura>
            <div id="popup" class="ol-popup">
                <a href="#" id="popup-closer" class="ol-popup-closer"></a>
                <div id="popup-content"></div>
            </div>
            <DetallePredio />
            {/* <CustomizedTimeline/> */}
            {/* <Flujo /> */}
            <Pred session={session}/>
            {/* <Mapa /> */}
            {/* <Documentos /> */}

        </Estructura>
    )


}
export default Predio;