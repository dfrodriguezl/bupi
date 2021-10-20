import React, { Fragment } from 'react';
import { Dialog, DialogTitle, Grid, Button } from '@material-ui/core';
import { useHistory  } from 'react-router';

const HomeDialogo = (props) => {
  const { open } = props;
  const history = useHistory();

  const handleClick = (tipo) => {
    if (tipo === "serv") {
      history.push("/servidumbres");
    }else if (tipo === "predios"){
      history.push("/");
    }
  }

  return (
    <Fragment>
      <Dialog open={open}>
        <DialogTitle>Seleccione la opción a la que requiere ingresar</DialogTitle>
        <Grid xs={12} container style={{ padding: 50 }} >
          <Grid xs={5} item container justify="center" className="label-input">
            <Button onClick={(e) => handleClick("predios")}>
              Predios
            </Button>
          </Grid>
          <Grid xs={1} />
          <Grid xs={5} item container justify="center" className="label-input">
            <Button>
              Servidumbres
            </Button>
          </Grid>
        </Grid>
      </Dialog>
    </Fragment>

  )
}

export default HomeDialogo;