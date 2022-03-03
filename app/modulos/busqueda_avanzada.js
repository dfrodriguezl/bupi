import React, { useState, useEffect } from "react";
import { url, servidorPost } from '../js/request.js'
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import FiltroBusqueda from "./filtro_busqueda.js";
import MUIDataTable from "mui-datatables";

const columns = ["Expediente", "Departamento", "Municipio", "Matrícula inmobiliaria", "Tradente", "Territorial", "Titular", "Serial título", "Número predial nal",
  "Cód. predial ant.", "Modo trans.", "Vía", "Tramo", "Administrador"];

const options = {
  selectableRows: "none",
  textLabels: {
    body: {
      noMatch: 'No se encontraron resultados',
      toolTip: 'Ordenar',
    },
    pagination: {
      next: 'Siguiente pág.',
      previous: 'Pág. anterior',
      rowsPerPage: 'Filas por pág.:',
      displayRows: 'de',
      jumpToPage: 'Saltar a la pág.:',
    },
    toolbar: {
      search: 'Buscar',
      downloadCsv: 'Descargar CSV',
      print: 'Imprimir',
      viewColumns: 'Ver Columnas',
      filterTable: 'Filtrar Tabla',
    },
    filter: {
      all: 'Todo',
      title: 'FILTROS',
      reset: 'REINICIAR',
    },
    viewColumns: {
      title: 'Mostrar Columnas',
      titleAria: 'Mostrar/ocultar Columnas',
    },
    selectedRows: {
      text: 'fila(s) seleccionadas',
      delete: 'Borrar',
      deleteAria: 'Borrar filas seleccionadas',
    },
  },
  responsive: 'standard'
};

const BusquedaAvanzada = () => {

  const [listFiltros, setListFiltros] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [listFilteredOptions, setListFilteredOptions] = useState([]);
  const [components, setComponents] = useState([]);
  const [values, setValues] = useState([]);
  const [dataTable, setDataTable] = useState([]);


  useEffect(() => {
    const datos = {
      id_consulta: "get_parametros_busqueda"
    }

    servidorPost('/backend', datos).then((response) => {
      setListFiltros(response.data);
      setIsLoading(false);
      setComponents((components) => [...components, response.data[0]])
    });
  }, [])

  const onChangeHandle = (e, numFiltro) => {
    setListFilteredOptions(prevState => ({
      ...prevState,
      [numFiltro]: e
    }))
  }

  const adicionarFiltro = (e) => {
    setComponents((components) => [...components, e])
  }

  const borrarFiltro = (e, pos) => {
    const newList = components.filter((component, i) => i !== pos);
    setComponents(newList);

    let newFilteredOptions = listFilteredOptions;
    delete newFilteredOptions[pos];

    setListFilteredOptions(newFilteredOptions);

    let newValues = values;
    delete newValues[pos];

    setValues(newValues);

  }

  const buscar = (e) => {
    let data = {};
    let valuesDef = {};
    Object.keys(listFilteredOptions).forEach((key) => {
      valuesDef[key] = listFilteredOptions[key];
      valuesDef[key]["value"] = "%" + values[key] + "%";
      data[listFilteredOptions[key].campo] = "%" + values[key] + "%";
    })

    var key = ""
    for (var k in valuesDef) {
      if (valuesDef[k].campo === "doc_num" || valuesDef[k].campo === "zona") {
        key = key + "" + valuesDef[k].campo + " like $" + valuesDef[k].campo + " and "
      } else {
        key = key + "lower(" + valuesDef[k].campo + ") like lower($" + valuesDef[k].campo + ") and "
      }

    }

    key = key.replace(/and\s*$/, "");

    data.upd = key;
    data.id_consulta = "update_parametros_busqueda";
    servidorPost('/backend', data).then((response) => {
      const vals = response.data.map((v) => {
        let row = [<a href={"/bienes-raices/web/predio/" + v.id_expediente} target="_blank">{v.id_expediente}</a>,
        v.departamento, v.municipio, v.matricula_inmobiliaria, v.tradente, v.territorial, v.titular, v.serial_titulo, v.numero_predial_nacional,
        v.codigo_predial_anterior, v.modo_transporte, v.codigo_via, v.tramo, v.administrador];
        return row;
      }, []);
      setDataTable(vals);


    });
  }

  const updateValues = (e, numFiltro) => {
    const val = e.target.value;
    setValues(prevState => ({
      ...prevState,
      [numFiltro]: val
    }))
  }

  return (
    <div id="seccion">
      <div id="titulo_seccion">Búsqueda avanzada</div>
      <p id="descripcion_seccion">Sección para la búsqueda avanzada de predios, aquí puede seleccionar uno o más filtros de acuerdo a su necesidad</p>
      <div className="formulario2">
        {console.log("COMPONENTS", components)}
        {components.map((item, i) => (
          <div key={i}>
            <FiltroBusqueda onChangeHandle={onChangeHandle} isLoading={isLoading} listFiltros={listFiltros} campo={item.campo ? item.campo : ""}
              idx={i} borrarFiltro={borrarFiltro} updateValues={updateValues} tipo={item.tipo} />
          </div>
        ))}
      </div>
      <button className="butttonAdvancedSearch primmary" style={{ display: 'inline-block' }} onClick={adicionarFiltro}>
        <AddIcon />
      </button>
      <button className="butttonAdvancedSearch primmary" style={{ display: 'inline-block' }} onClick={buscar}>
        <SearchIcon />
      </button>
      <br />
      <div style={{ marginTop: 10 }}>
        <MUIDataTable
          title={"Resultados búsqueda avanzada"}
          data={dataTable}
          columns={columns}
          options={options}
        />
      </div>
    </div>
  );

}

export default BusquedaAvanzada;
