import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { useForm } from 'react-hook-form';

import {servidorPost} from './request'
import { Redirect } from 'react-router'

const Login=()=> {
  const { register, handleSubmit, errors } = useForm();
  const [ok, setOk] = React.useState(false);
  const [msg, setMsg] = React.useState(false);

  const onSubmit = data => {
    console.log(data)

    const post = async () => {
      data.id_consulta='get_usuario'
      const result = await servidorPost('/login', data)
      
      if (result.data.length > 0) {
        setOk(true)
      } else { 
        setMsg(true)
      }

    }
    post();
    

  };
  console.log(errors);
  
  return (
    <div id="login">
      {ok?<Redirect to="/bienes-raices/web"/>:''}
      <div id="contenido">
        <div className="crop">
        <img src="bienes-raices/img/login-header.png" alt=""/>

        </div>
        <h2>Inicio de sesión</h2>
        <p>Bienvenido al sistema de depuración predial de la dirección de bienes raices</p>
        <form onSubmit={handleSubmit(onSubmit)}>
        <p>Nombre de usuario</p>
        <input type="text" name="usuario_usuario" ref={register({ required: true, maxLength: 80 })} />
        <p>Clave</p>
        <input type="password" name="usuario_pwd" ref={register({required: true, maxLength: 100})} />
        {msg?<p>Revise sus credenciales de acceso</p>:''}
        <button type="submit" className="primmary">Iniciar sesión</button>
        </form>
      </div>
      </div>
  );
}
export default Login;