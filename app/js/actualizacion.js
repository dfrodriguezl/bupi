import React from 'react';

import Estructura from './page'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Aprobacion from '../modulos/aprobacion'
import ActualizacionMasiva from '../modulos/actualizacion_masiva'
import CrearPredio from '../modulos/crear_nuevo';
import CrearPredioMasivo from '../modulos/crear_nuevo_masivo';
import CrearConcesion from '../modulos/crear_nueva_concesion';


const Actualizacion = () => {

    const [index, setIndex] = React.useState(0)
    
    return (
        <Estructura>
            <div id="seccion">       
                <div id="titulo_seccion">Actualización</div>
                <p id="descripcion_seccion">Sección para la actualización o aprobación masiva de expedientes</p>
            </div>
            <div id="seccion">  
                <Tabs onSelect={()=>setIndex(0)}>
                    <TabList>
                        <Tab>Actualización</Tab>
                        <Tab>Cambio de estados</Tab>
                        <Tab>Crear nuevo predio</Tab>
                        <Tab>Creación masiva de predios</Tab>
                        <Tab>Crear nueva concesión</Tab>
                    </TabList>
                    <TabPanel>
                        <ActualizacionMasiva />
                    </TabPanel>
                    <TabPanel>
                        <Aprobacion></Aprobacion>
                    </TabPanel>
                    <TabPanel>
                        <CrearPredio />
                    </TabPanel>
                    <TabPanel>
                        <CrearPredioMasivo />
                    </TabPanel>
                    <TabPanel>
                        <CrearConcesion />
                    </TabPanel>
                </Tabs>
            </div>      
        </Estructura>
    )

}
export default Actualizacion;