import React from 'react';

import Estructura from './page'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Aprobacion from '../modulos/aprobacion'
import Tipologias from '../modulos/tipologias'


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
                    </TabList>
                    <TabPanel>
                    </TabPanel>
                    <TabPanel>
                        <Aprobacion></Aprobacion>
                    </TabPanel>
                </Tabs>
            </div>      
        </Estructura>
    )

}
export default Actualizacion;