import React from 'react';
import Popup from 'reactjs-popup';

import DeleteIcon from '@material-ui/icons/Delete';
import { servidorPost } from '../../js/request'
import { toast } from 'react-toastify';


const ModalDelete = (props) => {
  const { id_expediente, consec_san, consec_com, tabla,  setRefreshTabla } = props;

  const borrar = () => {
    // close();

    const consulta = {
      id_consulta: "delete_comunicado",
      id_expediente: id_expediente,
      consecutivo_saneamiento: consec_san,
      consecutivo_comunicado: consec_com,
      tabla: tabla
    }

    servidorPost('/backend', consulta).then((response) => {
      // console.log("RESPONSE DELETE", response);

      if (response.status) {
        setRefreshTabla(true);
        toast.success("Comunicado borrado");
        // refresh(nombre)
      }
    })




  }

  return (
    <Popup
      trigger={<DeleteIcon />}
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
            Se encuentra seguro de eliminar el comunicado?
          </div>
          <div className="actions">
            <button
              className="button"
              onClick={
                () => {
                  borrar();
                  close();
                }}
              // onClick={borrar()}

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


export default ModalDelete;