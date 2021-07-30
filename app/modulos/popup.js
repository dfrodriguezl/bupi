import React from 'react';
import Popup from 'reactjs-popup';

import DeleteIcon from '@material-ui/icons/Delete';
import {servidorPost} from '../js/request'
import { ToastContainer, toast } from 'react-toastify';

const Modal = ({nombre,refresh}) => {
       

    const borrar = ()=> ()=>{
        close();

        servidorPost('/delete/' + nombre).then((response) => {
            // console.log(response)

            if (response.status) {

                toast.success("Documento borrado");
                refresh(nombre)
            }
        })

        


    }

    return (
        <Popup
        trigger={<DeleteIcon/>}
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
                        Se encuentra seguro de eliminar el documento: {nombre}
            </div>
            <div className="actions">
            <button
                className="button"
                onClick={borrar()}
                
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

)

}


export {Modal}