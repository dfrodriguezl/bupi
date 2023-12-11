import React, { Component } from 'react';

import Estructura from './page';
import { url } from '../js/request';
import DescriptionIcon from '@material-ui/icons/Description';

const Ayuda = () => {
    
    return (
        <Estructura>
            <div id="seccion">
                <div id="titulo_seccion">Recursos en linea</div>
                <p id="descripcion_seccion">En esta sección, puede encontrar los recursos disponibles para usuarios:</p>
                <ul class="HelpList">
                    <li class="HelpItem">
                        <a rel="noreferrer" title="Descarga de manual de usuario aplicación Web BUPI" alt="Descarga de manual de usuario" href={`${url}/help/manual_usuario.pdf`} target="_blank" class="HelpLink">
                            <DescriptionIcon />Manual de usuario Paso a Paso
                        </a>
                    </li>
                    <li class="HelpItem">
                        <a rel="noreferrer" title="Descarga de manual de usuario estructuración de predios" alt="Descarga manual de usuario estructuración de predios" href="/servicios/descarga-y-metadatos/descarga-divipola" target="_blank" class="HelpLink">
                            <DescriptionIcon />Manual de usuario estructuración de predios
                        </a>
                    </li>
                </ul>
            </div>
        </Estructura>
    )

}
export default Ayuda;