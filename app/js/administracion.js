import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Estructura from './page'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Dominios from '../modulos/dominios'
import Pred from '../modulos/predio'
import Mapa from '../modulos/visor_individual'
import Documentos from '../modulos/documentos'
import {CustomizedTimeline} from '../modulos/flujo'
import DetallePredio from '../modulos/detalle_predio'

const Administracion = () => {

    const [index, setIndex] = React.useState(0)
    
    return (
        <Estructura>
            <div id="seccion">       
                <div id="titulo_seccion">Administración</div>
                <p id="descripcion_seccion">Sección para la administración del módulo de depuración predial</p>
            </div>
            <div id="seccion">  
                <Tabs onSelect={()=>setIndex(0)}>
                    <TabList>
                        <Tab>Dominios</Tab>
                        <Tab>Tipologías documentales</Tab>
                    </TabList>
                    <TabPanel>
                        <Dominios/>
                    </TabPanel>
                    <TabPanel>En construcción</TabPanel>
                </Tabs>
            </div>      
        </Estructura>
    )

}
export default Administracion;