import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { useForm } from 'react-hook-form';

import { servidorPost } from './request'
import { Redirect } from 'react-router'
import HomeDialogo from '../modulos/componentes/HomeDialogo';
import { Grid, Typography, Link } from '@material-ui/core';

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
    <Grid container item>
      <Grid container xs={12} >
        <Grid item container xs={12} className="contenedor-superior">
          <Link href="https://www.gov.co/" target="_blank" rel="noreferrer">
            <img src="https://www.invias.gov.co/images/logotipos/gov.png" alt="logo gobierno de colombia" />
          </Link>
        </Grid>
        <Grid container className="container-images">
          <Grid item xs={6}>
          <Link href="https://www.invias.gov.co/" target="_blank" rel="noreferrer">
            <img src="https://www.invias.gov.co/images/0logo.png" alt="logo invias" />
          </Link> 
          </Grid>
          <Grid item xs={6}>
          <Link href="https://www.mintransporte.gov.co/" target="_blank" rel="noreferrer">
          <img src="https://www.invias.gov.co/images/nuevo_pais.png" alt="logo ministerio de transporte" />
          </Link>
            
          </Grid>
        </Grid>
        <Grid container className="login-container">
          <Grid xs={6} item style={{ alignSelf: 'center' }}>
            <img src="https://crucecordilleracentral.invias.gov.co/img/galeria/foto_01.jpg" alt="inicio" width="100%" />
          </Grid>
          <Grid xs={6} item container alignItems='center' alignContent='center' justify="center">
            <Grid item container direction="column" justify="center" alignContent='center' style={{paddingLeft: 50, paddingRight: 50}}>
              <HomeDialogo open={open} user={user} />
              {ok ? <Redirect to="/" /> : ''}
              <h1 className="texto-azul">Registro y Administración de Predios de Uso Público - BUPI</h1>
              <h2 className="texto-azul">Bienvenido</h2>
              {/* <Typography variant="h6">Registro y Administración de Predios de Uso Público - BUPI</Typography> */}
              {/* <Typography variant="subtitle1">Bienvenido</Typography> */}
              <form onSubmit={handleSubmit(onSubmit)}>
                <h3>Nombre de usuario</h3>
                <input type="text" name="usuario_usuario" ref={register({ required: true, maxLength: 80 })} />
                <h3>Contraseña</h3>
                <input type="password" name="usuario_pwd" ref={register({ required: true, maxLength: 100 })} />
                {msg ? <p>Revise sus credenciales de acceso</p> : ''}
                <br />
                <button type="submit" className="primmary">Iniciar sesión</button>
              </form>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
export default Login;