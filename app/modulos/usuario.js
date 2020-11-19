import React,{ useRef }  from 'react';
import ReactDOM from 'react-dom';

//notificaciones
import {servidorPost} from '../js/request.js'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from 'react-hook-form';




const Usuario = () => {
  const { register, handleSubmit, errors,watch ,reset} = useForm();

  const password = useRef({});
  password.current = watch("new_clave", "");

  const onSubmit = data => {

    const post = async () => {

      data.id_consulta = 'validate_user'
      data.usuario_pwd = data.clave;
      const result = await servidorPost('/backend', data)
      
      console.log(result)

      if (result.data.length > 0) {

        var info = {
          usuario_pwd_new: data.new_clave,
          id_consulta:'update_clave'
        }
        

        servidorPost('/backend', info).then(response => {
          
          if (response.data.length > 0) {
            toast.success("La clave ha sido actualizada")
            reset()
            
          } else {
            toast.error("No fue posible el cambio de clave")
          }

        })


      } else { 

        toast.error("la clave actual ingresada no concuerda, no es posible cambiar de clave")
      }

    }
    post();


    console.log(data)
  };


  React.useEffect(() => {
      
    
  }, []);  






  return (
    <div id="seccion">
      <div id="titulo_seccion">Modificar datos personales</div>
      <p id="descripcion_seccion">En la siguiente sección, puede cambiar su clave de acceso.</p>
    
      <form onSubmit={handleSubmit(onSubmit)}>

      <div className="formulario">
        <p className="form_title">Clave actual</p>
          <input
            type="text"
            className='form_input'
            name="clave"
            ref={register({
              required: "Ingresa la clave actual",
            })} />
          {errors.clave && <p>{errors.clave.message}</p>}
      </div>
        
      <div className="formulario">
        <p className="form_title">Nueva clave</p>
          <input
            type="text"
            className='form_input'
            name="new_clave"
            ref={register({
              required: "Ingresa la clave",
              minLength: {
                value: 8,
                message: "Clave con mínimo 8 caracteres"
              }
            })} />
          {errors.new_clave && <p>{errors.new_clave.message}</p>}
      </div>
      <div className="formulario">
        <p className="form_title">Repetir nueva clave</p>
          <input
            type="text"
            className='form_input'
            name="new_clave_val"
            ref={register({
              validate: value =>
                value === password.current || "No concuerdan las claves"
            })} />
          {errors.new_clave_val && <p>{errors.new_clave_val.message}</p>}
      </div>
      <button type="submit" className='primmary' >Cambiar clave</button>
    </form>
    <ToastContainer /> 
  </div>
  )
  }

export default Usuario;





