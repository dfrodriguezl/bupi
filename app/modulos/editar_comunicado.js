import React from "react";
import ReactDatePicker from "react-datepicker";
import { useForm, Controller } from "react-hook-form";
import Popup from 'reactjs-popup';
import { servidorPost } from "../js/request";

const EditarComunicado = (props) => {
  const { open, id_exp, index, consecutivo, tipo, setRefreshTabla } = props;
  const { register, handleSubmit, watch, errors, control, setValue } = useForm();

  const onSubmit = (datos) => {
    datos.id_consulta = tipo === "save" ? "insertar_comunicado" : "editar_comunicado";
    datos.tabla = index;
    servidorPost("/backend", datos).then((response) => {
      setRefreshTabla(true)
    })
  }

  const DatePicker = ({ selected, onChange }) => {
    const [fecha, setDate] = React.useState(selected);

    return (
        <ReactDatePicker
            className="form_input"
            selected={fecha}
            onChange={fecha => {
                setDate(fecha);
                onChange(fecha);
            }}
            dateFormat="yyyy-MM-dd"
            maxDate={new Date()}
        />
    )
};

  return (
    <Popup
      trigger={open}
      modal
      nested
    >
      {close => (
        <div className="modal" style={{ height: '400px', overflow: 'auto' }}>
          <div id="seccion" >
            <div id="titulo_seccion">Crear comunicado</div>
            <p id="descripcion_seccion">Diligencie los campos y de clic en guardar</p>
            <form onSubmit={handleSubmit(onSubmit)} className="form-container">
              <div className="formulario">
                <p className="form_title">Id expediente</p>
                <input type="text"
                  className='form_input'
                  name='id_expediente'
                  disabled
                  value={id_exp}
                  ref={register} />
              </div>
              <div className="formulario">
                <p className="form_title">Consecutivo saneamiento</p>
                <input type="text"
                  className='form_input'
                  name='consecutivo_saneamiento'
                  disabled
                  value={consecutivo}
                  ref={register} />
              </div>
              <div className="formulario">
                <p className="form_title">Fecha comunicado</p>
                <Controller
                  as={DatePicker}
                  control={control}
                  name="fecha_comunicado"
                />
              </div>
              <div className="formulario">
                <p className="form_title">Radicado INVIAS</p>
                <input type="text"
                  className='form_input'
                  name='radicado_invias_comunicado'
                  ref={register} />
              </div>
              <div className="formulario">
                <p className="form_title">Objeto</p>
                <input type="text"
                  className='form_input'
                  name='objeto_comunicado'
                  ref={register} />
              </div>
              <div className="formulario">
                <p className="form_title">Entidad</p>
                <input type="text"
                  className='form_input'
                  name='entidad_comunicado'
                  ref={register} />
              </div>
              <button className='primmary' type="submit" >Guardar</button>
            </form>
          </div>
        </div>
      )}

    </Popup>)


}

export default EditarComunicado;