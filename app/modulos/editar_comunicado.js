import React, { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { useForm, Controller } from "react-hook-form";
import Popup from 'reactjs-popup';
import { servidorPost } from "../js/request";
var moment = require('moment');
import date from 'date-and-time';
import ReactSelect from "react-select";

const EditarComunicado = (props) => {
  const { open, id_exp, index, consecutivo, tipo, setRefreshTabla, consecutivo_com, entregable, tipoSaneamiento } = props;
  const { register, handleSubmit, watch, errors, control, setValue } = useForm();
  const [datosForm, setDatosForm] = useState({})
  const [listEntregables, setListEntregables] = useState([]);
  const [entregableSeleccionado, setEntregableSeleccionado] = useState();
  const [campos, setCampos] = useState([]);

  useEffect(() => {

    const dataDomain = {
      id_consulta: "get_valores_dominios",
      dominio: 'DOM_ENTREGABLE'
    }

    const dataEntregable = {
      id_consulta: "get_entregables_saneamiento",
      id_saneamiento: tipoSaneamiento
    }

    servidorPost("/backend", dataDomain).then((response) => {
      servidorPost("/backend", dataEntregable).then((responseEntregable) => {
        const dataFiltrada = response.data.filter((o) => responseEntregable.data.filter((re) => re.id_entregable === o.valor).length > 0);
        console.log("DATA FILTRADA", dataFiltrada)
        setListEntregables(dataFiltrada)
        if (entregable) {
          setEntregableSeleccionado(dataFiltrada.filter((o) => Number(o.valor) === Number(entregable))[0]);
        }
      })
    });

    if (tipo === "update") {
      const consulta = {
        id_consulta: "get_comunicado",
        id_expediente: id_exp,
        consecutivo: consecutivo,
        consecutivo_com: consecutivo_com,
        tabla: index
      }

      servidorPost("/backend", consulta).then((response) => {
        let data = response.data[0];
        setDatosForm(data)
      })
    }

    if (entregable) {
      actualizarCampos(entregable)

    }


  }, [tipoSaneamiento, entregable, setListEntregables, setDatosForm, setEntregableSeleccionado])

  const onChangeEntregable = (e) => {
    setEntregableSeleccionado(e);
    actualizarCampos(e.valor)
  }

  const actualizarCampos = (entregable) => {
    const dataCampos = {
      id_consulta: "get_campos_entregable",
      id_entregable: entregable
    }

    servidorPost("/backend", dataCampos).then((response) => {
      setCampos(response.data)
    })

  }

  const onSubmit = (datos) => {

    datos.id_consulta = tipo === "save" ? "insertar_comunicado" : "editar_comunicado";
    datos.tabla = index;
    datos.id_expediente = id_exp;
    datos.consecutivo_saneamiento = consecutivo;
    datos.entregable = entregableSeleccionado.valor;
    datos.consecutivo_comunicado = consecutivo_com ? consecutivo_com : undefined;
    datos.observacion = datos.observacion || "";
    datos.tipo_respuesta = datos.tipo_respuesta.value || "";
    datos.fecha_comunicado = datos.fecha_comunicado || null;
    datos.radicado_invias_comunicado = datos.radicado_invias_comunicado || "";
    datos.objeto_comunicado = datos.objeto_comunicado || "";
    datos.entidad_comunicado = datos.entidad_comunicado || "";
    datos.saneamiento = tipoSaneamiento;

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
        <div className="modal" style={{ height: '400px', overflow: 'auto', width: '50vw' }}>
          <button className="close" onClick={close}>
            &times;
          </button>
          <div id="seccion" >
            <div id="titulo_seccion">Crear entregable</div>
            <p id="descripcion_seccion">Diligencie los campos y de clic en guardar</p>
            <form onSubmit={handleSubmit(onSubmit)} className="form-container">
              <div className="formulario">
                <p className="form_title">Código BUPI</p>
                <input type="text"
                  className='form_input'
                  name='id_expediente'
                  disabled
                  defaultValue={id_exp}
                  ref={register} />
              </div>
              <div className="formulario">
                <p className="form_title">Consecutivo saneamiento</p>
                <input type="text"
                  className='form_input'
                  name='consecutivo_saneamiento'
                  disabled

                  defaultValue={consecutivo}
                  ref={register} />
              </div>
              {tipo === "update" ?
                <div className="formulario">
                  <p className="form_title">Consecutivo comunicado</p>
                  <input type="text"
                    className='form_input'
                    name='consecutivo_comunicado'
                    disabled
                    defaultValue={consecutivo_com ? consecutivo_com : null}
                    ref={register} />
                </div> : null}
              <div className="formulario">
                <p className="form_title">Entregable</p>
                <Controller
                  name='entregable'
                  control={control}
                  defaultValue={listEntregables.filter((o) => Number(o.valor) === Number(entregable))}
                  render={(props) =>
                    <ReactSelect onChange={(e) => {
                      props.onChange(e);
                      onChangeEntregable(e);
                      // change(e, i.doc);
                    }}
                      options={listEntregables}
                      name={props.name}
                      isClearable={true}
                      defaultValue={props.value}
                      getOptionValue={(o) => o.valor}
                      getOptionLabel={(o) => o.descripcion}
                      value={props.value}
                      styles={{
                        menu: (base) => {

                        }
                      }}
                    />
                  }
                />
              </div>
              {campos ?
                campos.map((a) =>
                  <div className="formulario">
                    <p className="form_title">{a.label}</p>
                    {a.form === 'texto' ?
                      <input type="text"
                        className='form_input'
                        name={a.field}
                        defaultValue={datosForm[a.field] && tipo === "update" ? datosForm[a.field] : undefined}
                        ref={register({
                          required: a.required ? a.message : undefined,
                          pattern: {
                            value: a.patron ? /^SS-.*$/ : undefined,
                            message: a.patron ? "Debe cumplir con SS-" : undefined
                          }
                        })} /> :
                      a.form === 'fecha' ?
                        <Controller
                          render={(props) =>
                            <DatePicker
                              selected={props.value}
                              onChange={props.onChange}
                              defaultValue={props.value}
                            />
                          }
                          control={control}
                          name={a.field}
                          defaultValue={(datosForm[a.field] ? date.parse(datosForm[a.field], 'YYYY-MM-DD') : '')}
                          rules={{
                            required: a.required ? a.message : undefined,
                          }}
                        /> :
                        a.form === 'area' ?
                          <textarea
                            className='form_input'
                            name={a.field}
                            defaultValue={(datosForm[a.field] ? date.parse(datosForm[a.field], 'YYYY-MM-DD') : '')}
                            ref={register({
                              required: a.required ? a.message : undefined,
                            })}
                            rows="4"
                          />
                          : 
                        a.form === 'select' ? 
                        <Controller
                        name={a.field}
                        control={control}
                        defaultValue={a.enum.filter((o) => Number(o.value) === Number(datosForm[a.field]))}
                        render={(props) =>
                          <ReactSelect onChange={(e) => {
                            props.onChange(e);
                            // onChangeEntregable(e);
                            // change(e, i.doc);
                          }}
                            options={a.enum}
                            name={props.name}
                            isClearable={true}
                            defaultValue={props.value}
                            getOptionValue={(o) => o.value}
                            getOptionLabel={(o) => o.label}
                            value={props.value}
                            styles={{
                              menu: (base) => {
      
                              }
                            }}
                          />
                        }
                        rules={{
                          required: a.required ? a.message : undefined,
                        }}
                      />
                        : null}
                    {errors[a.field] && <span className="msg-error">{errors[a.field].message}</span>}
                  </div>
                ) : null}

              {/* <div className="formulario">
                <p className="form_title">Fecha radicado</p>
                <Controller
                  as={DatePicker}
                  control={control}
                  name="fecha_comunicado"
                  defaultValue={(datosForm.fecha_comunicado ? date.parse(datosForm.fecha_comunicado, 'YYYY-MM-DD') : '')}
                  selected={(datosForm.fecha_comunicado ? date.parse(datosForm.fecha_comunicado, 'YYYY-MM-DD') : '')}
                  onChange={([selected]) => selected}
                />
              </div>
              <div className="formulario">
                <p className="form_title">Radicado</p>
                <input type="text"
                  className='form_input'
                  name='radicado_invias_comunicado'
                  defaultValue={datosForm.radicado_invias_comunicado && tipo === "update" ? datosForm.radicado_invias_comunicado : undefined}
                  ref={register} />
              </div>
              <div className="formulario">
                <p className="form_title">Tema solicitud</p>
                <input type="text"
                  className='form_input'
                  name='objeto_comunicado'
                  defaultValue={datosForm.objeto_comunicado && tipo === "update" ? datosForm.objeto_comunicado : undefined}
                  ref={register} />
              </div>
              <div className="formulario">
                <p className="form_title">Dirigido a</p>
                <input type="text"
                  className='form_input'
                  name='entidad_comunicado'
                  defaultValue={datosForm.entidad_comunicado && tipo === "update" ? datosForm.entidad_comunicado : undefined}
                  ref={register} />
              </div> */}
              <button className='primmary' type="submit" >Guardar</button>
            </form>
          </div>
        </div>
      )}

    </Popup>)


}

export default EditarComunicado;