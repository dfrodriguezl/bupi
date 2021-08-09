import React from 'react';
import ReactDOM from 'react-dom';

//notificaciones
import {servidorPost} from '../js/request.js'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import { getPermisos } from '../variables/permisos'
import { notificacion } from '../variables/notificaciones'

import Help from './help'



const Aprobacion = () => {
  
  const [doc, setdoc] = React.useState([]);
  const [user, setUser] = React.useState([]);
  const[juridico,setJuridico]=React.useState([]);
  
  const[responsable,setResponsable]=React.useState();
  
  const[permiso,setpermiso]=React.useState(false);



  React.useEffect(() => {
      var datos={"id_consulta":"get_usuarios_rol_tecnico",}
      servidorPost('/backend',datos).then((response) =>{
          const data = response.data;
          setUser(data)
      });
    
      var datos={"id_consulta":"get_usuarios_rol_juridico",}
      servidorPost('/backend',datos).then((response) =>{
          const data = response.data;
          setJuridico(data)
      });
     

      getPermisos().then((response) => {
        setpermiso(response.some(r=> [1,2].includes(r)))
    })
    
    
  }, []);  

const onChange = (e) =>{

  const yourFile = e.target.files[0]
  const formData = new FormData();
  formData.append('file', yourFile);

  servidorPost('/xls',formData).then((response) =>{
    const data = response.data;
    console.log(data.json[0])
    if( typeof  data.json[0].id_expediente!="undefined"){
      setdoc(data.json)
    }else{
      alert("Seleccione un documento csv válido")
      setdoc([])
    }
    
  });

}
const asignar=e=>{

  var usuario_asigna='dangarita';
  var usuario_responsable=responsable;
  
  if (usuario_responsable != null) {
  
 
    envio();

    async function envio() {


      for (var i = 0; i < doc.length; i++){
        
        var datos={
          "id_expediente":doc[i].id_expediente,
          "ruta": 0,
          "usuario_responsable":usuario_responsable
        }
      
        notificacion(datos)




      }

      toast.success("Expedientes asignados correctamente");
      
      setdoc([])

    }



}else{
  toast.error("Seleccione un usuario ");
}

}

const sendRequest = (data) => {
  return servidorPost('/backend',data);
}

const aprobar = (e) => {

    // var usuario_asigna='dangarita';
    // var usuario_responsable=responsable;
    
    // if (usuario_responsable != null) {

    // console.log(doc);
    // console.log(doc.length);

    for(var i = 0; i < doc.length; i++){
      let tec = doc[i].tec
      let jur = doc[i].jur
      let expediente = doc[i].id_expediente

      // let datos = {}
      // datos.id_expediente = expediente
      

      if(tec === "SI"){ 
        let datosTec = {
          id_expediente: expediente,
          id_consulta: "update_tareas_calidad_tecnico"
        }
        // datos.id_consulta = "update_tareas_calidad_tecnico"
        console.log(datosTec)
        sendRequest(datosTec).then((response) => {
          console.log(response)
          if(response.data.length > 0){
            let datosClose = {
              id_expediente: expediente,
              id_consulta: 'insert_calidad_tecnico',
              aprobado: 1,
              obs: 'APROBACIÓN MASIVA'
            }

            sendRequest(datosClose).then((res) => {
              toast.success("Expediente " + expediente + " aprobado técnico");
            })
          }
          
        })
      }

      if(jur === "SI"){
        let datosJur = {
          id_expediente: expediente,
          id_consulta: "update_tareas_calidad_juridico"
        }
        // datos.id_consulta = "update_tareas_calidad_juridico"
        console.log(datosJur)
        sendRequest(datosJur).then((response) => {
          console.log(response)
          if(response.data.length > 0){
            let datosClose = {
              id_expediente: expediente,
              id_consulta: 'insert_calidad_juridico',
              aprobado: 1,
              obs: 'APROBACIÓN MASIVA'
            }
            sendRequest(datosClose).then((res) => {
              toast.success("Expediente " + expediente + " aprobado jurídico");
            })
          }
          
        })

      }
    }
    
   
    //   envio();
  
    //   async function envio() {
  
  
    //     for (var i = 0; i < doc.length; i++){
          
    //       var datos={
    //         "id_expediente":doc[i].id_expediente,
    //         "ruta": 0,
    //         "usuario_responsable":usuario_responsable
    //       }
        
    //       notificacion(datos)
  
  
  
  
    //     }
  
    //     toast.success("Expedientes asignados correctamente");
        
    //     setdoc([])
  
    //   }
  
  
  
//   }else{
//     toast.error("Seleccione un usuario ");
//   }
  
  }

const select=e=>{
  const resp=e.target.value;
  setResponsable(resp)
}

  return (
    <div id="seccion">
      <div id="titulo_seccion">Aprobar masivamente</div>
      <p id="descripcion_seccion">En la siguiente sección, por favor seleccione el archivo csv con los expedientes a aprobar según la guia.</p>
    

      {permiso ? <>
      
        <Help titulo="Modelo" doc='guia_aprobacion_masiva.csv' />

        <br/>
      <div>
      {/* <select  onChange={select}>
      <option value="">Seleccione...</option>     
      {user.map((el,key) => (

          <option value={el.usuario_usuario} key={key}>{el.usuario_nombre} </option>

      ))}
        
      </select> */}
      </div>
        <div>
    
      </div>  
      <div >
          <label htmlFor="file1" className="label-input" >Selecionar csv
          <input type="file" id="file1"onChange={onChange} className="input" /> 
          </label> 
      </div>

      <button type="button" className="primmary" onClick={aprobar}>Aprobar expedientes</button>

      <ToastContainer/>
   
    {/* <p>Se asignarán: {Object.keys(doc).length} Expedientes</p>
   
      {doc.map((item,key)=>
          <div className="col-12 mb-1" key={key}>
            <p> 📁{item.id_expediente}</p>
          </div>
        
      )
   } */}

    </>
      :<p className="no-permiso">No cuentas con permisos para usar esta herramienta</p>}
      
  </div>
  )
  }


export default Aprobacion;





