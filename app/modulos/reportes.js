import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import { url } from '../js/request'

import { servidorDocs, servidorDocs2, servidorPost } from '../js/request'

import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"


import LoadingMask from "react-loadingmask";
import "react-loadingmask/dist/react-loadingmask.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Excel({ titulo, descripcion, data, prevStep }) {
  // Declara una nueva variable de estado, la cual llamaremos “count”
  const [show, setShow] = useState(false);

  const prevStepFunction = () => {
    let data = {
      id_consulta: 'validacion_masiva'
    }

    return servidorPost("/backend", data);
  }



  const download = (data) => {
    setShow(true)

    if (prevStep) {
      prevStepFunction().then((r) => {
        servidorDocs('/excel', data).then(response => {
          setShow(false)
        })
      })
    } else {
      servidorDocs('/excel', data).then(response => {
        setShow(false)
      })
    }



  }



  return (
    <div>


      <div className="reporte">
        <p className="titulo">{titulo}</p>
        <p className="descripcion">{descripcion}</p>
        <button className="secondary" onClick={() => download(data)}>Descargar Reporte</button>
      </div>
      <div className="cargando">
        <Loader
          type="Watch"
          color="#00BFFF"
          height={30}
          width={30}
          timeout={0} //3 secs
          visible={show}
        />
      </div>


    </div>
  );
}



function ExcelAll({ titulo, descripcion, data, reporte }) {
  // Declara una nueva variable de estado, la cual llamaremos “count”
  const [show, setShow] = useState(false);



  const download = () => {
    setShow(true)
    servidorDocs('/todoreport/' + reporte).then(response => {
      setShow(false)
      toast.success("Reporte descargado exitosamente 2");
    }).catch(err => {
      setShow(false)
      toast.error("Error al descargar el reporte, vuelva a intentarlo más tarde");
    })


  }

  const download2 = () => {
    setShow(true)
    servidorDocs2('/excel_conciliacion').then(response => {
      setShow(false)
      toast.success("Conciliación descargada exitosamente");
      window.open(`${url}/help/conciliacion.xlsx`,'_blank')
    }).catch(err => {
      setShow(false)
      toast.error("Error al descargar el reporte, vuelva a intentarlo más tarde");
    })


  }

  const download2 = () => {
    setShow(true)
    servidorDocs2('/excel_conciliacion').then(response => {
      setShow(false)
      toast.success("Conciliación descargada exitosamente");
      window.open(`${url}/help/conciliacion.xlsx`,'_blank')
    }).catch(err => {
      setShow(false)
      toast.error("Error al descargar el reporte, vuelva a intentarlo más tarde");
    })
  }

  return (
    <div>
      <div className="reporte">
        <p className="titulo">{titulo}</p>
        <p className="descripcion">{descripcion}</p>
        <button className="primmary" onClick={() => download()}>Descargar Reporte</button>
        <button className="primmary" onClick={() => download2()}>Descargar Conciliación Contable</button>
      </div>
      <div className="cargando">
        <Loader
          type="Watch"
          color="#00BFFF"
          height={30}
          width={30}
          timeout={0} //3 secs
          visible={show}
        />
      </div>




    </div>
  );
}



