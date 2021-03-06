import React from 'react';
import ReactDOM from 'react-dom';

//notificaciones
import {servidorPost} from '../js/request.js'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import { getPermisos } from '../variables/permisos'
import { notificacion } from '../variables/notificaciones'

import Help from './help'



const Asignacion = () => {
  
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

  const sendRequest = (data) => {
    return servidorPost('/backend',data);
  }

const onChange=e=>{

  const yourFile = e.target.files[0]
  const formData = new FormData();
  formData.append('file', yourFile);

  servidorPost('/xls',formData).then((response) =>{
    const data = response.data;
    // console.log(data.json[0])
    if( typeof  data.json[0].codigo_bupi!="undefined"){
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
  
  // if (usuario_responsable != null) {
  
 
    envio();

    async function envio() {

      for (let i = 0; i < doc.length; i++){
        let expediente = doc[i].codigo_bupi;
        let tipo = doc[i].tipo;
        let usuario1 = doc[i].usuario1;
        let usuario2 = doc[i].usuario2;

        if(tipo.toLowerCase() === 'saneamiento'){
          const dataJur = {
            id_expediente: expediente,
            ruta: 14,
            usuario_jur: usuario1,
            usuario_cat: usuario2
          }
          notificacion(dataJur)

          const dataCerrar = {
            id_consulta: 'cerrar_tarea',
            id_expediente: expediente,
            ruta_close: [14]
          }

          servidorPost("/backend", dataCerrar).then((res) => {
            console.log("RESPONSE", res);
          })

        } else if(tipo.toLowerCase() === 'predio' ){
          //TO DO PREDIO
        }
      }


      // for (var i = 0; i < doc.length; i++){

      //   console.log(doc[i])
      //   let tec = doc[i].tec;
      //   let jur = doc[i].jur;
      //   let sup_tec = doc[i].sup_tec;
      //   let sup_jur = doc[i].sup_jur;
      //   let expediente = doc[i].id_expediente;

      //   let datos = {};
      //   datos.id_expediente = expediente;
      //   datos.id_consulta = 'insertar_asignacion_tecnico';

      //   if(tec != ''){
      //     let dataTec ={
      //       id_expediente: expediente,
      //       id_consulta: 'insertar_asignacion_tecnico',
      //       id_tarea: 2,
      //       usuario_responsable: doc[i].tec
      //     }
      //     sendRequest(dataTec);

      //     let dataNotTec = {
      //       id_expediente: expediente,
      //       id_consulta: 'update_notificacion',
      //       ruta: 1,
      //       usuario_responsable: doc[i].tec
      //     }
      //     sendRequest(dataNotTec);

      //     let dataNotTec2 = {
      //       id_expediente: expediente,
      //       id_consulta: 'update_notificacion',
      //       ruta: 7,
      //       usuario_responsable: doc[i].tec
      //     }
      //     sendRequest(dataNotTec2);
      //   }

      //   if(jur != ''){
      //     let dataJur ={
      //       id_expediente: expediente,
      //       id_consulta: 'insertar_asignacion_tecnico',
      //       id_tarea: 3,
      //       usuario_responsable: doc[i].jur
      //     }
      //     sendRequest(dataJur);

      //     let dataNotJur = {
      //       id_expediente: expediente,
      //       id_consulta: 'update_notificacion',
      //       ruta: 2,
      //       usuario_responsable: doc[i].jur
      //     }
      //     sendRequest(dataNotJur);

      //     let dataNotJur2 = {
      //       id_expediente: expediente,
      //       id_consulta: 'update_notificacion',
      //       ruta: 5,
      //       usuario_responsable: doc[i].jur
      //     }
      //     sendRequest(dataNotJur2);
      //   }

      //   if(sup_jur != ''){
      //     let dataSupJur ={
      //       id_expediente: expediente,
      //       id_consulta: 'insertar_asignacion_tecnico',
      //       id_tarea: 4,
      //       usuario_responsable: doc[i].sup_jur
      //     }
      //     sendRequest(dataSupJur);

      //     let dataNotSupJur = {
      //       id_expediente: expediente,
      //       id_consulta: 'update_notificacion',
      //       ruta: 4,
      //       usuario_responsable: doc[i].sup_jur
      //     }
      //     sendRequest(dataNotSupJur);
      //   }

      //   if(sup_tec != ''){
      //     let dataSupTec ={
      //       id_expediente: expediente,
      //       id_consulta: 'insertar_asignacion_tecnico',
      //       id_tarea: 5,
      //       usuario_responsable: doc[i].sup_tec
      //     }

      //     sendRequest(dataSupTec);

      //     let dataNotSupTec = {
      //       id_expediente: expediente,
      //       id_consulta: 'update_notificacion',
      //       ruta: 3,
      //       usuario_responsable: doc[i].sup_tec
      //     }
      //     sendRequest(dataNotSupTec);
      //   }
        
      //   // var datos={
      //   //   "id_expediente":doc[i].id_expediente,
      //   //   "ruta": 0,
      //   //   "usuario_responsable":usuario_responsable
      //   // }
      
      //   // notificacion(datos)




      // }

      toast.success("Registros asignados correctamente");
      
      setdoc([])

    }



}
// else{
//   toast.error("Seleccione un usuario ");
// }


  




const select=e=>{
  const resp=e.target.value;
  setResponsable(resp)
}

  return (
    <div id="seccion">
      <div id="titulo_seccion">Asignar masivamente</div>
      <p id="descripcion_seccion">En la siguiente sección, por favor seleccione el usuario al cual le asignará los registros y luego seleccione el archivo csv con la asignación.</p>
    

      {permiso ? <>
      
        <Help titulo="Modelo" doc='guia_asignar_masivo.csv' />

        {/* <br/> */}
      {/* <div>
      <select  onChange={select}>
      <option value="">Seleccione...</option>     
      {user.map((el,key) => (

          <option value={el.usuario_usuario} key={key}>{el.usuario_nombre} </option>

      ))}
        
      </select>
      </div> */}
        <div>
    
      </div>  
      <div >
          <label htmlFor="file1" className="label-input" >Seleccionar csv
          <input type="file" id="file1"onChange={onChange} className="input" /> 
          </label> 
      </div>

      <button type="button" className="primmary" onClick={asignar}>Asignar registros</button>

      <ToastContainer/>
   
    <p>Se asignarán: {Object.keys(doc).length} registros</p>
   
      {doc.map((item,key)=>
          <div className="col-12 mb-1" key={key}>
            <p> 📁{item.codigo_bupi}</p>
          </div>
        
      )
   }

    </>
      :<p className="no-permiso">No cuentas con permisos para usar esta herramienta</p>}
      
  </div>
  )
  }


export default Asignacion;





