import React from 'react';
import Popup from 'reactjs-popup';

import DeleteIcon from '@material-ui/icons/Delete';
import { servidorPost } from '../js/request'
import { ToastContainer, toast } from 'react-toastify';
import { notificacion } from '../variables/notificaciones'
import { notificacion_saneamientos } from '../variables/notificaciones_saneamientos';

const Modal = ({ nombre, id, refresh, tareacod, tipo, consecutivo }) => {

  const toastId = React.useRef(null);

  return (
    <>
      <Popup
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
              Se encuentra seguro de haber diligenciado el formulario para el expediente:  {nombre}
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

                    notificacion_saneamientos(data,tipo,consecutivo)


                    var datos = {
                      "id_expediente": nombre,
                      "ruta": tareacod,
                    }

                    notificacion_saneamientos(datos,tipo,consecutivo)
                  } else {
                    var data = {
                      "id": id,
                      "ruta": -1
                    }
                    notificacion(data)


                    var datos = {
                      "id_expediente": nombre,
                      "ruta": tareacod,
                    }
                    notificacion(datos)
                  }





                  /* 
                 toast.success("Tarea resuelta satisfactoriamente",{
                   toastId: id
                 })*/



                  close();



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
      </Popup>
      <ToastContainer />
    </>
  )

}


export { Modal }