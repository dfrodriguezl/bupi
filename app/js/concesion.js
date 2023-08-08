import React, { Component, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import Estructura from './page'
import Conce from '../modulos/concesion'
import DetalleConcesion from '../modulos/detalle_concesion'
import { servidorPost } from './request';

const Concesion = () => {

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
            <DetalleConcesion />
            {/* <CustomizedTimeline/> */}
            {/* <Flujo /> */}
            <Conce session={session}/>
            {/* <Mapa /> */}
            {/* <Documentos /> */}

        </Estructura>
    )


}
export default Concesion;