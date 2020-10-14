import React from 'react';
import ReactDOM from 'react-dom';


import { servidorPost } from '../js/request'

const Estadistica = (props) => {
  

  const [info, setInfo]=React.useState(0);


  React.useEffect(() => {
       
    var data={"id_consulta":props.consulta}

    servidorPost('/backend',data).then(function(response){
    
      var datos = response.data[0]
      
      console.log(datos)
      setInfo(datos)

  }).catch((error) => {
    servidor.redireccionar(error)
  });
    
    
}, []);



return(

  <div>
    <p className={`titulo ${ props.clase}`}>{props.titulo}</p>
    <p className={`valor ${ props.clase}`}> {info.estadistica}</p>
  </div>




  );

}

const Graficos = () => {
  
  return(
    <div className="estadistica">
      <Estadistica titulo="Número de predios" consulta="estadistica1" clase="green"/>
      <Estadistica titulo="Documentos en el sistema" consulta="estadistica2" clase="red"/>
      <Estadistica titulo="Predios aprobados técnico" consulta="estadistica3" clase="orange" />
      <Estadistica titulo="Transacciones en el sistema" consulta="estadistica4" clase="green"/>
    </div>

)

}

export default Graficos;
