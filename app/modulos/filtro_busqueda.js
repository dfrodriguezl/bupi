import React, { Fragment } from "react";
import Select from 'react-select';
import CloseIcon from '@material-ui/icons/Close';

const FiltroBusqueda = (props) => {

  const { onChangeHandle, isLoading, listFiltros, campo, idx, borrarFiltro, updateValues, tipo } = props;

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
      {console.log("TIPO", tipo)}
      <div style={{ height: '100%', width: '40%', display: 'inline-block', marginLeft: 20 }}>
        <input type={tipo}
          className='form_input'
          name={campo}
          onChange={(e) => updateValues(e, idx)} />
      </div>
      {idx !== 0 ?
        <button className="butttonAdvancedSearch" style={{ display: 'inline-block', backgroundColor: 'red', borderColor: 'red' }} onClick={(e) => borrarFiltro(e, idx)}>
          <CloseIcon />
        </button> : null
      }
    </Fragment>
  );

}

export default FiltroBusqueda;