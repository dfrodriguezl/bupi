import React, { Fragment } from 'react';
import { Dialog, DialogTitle, Grid, Button } from '@material-ui/core';
import { useHistory  } from 'react-router';

const HomeDialogo = (props) => {
  const { open, user } = props;
  const history = useHistory();

  const handleClick = (tipo) => {
    if (tipo === "serv") {
      history.push("/servidumbres/buscar");
    }else if (tipo === "predios"){
      console.log("USER", user)
      if(user[0].usuario_rol === 0){
        history.push("/consulta");
      }else{
        history.push("/");
      }
    }
  }

  return (
    <Fragment>
      <Dialog open={open}>
        <DialogTitle>Seleccione la opción a la que requiere ingresar</DialogTitle>
        <Grid xs={12} container style={{ padding: 50 }} >
          <Grid xs={5} item container justify="center" className="label-input">
            <Button onClick={() => handleClick("predios")}>
              Predios
            </Button>
          </Grid>
          <Grid xs={1} />
          <Grid xs={5} item container justify="center" className="label-input">
            <Button onClick={() => handleClick("serv")}>
              Servidumbres
            </Button>
          </Grid>
        </Grid>
      </Dialog>
    </Fragment>

  )
}

export default HomeDialogo;