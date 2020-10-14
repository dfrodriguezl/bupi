import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Estructura from './page'
import CargueDocumentos from '../modulos/cargue_expedientes'


const Documentos = () => {
    
    return (
        <Estructura>
            <CargueDocumentos/>
        </Estructura>
    )


}
export default Documentos;