import React, { Fragment, useState } from 'react';
import Popup from 'reactjs-popup';

import DeleteIcon from '@material-ui/icons/Delete';
import { servidorPost } from '../js/request'
import { ToastContainer, toast } from 'react-toastify';
import { notificacion } from '../variables/notificaciones'
import { notificacion_saneamientos } from '../variables/notificaciones_saneamientos';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

const Modal = ({ nombre, id, refresh, tareacod, tipo, consecutivo }) => {
  console.log("yeinerm", nombre, id, refresh, tareacod, tipo, consecutivo);

  const toastId = React.useRef(null);

  const [openValidacion, setOpenValidacion] = useState(false);
  const [listaValidacion, setListaValidacion] = useState([]);
  const [estadoValidacion, setEstadoValidacion] = useState(true);

  const generarValidaciones = (id_exp) => {

    const data = {
      id_consulta: 'validacion_expediente',
      codigo_bupi: id_exp
    };

    servidorPost("/backend", data).then((r) => {
      const dataGet = {
        id_consulta: 'get_validadores_expediente',
        codigo_bupi: id_exp
      }
      servidorPost('/backend', dataGet).then(response => {
        const lista = response.data;
        lista.map((l) => {
          if (!l.estado) {
            if (l.obligatorio) {
              setEstadoValidacion(false)
            }
          }
        })

        setListaValidacion(response.data)
        setOpenValidacion(true)
      })
    })
  }

  const pasarTareaExitosa = () => {
    var data = {
      "id": id,
      "ruta": -1
    }
    notificacion(data)


    var datos = {
      "codigo_bupi": nombre,
      "ruta": tareacod,
    }
    notificacion(datos)
  }

  return (
    <>
      {/* <ModalValidacion open={openValidacion} lista={listaValidacion} ref={ref} /> */}
      {!openValidacion ? <Popup
        trigger={<button>Finalizar actividad</button>}
        modal
        nested
      >
        {close => (
          <div className="modal">
            <button className="close" onClick={close}>
              &times;
            </button>
            <div className="header"> Confirmación </div>
            <div className="content">
              Se encuentra seguro de haber diligenciado el formulario para el registro predial:  {nombre}
            </div>
            <div className="actions">
              <button
                className="button"
                onClick={() => {


                  refresh(Math.random())

                  if (tipo === 39 || tipo === 40) {
                    var data = {
                      "id": id,
                      "ruta": -1
                    }

                    notificacion_saneamientos(data, tipo, consecutivo)


                    var datos = {
                      "codigo_bupi": nombre,
                      "ruta": tareacod,
                    }

                    notificacion_saneamientos(datos, tipo, consecutivo)
                    close();
                  } else {

                    if (tareacod === 1 || tareacod === 7) {
                      generarValidaciones(nombre)

                      // var data = {
                      //   "id": id,
                      //   "ruta": -1
                      // }
                      // notificacion(data)


                      // var datos = {
                      //   "codigo_bupi": nombre,
                      //   "ruta": tareacod,
                      // }
                      // notificacion(datos)
                    } else {
                      var data = {
                        "id": id,
                        "ruta": -1
                      }
                      notificacion(data)


                      var datos = {
                        "codigo_bupi": nombre,
                        "ruta": tareacod,
                      }
                      notificacion(datos)
                      close();
                    }


                  }





                  /* 
                 toast.success("Tarea resuelta satisfactoriamente",{
                   toastId: id
                 })*/







                }}

              >
                Si
              </button>
              <button
                className="button"
                onClick={() => {
                  console.log('modal closed ');
                  close();
                }}
              >
                No
              </button>
            </div>
          </div>

        )}
      </Popup> : <Popup
        trigger={<button>Finalizar actividad</button>}
        modal
        nested
      >
        {close => (<div className="modal" style={{ maxHeight: '400px', overflow: 'auto', width: '1000px' }}>
          <button className="close" onClick={close}>
            &times;
          </button>
          <div id="seccion">
            <div id="titulo_seccion">Resultados validación</div>
            <p id="descripcion_seccion">A continuación se listan los resultados de la validación para el registro predial {nombre}</p>
            <p style={{ color: 'red' }}>{!estadoValidacion ? "EXISTEN " + listaValidacion.length + " VALIDACIONES QUE NO HAN SIDO EXITOSAS, DEBE AJUSTARLAS PARA PASAR A CONTROL DE CALIDAD" : null}</p>
            <div id="documentos">
              <div className="item head" >
                <p>Campo</p>
                <p>Condición</p>
                <p style={{ textAlign: 'center' }}>Estado</p>
                <p style={{ textAlign: 'center' }}>Obligatorio</p>
              </div>
              {listaValidacion.map((v) => {
                return (
                  <Fragment>
                    <div className="item" key={v.id_condicion}>
                      <p>{v.campo}</p>
                      <p>{v.etiqueta}</p>
                      <p style={{ textAlign: 'center' }}> {v.estado ?
                        <CheckIcon style={{ color: '#07bc0c', fontSize: '1rem' }} /> :
                        <CloseIcon style={{ color: 'red', fontSize: '1rem' }} />}
                      </p>
                      <p style={{ textAlign: 'center' }}>{v.obligatorio ? "SI" : "NO"}</p>
                    </div>
                  </Fragment>
                )
              })}
              {estadoValidacion ? <button onClick={() => {
                pasarTareaExitosa();
                close();
              }}>Pasar a control de calidad</button> : null}
            </div>
          </div>
        </div>)}
      </Popup>}

      <ToastContainer />
    </>
  )

}


export { Modal }


