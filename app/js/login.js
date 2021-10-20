import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { useForm } from 'react-hook-form';

import { servidorPost } from './request'
import { Redirect } from 'react-router'
import HomeDialogo from '../modulos/componentes/HomeDialogo';

const Login = () => {
  const { register, handleSubmit, errors } = useForm();
  const [ok, setOk] = React.useState(false);
  const [msg, setMsg] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const onSubmit = data => {
    console.log(data)
    

    const post = async () => {
      data.id_consulta = 'get_usuario'
      const result = await servidorPost('/login', data)

      if (result.data.length > 0) {
        setOpen(true)
        // setOk(true)
      } else {
        setMsg(true)
      }

    }

    post();


  };
  console.log(errors);

  return (
    <div id="login">
      <HomeDialogo open={open} />
      {/* {ok ? <Redirect to="/" /> : ''} */}
      <div id="contenido">
        <div className="crop">
          <img src="bienes-raices/img/login-header.png" alt="" />
        </div>
        <h2>Módulo de Bienes Raíces</h2>
        <div className="azul">
          <img height="70px" width="256px" src="https://www.acueducto.com.co/wps/wcm/connect/EAB2/ea5fe4fc-5743-4624-b4f3-692ce17d5b15/logo-acueducto2.png?MOD=AJPERES&CACHEID=ROOTWORKSPACE.Z18_K862HG82NOTF70QEKDBLFL3000-ea5fe4fc-5743-4624-b4f3-692ce17d5b15-mZDJFQZ" alt="" />
        </div>
        <p>Bienvenido al módulo de bienes raíces</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <p>Nombre de usuario</p>
          <input type="text" name="usuario_usuario" ref={register({ required: true, maxLength: 80 })} />
          <p>Clave</p>
          <input type="password" name="usuario_pwd" ref={register({ required: true, maxLength: 100 })} />
          {msg ? <p>Revise sus credenciales de acceso</p> : ''}
          <button type="submit" className="primmary">Iniciar sesión</button>
        </form>
      </div>
    </div>
  );
}
export default Login;