import React, { useState } from "react";
import { servidorDocs } from "../../js/request";
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

const ExcelAll = ({ titulo, descripcion, data, reporte }) => {
  // Declara una nueva variable de estado, la cual llamaremos “count”
  const [show, setShow] = useState(false);



  const download = () => {
    setShow(true)
    servidorDocs('/todoreport/' + reporte).then(response => {
      setShow(false)
      toast.success("Reporte descargado exitosamente");
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

export default ExcelAll;