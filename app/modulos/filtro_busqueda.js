import React, { Fragment, useState, useEffect } from "react";
import Select from 'react-select';
import CloseIcon from '@material-ui/icons/Close';
import { servidorPost } from "../js/request";
import ReactDatePicker from "react-datepicker";
import { useForm, Controller } from 'react-hook-form';

const FiltroBusqueda = (props) => {

  const { onChangeHandle, isLoading, listFiltros, campo, idx, borrarFiltro, updateValues, tipo, domain, setFechaIni, setFechaFin } = props;
  const [listaDominio, setListaDominio] = useState([]);
  const { control } = useForm();

  useEffect(() => {
    if (domain != null) {
      llenarDominio(campo)
    }

    function llenarDominio(field) {
      const datos = {
        id_consulta: 'get_enum',
        select: "select distinct " + field + " campo from busqueda_avanzada_resultado"
      };
  
      servidorPost('/backend', datos).then((response) => {
        const dominios = response.data;
        setListaDominio(dominios);
      });
    }
  }, [domain, campo])

  

  return (
    <Fragment>
      <div style={{ width: '30%', display: 'inline-block' }}>
        <Select
          className="basic-single"
          classNamePrefix="select"
          isLoading={isLoading}
          isSearchable={true}
          name="filtro"
          options={listFiltros}
          getOptionLabel={(option) => option.etiqueta}
          getOptionValue={(option) => option.campo}
          placeholder="Seleccione el filtro..."
          onChange={(e) => onChangeHandle(e, idx)}
          styles={{
            menu: base => ({
              ...base,
              zIndex: 9999
            })
          }}
        />
      </div>
      {/* {console.log("TIPO", tipo)} */}
      <div style={{ height: '100%', width: '40%', display: 'inline-block', marginLeft: 20, marginRight: 20 }}>
        {tipo === "text" ?
          <input type={tipo}
            className='form_input'
            name={campo}
            onChange={(e) => updateValues(e, idx, tipo)} /> :
          tipo === "select" ?
            <Select
              className="basic-single"
              classNamePrefix="select"
              isLoading={isLoading}
              isSearchable={true}
              name="filtro-filtro"
              options={listaDominio}
              getOptionLabel={(option) => option.campo}
              getOptionValue={(option) => option.campo}
              placeholder="Seleccione el dominio..."
              onChange={(e) => updateValues(e, idx, tipo)}
              styles={{
                menu: base => ({
                  ...base,
                  zIndex: 9999
                })
              }}
            /> :
            tipo === "date_range" ?
              <div style={{ width: '40%' }}>
                <div>
                  <p>Fecha inicial:</p>
                  <Controller
                    as={DatePicker}
                    control={control}
                    name="fecha_1"
                    onChange={([selected]) => {
                      setFechaIni(selected);
                      selected;
                    }}
                  />
                </div>
                <br />
                <div>
                  <p>Fecha final:</p>
                  <Controller
                    as={DatePicker}
                    control={control}
                    name="fecha_2"
                    suma={1}
                    onChange={
                      ([selected]) => {
                        setFechaFin(selected);
                        selected;
                      }

                    }
                  />
                </div>


              </div> :
              null}
      </div>
      {idx !== 0 ?
        <button className="butttonAdvancedSearch" style={{ display: 'inline-block', backgroundColor: 'red', borderColor: 'red' }} onClick={(e) => borrarFiltro(e, idx)}>
          <CloseIcon />
        </button> : null
      }
    </Fragment>
  );

}

const DatePicker = ({ selected, onChange, suma }) => {
  const [fecha, setDate] = useState(!suma ? new Date() : new Date().setDate(new Date().getDate() + suma));

  return (
    <ReactDatePicker
      className="form_input"
      selected={fecha}
      onChange={fecha => {
        setDate(fecha);
        onChange(fecha);
      }}
      dateFormat="yyyy-MM-dd"
      style={{ width: '20% !important' }}
    />
  )
};

export default FiltroBusqueda;