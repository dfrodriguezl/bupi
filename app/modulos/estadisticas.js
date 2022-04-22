import React from 'react';
import ReactDOM from 'react-dom';


import { servidorPost, redireccionar } from '../js/request'

const Estadistica = (props) => {


  const [info, setInfo] = React.useState(0);


  React.useEffect(() => {

    var data = { "id_consulta": props.consulta }

    servidorPost('/backend', data).then(function (response) {

      var datos = response.data[0]

      console.log(datos)
      setInfo(datos)

    }).catch((error) => {
      redireccionar(error)
    });


  }, []);



  return (

    <div>
      <p className={`titulo ${props.clase}`}>{props.titulo}</p>
      <p className={`valor ${props.clase}`}> 0 </p>
      {/* <p className={`valor ${props.clase}`}> {info.estadistica}</p> */}
    </div>




  );

}

const Graficos = () => {

  return (
    <>
      <div className="estadistica">
        {/* <Estadistica titulo="Expedientes escaneados" consulta="estadistica1" clase="green" />
        <Estadistica titulo="Documentos en el sistema" consulta="estadistica2" clase="red" />
        <Estadistica titulo="Predios aprobados técnico" consulta="estadistica3" clase="orange" />
        <Estadistica titulo="Transacciones en el sistema" consulta="estadistica4" clase="green" /> */}
        <h1>Inicio</h1>
        <br />
        <h2>Tareas</h2>
      </div>
      {/* <div className="estadistica">
        <Estadistica titulo="Predios aprobados Jurídico" consulta="estadistica5" clase="green" />
        <Estadistica titulo="Predios con saneamiento técnico" consulta="estadistica6" clase="red" />
        <Estadistica titulo="Predios con saneamiento jurídico" consulta="estadistica7" clase="orange" />
        {/* <Estadistica titulo="Predios con ZMPA" consulta="estadistica8" clase="green"/> 
      </div> */}
    </>
  )

}

export default Graficos;
