import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { useForm } from 'react-hook-form';

import { servidorPost } from './request'
import { Redirect } from 'react-router'
import HomeDialogo from '../modulos/componentes/HomeDialogo';
import { Grid, Typography } from '@material-ui/core';

const Login = () => {
  const { register, handleSubmit, errors } = useForm();
  const [ok, setOk] = React.useState(false);
  const [msg, setMsg] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [user, setUser] = React.useState({})

  const onSubmit = data => {
    console.log(data)


    const post = async () => {
      data.id_consulta = 'get_usuario'
      const result = await servidorPost('/login', data)

      if (result.data.length > 0) {
        setOpen(true)
        setUser(result.data);
        setOk(true)
      } else {
        setMsg(true)
      }

    }

    post();


  };
  console.log(errors);

  return (
    <Grid container item style={{ height: '100vh' }}>
      <Grid xs={6} item style={{ alignSelf: 'center' }}>
        <img src="https://crucecordilleracentral.invias.gov.co/img/galeria/foto_01.jpg" alt="inicio" width="100%" />
      </Grid>
      <Grid xs={6} item container alignItems='center' alignContent='center' justify="center">
        {/* <div id="login">
          <div id="contenido"> */}
        <Grid item container direction="column" justify="center" alignContent='center'>
          <HomeDialogo open={open} user={user} />
          {ok ? <Redirect to="/" /> : ''}
          <Typography variant="h6">Registro y administración de bienes de uso público - BUPI</Typography>
          <Typography variant="subtitle1">Bienvenido</Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <p>Nombre de usuario</p>
            <input type="text" name="usuario_usuario" ref={register({ required: true, maxLength: 80 })} />
            <p>Clave</p>
            <input type="password" name="usuario_pwd" ref={register({ required: true, maxLength: 100 })} />
            {msg ? <p>Revise sus credenciales de acceso</p> : ''}
            <button type="submit" className="primmary">Iniciar sesión</button>
          </form>
          {/* <h2>BUPI</h2> */}
          {/* <p>Bienvenido a BUPI</p> */}

        </Grid>

        {/* </div>
        </div> */}
      </Grid>
    </Grid>
    // <div id="login">
    //   {/* <HomeDialogo open={open} user={user}/> */}
    //   {ok ? <Redirect to="/" /> : ''}

    //   <div id="contenido">
    //     <div className="crop">
    //       <img src="https://www.invias.gov.co/images/Photos/0011111ComunicadoCP.jpg" alt="" />
    //     </div>
    //     <h2>BUPI</h2>
    //     {/* <div className="azul">
    //       <img height="70px" width="256px" src="https://www.invias.gov.co/images/0logo.png" alt="" style={{paddingTop: 10}}/>
    //     </div> */}
    //     <p>Bienvenido a BUPI</p>
    //     <form onSubmit={handleSubmit(onSubmit)}>
    //       <p>Nombre de usuario</p>
    //       <input type="text" name="usuario_usuario" ref={register({ required: true, maxLength: 80 })} />
    //       <p>Clave</p>
    //       <input type="password" name="usuario_pwd" ref={register({ required: true, maxLength: 100 })} />
    //       {msg ? <p>Revise sus credenciales de acceso</p> : ''}
    //       <button type="submit" className="primmary">Iniciar sesión</button>
    //     </form>
    //   </div>
    // </div>
  );
}
export default Login;