const Report = () => {

  return (
    <div id="seccion">




      <div id="titulo_seccion">Descarga de reportes </div>
      <p id="descripcion_seccion">Sección para la descarga de los reportes del sistema.</p>


      <ExcelAll titulo="Reporte Completo" descripcion="Reporte completo del sistema" reporte="all" />

      {/* <ExcelAll titulo="Reporte Tributario" descripcion="Reporte de la información tributaria" reporte="tributaria" />

      <Excel titulo="Reporte validaciones" descripcion="Reporte completo de las validaciones realizadas por el sistema" data={{ 'id_consulta': 'reporte_validacion' }} prevStep={true} />

      <Excel titulo="Reporte componente documental" descripcion="Reporte completo del componente documental en el sistema" data={{ 'id_consulta': 'reporte_documental' }} />

      <Excel titulo="Reporte cargue documental" descripcion="Reporte completo de los usuarios documentales asociados a cada expediente" data={{ 'id_consulta': 'reporte_carga_documental' }} /> */}

      {/* <Excel titulo="Reporte total saneamientos" descripcion="Reporte completo de los estados de saneamientos" data={{ 'id_consulta': 'get_reporte_san' }} /> */}
      {/* <Excel titulo="Reporte Tareas" descripcion="Reporte completo de las tareas asignadas en el sistema" data={{ 'id_consulta': 'reporte_tareas' }} />
      <Excel titulo="Reporte Documentos" descripcion="Reporte completo de los documentos cargados al sistema" data={{ 'id_consulta': 'reporte_documentos' }} />
      <Excel titulo="Reporte General del proyecto" descripcion="Reporte completo relacionado a la información general del proyecto" data={{ 'id_consulta': 'reporte_info1' }} />

      <Excel titulo="Reporte General del predio" descripcion="Reporte completo relacionado a la información general del predio" data={{ 'id_consulta': 'reporte_info2' }} />

      <Excel titulo="Reporte General de áreas y usos" descripcion="Reporte completo relacionado a la información de áreas y usos" data={{ 'id_consulta': 'reporte_info3' }} />  

      <Excel titulo="Reporte General de avalúos" descripcion="Reporte completo relacionado a la información de avalúos" data={{ 'id_consulta': 'reporte_info4' }} />  

      <Excel titulo="Reporte General Jurídico" descripcion="Reporte completo relacionado a la información jurídica" data={{ 'id_consulta': 'reporte_info5' }} />  

      <Excel titulo="Reporte General propietario anterior" descripcion="Reporte completo relacionado a la información de los propietarios previos" data={{ 'id_consulta': 'reporte_info6' }} />  


      <Excel titulo="Reporte General propietario catastral" descripcion="Reporte completo relacionado a la información del propietario catastral" data={{ 'id_consulta': 'reporte_info7' }} />  

      <Excel titulo="Reporte General propietario Jurídico" descripcion="Reporte completo relacionado a la información del propietario según FMI" data={{ 'id_consulta': 'reporte_info8' }} />  

      <Excel titulo="Reporte General ZMPA" descripcion="Reporte completo relacionado a la información de la ZAMPA" data={{ 'id_consulta': 'reporte_info9' }} /> 

      
      <Excel titulo="Reporte General Infraestructura" descripcion="Reporte completo relacionado a la información de infraestructura" data={{ 'id_consulta': 'reporte_info10' }} /> 

      <Excel titulo="Reporte General estudios detallados" descripcion="Reporte completo relacionado a la información de estudios detallados" data={{ 'id_consulta': 'reporte_info11' }} /> 
      
      <Excel titulo="Reporte General control de calidad técnico" descripcion="Reporte completo relacionado a la aprobación técnica" data={{ 'id_consulta': 'reporte_info12' }} /> 

      <Excel titulo="Reporte General control de calidad jurídico" descripcion="Reporte completo relacionado a la aprobación jurídica" data={{ 'id_consulta': 'reporte_info13' }} /> 

      <Excel titulo="Reporte General saneamiento básico" descripcion="Reporte completo relacionado al saneamiento básico" data={{ 'id_consulta': 'reporte_info14' }} /> 

      <Excel titulo="Reporte General saneamiento jurídico" descripcion="Reporte completo relacionado al saneamiento jurídico" data={{ 'id_consulta': 'reporte_info15' }} /> 

      <Excel titulo="Reporte General municipios intersectados" descripcion="Reporte completo relacionado a los municipios que intersectán los predios" data={{ 'id_consulta': 'reporte_info18' }} />  */}

      <ToastContainer />

    </div>

  )

}


export default Report