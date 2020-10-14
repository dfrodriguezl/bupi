import React from 'react';
import ReactDOM from 'react-dom';

//notificaciones
import {servidorPost} from '../js/request.js'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Asignacion = () => {
  
  const [doc, setdoc] = React.useState([]);
  const[user,setUser]=React.useState([]);
  const[responsable,setResponsable]=React.useState();

  React.useEffect(() => {
      var datos={"id_consulta":"get_usuarios_rol_tecnico",}
      servidorPost('/backend',datos).then((response) =>{
          const data = response.data;
          setUser(data)
      });
  }, []);  

const onChange=e=>{

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
          "id_consulta":"regresar_tarea",
          "id_expediente":doc[i].id_expediente,
          "codigo_tarea":1,
          "usuario_responsable":usuario_responsable,
          "estado": 1,
          "observaciones": "se asigna expediente",
          "codigo_grupo":1
        }
      
        var h=await servidorPost('/backend',datos).then(response =>{
          console.log(response)
        });
    

      }

   
      toast.success('Se han asignado '+doc.length+' Expedientes a '+usuario_responsable);
      setdoc([])

    }



}else{
  toast.error("Seleccione un usuario ");
}


  



}
const select=e=>{
  const resp=e.target.value;
  setResponsable(resp)
}


  return (
    <div id="seccion">
      <div id="titulo_seccion">Asignar masivamente</div>
      <p id="descripcion_seccion">En la siguiente sección, por favor seleccione el usuario al cual le asignará los expedientes y luego seleccione el archivo csv con la asignación.</p>
    
      <select  onChange={select}>
      <option value="">Seleccione...</option>     
      {user.map((el,key) => (

          <option value={el.usuario_usuario} key={key}>{el.usuario_nombre} </option>

        ))}
      </select>
      <div >
          <label htmlFor="file1" className="label-input" >Selecionar csv
          <input type="file" id="file1"onChange={onChange} className="input" /> 
          </label> 
      </div>

      <button type="button" className="primmary" onClick={asignar}>Asignar expedientes</button>

      <ToastContainer/>
   
    <p>Se asignarán: {Object.keys(doc).length} Expedientes</p>
   
      {doc.map((item,key)=>
          <div className="col-12 mb-1" key={key}>
            <p> 📁{item.id_expediente}</p>
          </div>
        
      )
   }

  </div>
  )
  }

export default Asignacion;





