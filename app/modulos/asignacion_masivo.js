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
  const [calidad, setCalidad] = React.useState([]);
  const[juridico,setJuridico]=React.useState([]);
  
  const[responsable,setResponsable]=React.useState();
  
  const[permiso,setpermiso]=React.useState(false);



  React.useEffect(() => {
    var datos={"id_consulta":"get_usuarios_rol_tecnico",}
    servidorPost('/backend',datos).then((response) =>{
        const data = response.data;
        console.log(data)
        setUser(data)
    });

    const datosSupTec = { "id_consulta": "get_usuarios_rol", usuario_rol: "6" }
    servidorPost('/backend', datosSupTec).then((responseSupTec) => {
      if (responseSupTec.data) {
        setCalidad(responseSupTec.data)
      }
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

const asignacionAleatoria = (personal) => {

  const indiceAleatorio = Math.floor(Math.random() * personal.length);

  const usuarioAleatorio = personal[indiceAleatorio];

  // if (tipo == "tecnico") {
  //   setAleatorioT(usuarioAleatorio.usuario_usuario);
  // } else if (tipo == "sup_tec") {
  //   setAleatorioSt(usuarioAleatorio.usuario_usuario);
  // }

  console.log("usuarioAleatorio.usuario_usuario", usuarioAleatorio.usuario_usuario)

  return usuarioAleatorio.usuario_usuario;

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
        let usuarioTec;
        let usuarioCali;

        if (doc[i].usuario == "aleatorio") {
          usuarioTec = asignacionAleatoria(user);
          console.log(usuarioTec, "usuarioTec")
        } else {
          usuarioTec = doc[i].usuario;
        }

        if (doc[i].usuariocalidad == "aleatorio") {
          usuarioCali = asignacionAleatoria(calidad);
          console.log(usuarioCali, "usuarioCali")
        } else {
          usuarioCali = doc[i].usuariocalidad;
        }

        if(tipo.toLowerCase() === 'saneamiento'){
          const dataJur = {
            codigo_bupi: expediente,
            ruta: 14,
            usuario_jur: usuario1,
            usuario_cat: usuario2
          }
          notificacion(dataJur)

          const dataCerrar = {
            id_consulta: 'cerrar_tarea',
            codigo_bupi: expediente,
            ruta_close: [14]
          }

          servidorPost("/backend", dataCerrar).then((res) => {
            console.log("RESPONSE", res);
          })

        } else if(tipo.toLowerCase() === 'predio' ) { 
          console.log(doc[i].codigo_bupi, doc[i].usuario)

          const dataTec = {
            codigo_bupi: expediente,
            ruta: 100,
            usuario_tecnico: usuarioTec,
            usuario_calidad: usuarioCali
          }

          notificacion(dataTec);
          // const datosAsignacion = {
          //   "id_consulta": "insertar_asignacion_tecnico",
          //   codigo_bupi: doc[i].codigo_bupi,
          //   id_tarea: 1,
          //   usuario_responsable: doc[i].usuario
          // };

          //TO DO PREDIO
        }
      }


      // for (var i = 0; i < doc.length; i++){

      //   console.log(doc[i])
      //   let tec = doc[i].tec;
      //   let jur = doc[i].jur;
      //   let sup_tec = doc[i].sup_tec;
      //   let sup_jur = doc[i].sup_jur;
      //   let expediente = doc[i].codigo_bupi;

      //   let datos = {};
      //   datos.codigo_bupi = expediente;
      //   datos.id_consulta = 'insertar_asignacion_tecnico';

      //   if(tec != ''){
      //     let dataTec ={
      //       codigo_bupi: expediente,
      //       id_consulta: 'insertar_asignacion_tecnico',
      //       id_tarea: 2,
      //       usuario_responsable: doc[i].tec
      //     }
      //     sendRequest(dataTec);

      //     let dataNotTec = {
      //       codigo_bupi: expediente,
      //       id_consulta: 'update_notificacion',
      //       ruta: 1,
      //       usuario_responsable: doc[i].tec
      //     }
      //     sendRequest(dataNotTec);

      //     let dataNotTec2 = {
      //       codigo_bupi: expediente,
      //       id_consulta: 'update_notificacion',
      //       ruta: 7,
      //       usuario_responsable: doc[i].tec
      //     }
      //     sendRequest(dataNotTec2);
      //   }

      //   if(jur != ''){
      //     let dataJur ={
      //       codigo_bupi: expediente,
      //       id_consulta: 'insertar_asignacion_tecnico',
      //       id_tarea: 3,
      //       usuario_responsable: doc[i].jur
      //     }
      //     sendRequest(dataJur);

      //     let dataNotJur = {
      //       codigo_bupi: expediente,
      //       id_consulta: 'update_notificacion',
      //       ruta: 2,
      //       usuario_responsable: doc[i].jur
      //     }
      //     sendRequest(dataNotJur);

      //     let dataNotJur2 = {
      //       codigo_bupi: expediente,
      //       id_consulta: 'update_notificacion',
      //       ruta: 5,
      //       usuario_responsable: doc[i].jur
      //     }
      //     sendRequest(dataNotJur2);
      //   }

      //   if(sup_jur != ''){
      //     let dataSupJur ={
      //       codigo_bupi: expediente,
      //       id_consulta: 'insertar_asignacion_tecnico',
      //       id_tarea: 4,
      //       usuario_responsable: doc[i].sup_jur
      //     }
      //     sendRequest(dataSupJur);

      //     let dataNotSupJur = {
      //       codigo_bupi: expediente,
      //       id_consulta: 'update_notificacion',
      //       ruta: 4,
      //       usuario_responsable: doc[i].sup_jur
      //     }
      //     sendRequest(dataNotSupJur);
      //   }

      //   if(sup_tec != ''){
      //     let dataSupTec ={
      //       codigo_bupi: expediente,
      //       id_consulta: 'insertar_asignacion_tecnico',
      //       id_tarea: 5,
      //       usuario_responsable: doc[i].sup_tec
      //     }

      //     sendRequest(dataSupTec);

      //     let dataNotSupTec = {
      //       codigo_bupi: expediente,
      //       id_consulta: 'update_notificacion',
      //       ruta: 3,
      //       usuario_responsable: doc[i].sup_tec
      //     }
      //     sendRequest(dataNotSupTec);
      //   }
        
      //   // var datos={
      //   //   "codigo_bupi":doc[i].codigo_bupi,
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





