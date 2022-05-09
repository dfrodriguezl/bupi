import React from 'react';
import ReactDOM from 'react-dom';
import { servidorPost, redireccionar } from '../js/request'
var moment = require('moment');
import { Link } from 'react-router-dom';
import { Modal } from './popup_tarea'
import SearchIcon from '@material-ui/icons/Search';
import { Grid } from '@material-ui/core';
moment.locale('es');

const Estadistica = (props) => {


  const [info, setInfo] = React.useState(0);


  React.useEffect(() => {

    var data = { "id_consulta": props.consulta }

    servidorPost('/backend', data).then(function (response) {

      var datos = response.data[0]

      console.log(datos)
      setInfo(datos)

    }).catch((error) => {
      redireccionar(error)
    });


  }, []);





  return (

    <div>
      <p className={`titulo ${props.clase}`}>{props.titulo}</p>
      <p className={`valor ${props.clase}`}> 0 </p>
      {/* <p className={`valor ${props.clase}`}> {info.estadistica}</p> */}
    </div>




  );

}

const Graficos = () => {

  const [data, setData] = React.useState([]);
  const [filtro, setFiltro] = React.useState([]);

  const [refresh, setRefresh] = React.useState(false);

  React.useEffect(() => {

    async function getTareas() {
      var datos = { "id_consulta": "get_tareas" }
      const result = await servidorPost('/backend', datos);

      // var datosSan = { "id_consulta": "get_tareas_saneamientos" };
      // const result2 = await servidor.servidorPost("/backend", datosSan);

      console.log(result)

      setData(result.data);
      setFiltro(result.data)
    }


    getTareas();

    // refresh_number(Math.random())


  }, [refresh]);

  const change = e => {
    console.log(e.target.value)

    console.log(data)
    const input = e.target.value;

    var result = data.filter(info => info.id_expediente.toUpperCase().includes(input.toUpperCase()))



    setFiltro(result);

  }

  const color = (fecha, ruta) => {

    const f_noti = moment.utc(fecha);

    const f_15 = ruta !== 13 ? moment().subtract(15, 'days') : moment().subtract(3, 'days');

    var msg = "";

    if (f_noti > f_15) {
      msg = "success"
    } else {
      const f_30 = ruta !== 13 ? moment().subtract(30, 'days') : moment().subtract(5, 'days');
      if (f_noti > f_30) {
        msg = "warning"
      } else {
        msg = "danger"
      }
    }



    return msg;
  }

  return (
    <>
      <div className="estadistica">
        {/* <Estadistica titulo="Expedientes escaneados" consulta="estadistica1" clase="green" />
        <Estadistica titulo="Documentos en el sistema" consulta="estadistica2" clase="red" />
        <Estadistica titulo="Predios aprobados técnico" consulta="estadistica3" clase="orange" />
        <Estadistica titulo="Transacciones en el sistema" consulta="estadistica4" clase="green" /> */}
        <h1>Inicio</h1>
        
        <Grid container direction="row">
          <Grid xs={4} container>
            <div id="tareas-inicio" style={{ display: 'inline-block' }}>
            <h2>Tareas</h2>
              <div id="listado">

                <div id="listado-header">
                  <h3>Tareas pendientes</h3>

                  <p>Puede filtrar el listado de tareas por código BUPI en la siguiente lista</p>

                  <div>
                    <input onChange={change} className="form-input" placeholder="Filtrar..."></input>
                  </div>
                </div>

                <div className="leyenda">
                  {/* {console.log("ITEM",item)} */}
                  <span className="bolita success"></span>
                  <p> menos de 15 días</p>
                  <span className="bolita warning"></span>
                  <p> entre 15 y 30 días</p>
                  <span className="bolita danger"></span>
                  <p> más de 30 días</p>
                </div>
                {filtro.map((item, index) =>
                  <div className={"grupo " + color(item.fecha_asignacion, item.ruta)}>
                    <p className="titulo" style={{ textAlign: 'left' }}>Registro predial: {!item.consecutivo ? item.id_expediente : item.id_expediente + " - Saneamiento " + item.consecutivo}</p>
                    <p>Fecha Asignación: {moment.utc(item.fecha_asignacion).format("dddd, MMMM D YYYY, h:mm:ss a")}</p>
                    <p>Enviado por: {item.usuario_nombre}</p>
                    <p>Descripción: {item.descripcion}</p>
                    <button>
                      {item.id_expediente.includes("S_") ?
                        <Link to={"/servidumbres/servidumbre/" + item.id_expediente}>
                          Ver servidumbre
                        </Link> :
                        <Link to={"/predio/" + item.id_expediente}>
                          Ver registro
                        </Link>
                      }

                    </button>

                    {item.ruta === 13 && item.tabla ?
                      <Modal
                        nombre={item.id_expediente}
                        id={item.id}
                        refresh={setRefresh}
                        tareacod={item.ruta}
                        tipo={item.tabla}
                        consecutivo={item.consecutivo} />
                      : null}

                    {item.ruta !== 13 ?
                      <Modal
                        nombre={item.id_expediente}
                        id={item.id}
                        refresh={setRefresh}
                        tareacod={item.ruta}
                        tipo={item.tabla}
                        consecutivo={item.consecutivo}
                      /> : null}

                  </div>
                )
                }
                {filtro.length == 0 ? <p>Sin resultados</p> : ''}
              </div>
            </div>
          </Grid>
          <Grid xs={8} container>
            <div id="estadisticas-inicio" style={{ display: 'inline-block' }}>
              <h2>Estadísticas</h2>
            </div>
          </Grid>
        </Grid>

        <br />
      </div>
      {/* <div className="estadistica">
        <Estadistica titulo="Predios aprobados Jurídico" consulta="estadistica5" clase="green" />
        <Estadistica titulo="Predios con saneamiento técnico" consulta="estadistica6" clase="red" />
        <Estadistica titulo="Predios con saneamiento jurídico" consulta="estadistica7" clase="orange" />
        {/* <Estadistica titulo="Predios con ZMPA" consulta="estadistica8" clase="green"/> 
      </div> */}
    </>
  )

}

export default Graficos;
