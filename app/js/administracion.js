import React from 'react';

import Estructura from './page'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Dominios from '../modulos/dominios'
import Tipologias from '../modulos/tipologias'
import Usuarios from '../modulos/usuarios'
import Dups from '../modulos/dups'


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
                        <Tab>Usuarios</Tab>
                        <Tab>Dup's</Tab>
                    </TabList>
                    <TabPanel>
                        <Dominios/>
                    </TabPanel>
                    <TabPanel>
                        <Tipologias/>
                    </TabPanel>
                    <TabPanel>  
                        <Usuarios/>
                    </TabPanel>
                    <TabPanel>  
                        <Dups/>
                    </TabPanel>
                </Tabs>
            </div>      
        </Estructura>
    )

}
export default Administracion;