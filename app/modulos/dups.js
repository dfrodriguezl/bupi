import React, { Fragment, useEffect, useState } from 'react';
import { servidorPost, servidorDocs } from '../js/request.js'
import Select from 'react-select';
import EditIcon from '@material-ui/icons/Edit';
import Popup from 'reactjs-popup';
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import XLSX from 'xlsx'
import MUIDataTable from 'mui-datatables'
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller } from "react-hook-form";
import date from 'date-and-time';


const Dups = () => {

    const [dupsList, setDupsList] = useState([]);
    const [rolesList, setRolesList] = useState([]);

    const { register, handleSubmit, control } = useForm();

    const getDups = () => {
        var datos = { "id_consulta": "get_dups_lista" }

        servidorPost('/backend', datos).then((response) => {
            setDupsList(response.data)
        });
    }



    useEffect(() => {
        getDups();
    }, [])

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

            />
        )
    };

    const clickDescarga = () => {
        let data = {
            id_consulta: "get_dups_lista"
        }

        servidorDocs('/excel', data).then(response => {
            console.log(response)
        })
    }

    const TablaValores = ({ values, roles }) => {

        const columns = ["Id proyecto", "Cod dup", "Fecha actaAdm", "Objet res.", "Nombre proyecto", "ActaAdm anteriores", "Observación", "Editar"];

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
            }
        };

        const vals = values.map((v) => {
            let row = [v.id_proyecto, v.cod_dup, v.fecha_actadm, v.objet_res, v.nom_proy, v.actadm_anteriores, v.observacion
                , <ModalForm open={<EditIcon />} valueEdit={v} register={register} handleSubmit={handleSubmit} ></ModalForm>
            ];
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
                        id_proyecto: d.id_proyecto,
                        cod_dup: d.cod_dup,
                        fecha_actadm: d.fecha_actadm,
                        objet_res: d.objet_res,
                        nom_proy: d.nom_proy,
                        actadm_anteriores: d.actadm_anteriores,
                        observacion: d.observacion
                    }

                    createValue(datos,"insert_valor_dup")
                })

                getDups()
            }

            reader.readAsBinaryString(f);

        }


        return (
            <Fragment>
                <div>
                    <ModalCreate open={<button style={{ display: "inline" }}>Crear DUP</button>} handleSubmit={handleSubmit} register={register}></ModalCreate>
                    <div className="upload_file" style={{display: "inline", float: 'right', marginRight: 10}}>
                        <div >
                            <label htmlFor="domains" className="label-input" >Actualizar dups masivo(xlsx)
                                <input type="file" id="domains" className="input" accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={upload}/> 
                            </label> 
                        </div>
                    </div>
                    <button style={{ display: "inline", float: 'right', marginRight: 10 }} onClick={clickDescarga}>Descargar dups (xlsx)</button>
                </div>
                <br />
                <MUIDataTable
                    title={"DUP's"}
                    data={vals}
                    columns={columns}
                    options={options}
                />
            </Fragment>


        )
    }

    const ModalForm = ({ open, valueEdit, register, handleSubmit }) => {


        const submitFormEdit = (datos) => {
            createValue(datos, "insert_valor_dup")
        }


        return (
            <Popup
                trigger={open}
                modal
            >
                <div className="modal">
                    <div id="seccion">
                        <div id="titulo_seccion">Editar dup</div>
                        <p id="descripcion_seccion">Editar</p>

                        <form className="form-container" onSubmit={handleSubmit(submitFormEdit)}>
                            <div className="formulario">
                                <p className="form_title">Id proyecto</p>
                                <input type="text"
                                    className='form_input'
                                    name="id_proyecto"
                                    defaultValue={valueEdit.id_proyecto}
                                    ref={register} />
                                <p className="form_title">Cod dup</p>
                                <input type="text"
                                    className='form_input'
                                    name="cod_dup"
                                    defaultValue={valueEdit.cod_dup}
                                    ref={register} />
                                <p className="form_title">Fecha acta adm</p>
                                <Controller
                                    control={control}
                                    as={DatePicker}
                                    name="fecha_actadm"
                                    selected={valueEdit.fecha_actadm ? date.parse(valueEdit.fecha_actadm, 'YYYY-MM-DD'): ''}
                                    defaultValue={valueEdit.fecha_actadm ? date.parse(valueEdit.fecha_actadm, 'YYYY-MM-DD'):''}
                                    onChange={([selected]) => selected}
                                    
                                />
                                <p className="form_title">Objet res</p>
                                <input type="text"
                                    className='form_input'
                                    name="objet_res"
                                    defaultValue={valueEdit.objet_res}
                                    ref={register} />
                                <p className="form_title">Nombre proyecto</p>
                                <input type="text"
                                    className='form_input'
                                    name="nom_proy"
                                    defaultValue={valueEdit.nom_proy}
                                    ref={register} />
                                <p className="form_title">Acta adm anteriores</p>
                                <input type="text"
                                    className='form_input'
                                    name="actadm_anteriores"
                                    defaultValue={valueEdit.actadm_anteriores}
                                    ref={register} />
                                <p className="form_title">Observación</p>
                                <input type="text"
                                    className='form_input'
                                    name="observacion"
                                    defaultValue={valueEdit.actadm_anteriores}
                                    ref={register} />
                                <button className='primmary' type="submit">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </Popup>
        )
    }

    const ModalCreate = ({ open, handleSubmit, register }) => {


        const submitFormCreate = (datos) => {
            createValue(datos, "insert_valor_dup")
        }


        return (
            <Popup
                trigger={open}
                modal
                nested
            >
                <div className="modal">
                    <div id="seccion">
                        <div id="titulo_seccion">Crear Dup</div>
                        <p id="descripcion_seccion">Ingrese los datos para crear un dup</p>

                        <form className="form-container" onSubmit={handleSubmit(submitFormCreate)} >
                            <div className="formulario">
                                <p className="form_title">Id proyecto</p>
                                <input type="text"
                                    className='form_input'
                                    name="id_proyecto"
                                    ref={register} />
                                <p className="form_title">Cod dup</p>
                                <input type="text"
                                    className='form_input'
                                    name="cod_dup"
                                    ref={register} />
                                <p className="form_title">Fecha acta adm</p>
                                <Controller
                                    control={control}
                                    as={DatePicker}
                                    name="fecha_actadm"
                                    ref={register}
                                />
                                <p className="form_title">Objet res</p>
                                <input type="text"
                                    className='form_input'
                                    name="objet_res"
                                    ref={register} />
                                <p className="form_title">Nombre proyecto</p>
                                <input type="text"
                                    className='form_input'
                                    name="nom_proy"
                                    ref={register} />
                                <p className="form_title">Acta adm anteriores</p>
                                <input type="text"
                                    className='form_input'
                                    name="actadm_anteriores"
                                    ref={register} />
                                <p className="form_title">Observación</p>
                                <input type="text"
                                    className='form_input'
                                    name="observacion"
                                    ref={register} />
                                <button className='primmary' type="submit">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </Popup>
        )
    }

    const createValue = (datos, consulta) => {

        var data = {
            "id_consulta": consulta,
            "id_proyecto": datos.id_proyecto,
            "cod_dup": datos.cod_dup,
            "fecha_actadm": datos.fecha_actadm ? datos.fecha_actadm: null,
            "objet_res": datos.objet_res,
            "nom_proy": datos.nom_proy,
            "actadm_anteriores": datos.actadm_anteriores,
            "observacion": datos.observacion
        }


        servidorPost('/backend', data).then((response) => {
            if (response.data.length > 0) {
                toast.success("Registro creado satisfactoriamente");
                getDups();
            } else {
                toast.error("Ya existe el registro")
            }
        })


    }

    return (
        <Fragment>
            <h3>Dups</h3>
            <p>A continuación puede editar o agregar dups</p>
            <div>
                <br />
                <TablaValores values={dupsList} roles={rolesList} />
            </div>
            <ToastContainer />
        </Fragment>
    )


}


export default Dups;