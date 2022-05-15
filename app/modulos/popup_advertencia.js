import React from "react";
import Popup from 'reactjs-popup'


const PopupAdvertencia = (props) => {
  const { open, getForm, active, tbl, descripcion } = props;

  return (
    <Popup
      trigger={open}
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
            ¿Ya guardo la información?
          </div>
          <div className="actions">
            <button
              className="button"
              onClick={() => {
                getForm(active, tbl, descripcion);
                close();
              }}
            >
              Si
            </button>
            <button
              className="button"
              onClick={close}
            >
              No
            </button>
          </div>
        </div>
      )}

    </Popup>
  )
}

export default PopupAdvertencia;