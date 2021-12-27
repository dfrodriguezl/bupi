import { Grid } from '@material-ui/core';
import React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import { Link, useHistory } from 'react-router-dom';


const HomeConsulta = () => {

  const history = useHistory();

  const goToBusqueda = (e) => {
    history.push("/buscar");
  }
    
    return (
        
        <Grid container xs={12} style={{display: 'flex', alignContent: 'center', minHeight: '100%'}}>
          <Grid xs={1} />
          <Grid xs={5}>
            <h1>Módulo de bienes raices EAAB</h1>
            <p>Módulo que permite la consulta de los predios pertenecientes a la Empresa de Acueducto y Alcantarillado de Bogotá - EAAB</p>
            <div className="search">
                <input type="text" className="searchTerm" />
                <button className="searchButton primmary" onClick={goToBusqueda}>
                    <SearchIcon  />
                </button>
            </div>
            <p>Puede buscar predios con el id_expediente, identificador de proyecto, nombre de proyecto, chip catastral, número de matricula inmobiliaria, código catastral, barrio/vereda, UPZ ó dirección (se muestran 50 resultados)</p>
          </Grid>
          <Grid xs={1} />
          <Grid xs={5}>
            <img src="https://www.acueducto.com.co/wps/wcm/connect/EAB2/e583d935-8a3c-4dac-854e-871771e5e9a1/40473.jpg?MOD=AJPERES&CACHEID=ROOTWORKSPACE.Z18_K862HG82NOTF70QEKDBLFL3000-e583d935-8a3c-4dac-854e-871771e5e9a1-niSlIgX" alt="" style={{width: '100%', height: '100%', borderRadius: '10%'}}/>
          </Grid>
        </Grid>
    )
}

export default HomeConsulta;