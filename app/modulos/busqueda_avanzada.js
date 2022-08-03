import React, { useState, useEffect } from "react";
import { url, servidorPost } from '../js/request.js'
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import FiltroBusqueda from "./filtro_busqueda.js";
import MUIDataTable from "mui-datatables";

const columns = ["Código BUPI", "Departamento", "Municipio", "Matrícula inmobiliaria", "Tradente", "Territorial", "Titular", "Serial título", "Número predial nal",
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
  responsive: 'standard',
  onDownload: (buildHead, buildBody, columns, data) => {
    data.forEach((d) => {
      const object = d.data;
      const id = object[0].props.children;
      d.data[0] = id;

    })

    return "\uFEFF" + buildHead(columns) + buildBody(data);
  }
};

const BusquedaAvanzada = () => {

  const [listFiltros, setListFiltros] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [listFilteredOptions, setListFilteredOptions] = useState([]);
  const [components, setComponents] = useState([]);
  const [values, setValues] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [fechaIni, setFechaIni] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);


  useEffect(() => {
    const datos = {
      id_consulta: "get_parametros_busqueda"
    }

    servidorPost('/backend', datos).then((response) => {
      const filtros = response.data;
      setListFiltros(response.data);
      setIsLoading(false);
      setComponents({
        [filtros[0].id]: {}
      })
    });
  }, [])

  const onChangeHandle = (e, numFiltro) => {
    if (Object.keys(components).length > 1) {
      setComponents(prevState => ({
        ...prevState,
        [numFiltro]: {
          id: e.id,
          campo: e.campo,
          etiqueta: e.etiqueta,
          tipo: e.tipo,
          enum: e.enum
        }
      }))
    } else {
      setComponents({
        [numFiltro]: {
          id: e.id,
          campo: e.campo,
          etiqueta: e.etiqueta,
          tipo: e.tipo,
          enum: e.enum
        }
      })
    }


    setListFilteredOptions(prevState => ({
      ...prevState,
      [numFiltro]: e
    }))
  }

  const adicionarFiltro = (e) => {
    setComponents(prevState => ({
      ...prevState,
      [Object.keys(components).length]: {
        id: e.id,
        campo: e.campo,
        etiqueta: e.etiqueta,
        tipo: e.tipo,
        enum: e.enum
      }
    }))
  }

  const borrarFiltro = (e, pos) => {
    setComponents(prevState => {
      const state = { ...prevState };
      delete state[pos];
      return state;
    })

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
      if (valuesDef[k].tipo === "date_range") {
        const fecha_1 = "'" + fechaIni.getFullYear() + "-" + (parseInt(fechaIni.getMonth()) + 1) + "-" + fechaIni.getDate() + " 00:00:00'";
        const fecha_2 = "'" + fechaFin.getFullYear() + "-" + (parseInt(fechaFin.getMonth()) + 1) + "-" + fechaFin.getDate() + " 23:59:59'";
        key = key + " " + valuesDef[k].campo + " between " + fecha_1 + " and " + fecha_2 + " and ";
      } else {
        if (valuesDef[k].campo === "doc_num" || valuesDef[k].campo === "zona") {
          key = key + "" + valuesDef[k].campo + " like $" + valuesDef[k].campo + " and "
        } else {
          key = key + "lower(" + valuesDef[k].campo + ") like lower($" + valuesDef[k].campo + ") and "
        }
      }
    }

    key = key.replace(/and\s*$/, "");

    data.upd = key;
    data.id_consulta = "update_parametros_busqueda";
    servidorPost('/backend', data).then((response) => {
      const vals = response.data.map((v) => {
        let row = [<a href={"/predios/web/predio/" + v.id_expediente} target="_blank">{v.id_expediente}</a>,
        v.departamento, v.municipio, v.matricula_inmobiliaria, v.tradente, v.territorial, v.titular, v.serial_titulo, v.numero_predial_nacional,
        v.codigo_predial_anterior, v.modo_transporte, v.codigo_via, v.tramo, v.administrador];
        return row;
      }, []);
      setDataTable(vals);


    });
  }

  const updateValues = (e, numFiltro, tipo) => {
    const val = tipo === "text" ? e.target.value :
      tipo === "select" ? e.campo : null;
    setValues(prevState => ({
      ...prevState,
      [numFiltro]: val
    }))
  }

  return (
    <div id="seccion">
      <div id="titulo_seccion">Consulta avanzada</div>
      <p id="descripcion_seccion">Sección para la consulta avanzada de registros, aquí puede seleccionar uno o más filtros de acuerdo a su necesidad</p>
      <div className="formulario2">
        {/* {console.log("COMPONENTS", components)} */}
        {Object.keys(components).map((item, i) => (
          <div key={i}>
            <FiltroBusqueda onChangeHandle={onChangeHandle} isLoading={isLoading} listFiltros={listFiltros} campo={components[item].campo ? components[item].campo : ""}
              idx={i} borrarFiltro={borrarFiltro} updateValues={updateValues} tipo={components[item].tipo} domain={components[item].enum ? components[item].enum : null}
              setFechaIni={setFechaIni} setFechaFin={setFechaFin}/>
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
