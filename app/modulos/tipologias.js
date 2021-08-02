import React, { Fragment, useEffect, useState} from 'react';
import { servidorPost, servidorDocs } from '../js/request.js'
import Select from 'react-select';
import EditIcon from '@material-ui/icons/Edit';
import Popup from 'reactjs-popup';
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import XLSX from 'xlsx'
import MUIDataTable from 'mui-datatables'


const Tipologias = () => {

    const [tipologiasList, setTipologiasList] = useState(["Seleccione el dominio..."]);
    const [isLoading, setIsLoading] = useState(true)
    const [dominio, setDominio] = useState("")
    const [valores, setValores] = useState([])
    const { register, handleSubmit } = useForm();

    const getTipologias = () => {
        var datos={"id_consulta":"get_tipologias"}

        servidorPost('/backend',datos).then((response) =>{
            setTipologiasList(response.data)
            setIsLoading(false)
        });
    }

    useEffect(() => {
        getTipologias();
    },[])

    const clickDescarga = () => {
        let data = {
          id_consulta: "reporte_tipologias"
        }

        servidorDocs('/excel', data).then(response => {
            console.log(response)
        })
    }

    const getValores = (domi) => {
        var datos={"id_consulta":"get_valores_dominios",dominio:domi}
        
        servidorPost('/backend',datos).then((response) =>{
            setValores(response.data)
        });
    }

    const TablaValores = ({values}) => {

        const columns = ["Cód grupo","Nombre","Componente","Formato","Responsable","Editar"];

        const options = {
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
            }
        };

        const vals = values.map((v) => {
            let row = [v.cod_grupo,v.nombre,v.componente,v.formato,v.responsable,<ModalForm open={<EditIcon/>} valueEdit={v} register={register} handleSubmit={handleSubmit}></ModalForm>];
            return row;
        }, [])

        const upload = e=> {
        
            const files = e.target.files
            let f = files[0];
            let reader = new FileReader();
            reader.onload = function(e){
                const bstr = e.target.result;
                const wb = XLSX.read(bstr,{type:'binary'});
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws,{header:0});
                
                data.map((d) => {
                    const datos = {
                        cod_grupo: d.cod_grupo,
                        nombre: d.nombre,
                        componente: d.componente,
                        formato: d.formato,
                        responsable: d.responsable
                    }

                    createValue(datos,"insert_valor_tipologia")
                })

                getTipologias()
            }

            reader.readAsBinaryString(f);
    
        }


        return (
            <Fragment>
                <div>
                    <ModalCreate open={<button style={{display: "inline"}}>Crear valor</button>}></ModalCreate>
                    <div className="upload_file" style={{display: "inline", float: 'right', marginRight: 10}}>
                        <div >
                            <label htmlFor="domains" className="label-input" >Actualizar dominios masivo (xlsx)
                                <input type="file" id="domains" className="input" accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={upload}/> 
                            </label> 
                        </div>
                    </div>
                    <button style={{display: "inline", float: 'right', marginRight: 10}} onClick={clickDescarga}>Descargar valores (xlsx)
                        <input type="file" id="file_domains"  className="input" /> 
                    </button>
                </div>
                <br/>
                <MUIDataTable
                    title={"Tipologías documentales"}
                    data={vals}
                    columns={columns}
                    options={options}
                />
            </Fragment>
            
            
        )
    }
    
    const ModalForm = ({open,valueEdit,register,handleSubmit}) => {
    
        const submitFormEdit = (datos) => { 
            createValue(datos,"insert_valor_tipologia","ind")
        }
    
        return (
            <Popup
            trigger={open}
            modal
          >
            <div className="modal">
                <div id="seccion">       
                    <div id="titulo_seccion">Editar tipología</div>
                    <p id="descripcion_seccion">Solo puede modificar el nombre, componente, formato y responsable</p>
                
                <form className="form-container" onSubmit={handleSubmit(submitFormEdit)}>
                    <div className="formulario">
                        <p className="form_title">Código</p>
                        <input type="text"
                            className='form_input'
                            name="cod_grupo"
                            value={valueEdit.cod_grupo}
                            disabled={true} 
                            ref={register}/>
                        <p className="form_title">Nombre</p>
                        <input type="text"
                            className='form_input'
                            name="nombre"
                            defaultValue={valueEdit.nombre} 
                            ref={register}/>
                        <p className="form_title">Componente</p>
                        <input type="text"
                            className='form_input'
                            name="componente"
                            defaultValue={valueEdit.componente} 
                            ref={register}/>
                        <p className="form_title">Formato</p>
                        <input type="text"
                            className='form_input'
                            name="formato"
                            defaultValue={valueEdit.formato} 
                            ref={register}/>
                        <p className="form_title">Responsable</p>
                        <input type="text"
                            className='form_input'
                            name="responsable"
                            defaultValue={valueEdit.responsable} 
                            ref={register}/>
                        <button className='primmary' type="submit">Guardar</button>
                    </div>
                </form>
              </div>
              </div>
            </Popup>
        )
    }
    
    const ModalCreate = ({open}) => {
    
    
        
        const submitFormCreate = (datos) => { 
            createValue(datos,"insert_valor_tipologia","ind")
        }
    
    
        return (
            <Popup
            trigger={open}
            modal
            nested
          >               
               <div className="modal">
               <div id="seccion">       
                   <div id="titulo_seccion">Crear tipología</div>
                   <p id="descripcion_seccion">Ingrese los datos de la nueva tipología</p>
               
               <form className="form-container" onSubmit={handleSubmit(submitFormCreate)} >
                   <div className="formulario">
                        <p className="form_title">Código</p>
                        <input type="text"
                            className='form_input'
                            name="cod_grupo"
                            ref={register}/>
                        <p className="form_title">Nombre</p>
                        <input type="text"
                            className='form_input'
                            name="nombre"
                            ref={register}/>
                        <p className="form_title">Componente</p>
                        <input type="text"
                            className='form_input'
                            name="componente"
                            ref={register}/>
                        <p className="form_title">Formato</p>
                        <input type="text"
                            className='form_input'
                            name="formato"
                            ref={register}/>
                        <p className="form_title">Responsable</p>
                        <input type="text"
                            className='form_input'
                            name="responsable"
                            ref={register}/>
                        <button className='primmary' type="submit">Guardar</button>
                    </div>                     
               </form>
             </div>
             </div>
            </Popup>
        )
    }

    const createValue = (datos,consulta,tipo) => {
        
        // console.log(datos)
        var data = {
            "id_consulta": consulta,
            "cod_grupo": datos.cod_grupo,
            "nombre":datos.nombre,
            "componente": datos.componente,
            "formato": datos.formato,
            "responsable": datos.responsable
        }

      
        servidorPost('/backend', data).then((response) => { 
            if (response.data.length > 0) {
                toast.success("Registro creado satisfactoriamente");
                getTipologias();
            }else{
                toast.error("Ya existe el registro")
            }
        })


}
    
    return (
        <Fragment>
            <h3>Tipologías documentales</h3>
            <p>A continuación puede editar o agregar tipologías documentales</p>
            <div>
                <br/>
                <TablaValores values={tipologiasList} />
            </div>
            <ToastContainer/>
        </Fragment> 
    )


}


export default Tipologias;