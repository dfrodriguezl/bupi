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


const Usuarios = () => {

    const [usuariosList, setUsuariosList] = useState([]);
    const [rolesList, setRolesList] = useState([]);
    
    const { register, handleSubmit } = useForm();

    const getUsuarios = () => {
        var datos={"id_consulta":"get_usuarios_lista"}

        servidorPost('/backend',datos).then((response) =>{
            setUsuariosList(response.data)
        });
    }

    const getRoles = () => {
        var datos={"id_consulta":"get_roles_lista"}

        servidorPost('/backend',datos).then((response) =>{
            setRolesList(response.data)
            
        });
    }
    

    useEffect(() => {
        getUsuarios();
        getRoles();
    },[])

    const clickDescarga = () => {
        let data = {
          id_consulta: "get_usuarios_lista"
        }

        servidorDocs('/excel', data).then(response => {
            console.log(response)
        })
    }

    const TablaValores = ({values,roles}) => {

        const columns = ["Usuario","Rol","Nombres","Correo","Cargo","Contrato","Editar"];

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
            let row = [v.username,v.rol,v.nombre,v.correo,v.cargo,v.contrato
                ,<ModalForm open={<EditIcon/>} valueEdit={v} register={register} handleSubmit={handleSubmit} roles={roles}></ModalForm>
            ];
            return row;
        }, [])

        // const upload = e=> {
        
        //     const files = e.target.files
        //     let f = files[0];
        //     let reader = new FileReader();
        //     reader.onload = function(e){
        //         const bstr = e.target.result;
        //         const wb = XLSX.read(bstr,{type:'binary'});
        //         const wsname = wb.SheetNames[0];
        //         const ws = wb.Sheets[wsname];
        //         const data = XLSX.utils.sheet_to_json(ws,{header:0});
                
        //         data.map((d) => {
        //             const datos = {
        //                 cod_grupo: d.cod_grupo,
        //                 nombre: d.nombre,
        //                 componente: d.componente,
        //                 formato: d.formato,
        //                 responsable: d.responsable
        //             }

        //             createValue(datos,"insert_valor_tipologia")
        //         })

        //         getTipologias()
        //     }

        //     reader.readAsBinaryString(f);
    
        // }


        return (
            <Fragment>
                <div>
                    <ModalCreate open={<button style={{display: "inline"}}>Crear usuario</button>} roles={roles} handleSubmit={handleSubmit} register={register}></ModalCreate>
                        <button style={{display: "inline", float: 'right', marginRight: 10}} onClick={clickDescarga}>Descargar usuarios (xlsx)</button>
                </div>
                <br/>
                <MUIDataTable
                    title={"Usuarios"}
                    data={vals}
                    columns={columns}
                    options={options}
                />
            </Fragment>
            
            
        )
    }
    
    const ModalForm = ({open,valueEdit,register,handleSubmit,roles}) => {

        // console.log(roles)
        // console.log(valueEdit)
        const [rolSelected, setRolSelected] = useState(roles.filter((r) => r.id_rol === valueEdit.id_rol));
    
        const submitFormEdit = (datos) => { 
            createValue(datos,"insert_valor_usuario","ind",rolSelected.id_rol)
        }

        
    
        return (
            <Popup
            trigger={open}
            modal
          >
            <div className="modal">
                <div id="seccion">       
                    <div id="titulo_seccion">Editar usuario</div>
                    <p id="descripcion_seccion">Solo puede modificar los nombres, rol, correo, cargo y contrato</p>
                
                <form className="form-container" onSubmit={handleSubmit(submitFormEdit)}>
                    <div className="formulario">
                        <p className="form_title">Usuario</p>
                        <input type="text"
                            className='form_input'
                            name="usuario_usuario"
                            value={valueEdit.username}
                            disabled={true} 
                            ref={register}/>
                        <p className="form_title">Nombres</p>
                        <input type="text"
                            className='form_input'
                            name="usuario_nombre"
                            defaultValue={valueEdit.nombre} 
                            ref={register}/>
                        <p className="form_title">Rol</p>
                        <Select
                            className="basic-single"
                            classNamePrefix="select"
                            isSearchable={true}
                            name="usuario_rol"
                            options={roles}
                            getOptionLabel={(option) => option.descripcion}
                            getOptionValue={(option) => option.id_rol}
                            placeholder="Seleccione el rol..."
                            onChange={setRolSelected}
                            defaultValue={roles.filter((r) => r.id_rol === valueEdit.id_rol)}
                            
                        />
                        <p className="form_title">Correo</p>
                        <input type="text"
                            className='form_input'
                            name="usuario_correo"
                            defaultValue={valueEdit.correo} 
                            ref={register}/>
                        <p className="form_title">Cargo</p>
                        <input type="text"
                            className='form_input'
                            name="usuario_cargo"
                            defaultValue={valueEdit.cargo} 
                            ref={register}/>
                        <p className="form_title">Contrato</p>
                        <input type="text"
                            className='form_input'
                            name="usuario_contrato"
                            defaultValue={valueEdit.contrato} 
                            ref={register}/>
                        <button className='primmary' type="submit">Guardar</button>
                    </div>
                </form>
              </div>
              </div>
            </Popup>
        )
    }
    
    const ModalCreate = ({open,roles,handleSubmit,register}) => {
    
    
        const [rolSelected, setRolSelected] = useState([]);
        
        const submitFormCreate = (datos) => { 
            createValue(datos,"insert_valor_usuario","ind",rolSelected.id_rol)
        }
    
    
        return (
            <Popup
            trigger={open}
            modal
            nested
          >               
               <div className="modal">
               <div id="seccion">       
                   <div id="titulo_seccion">Crear usuario</div>
                   <p id="descripcion_seccion">Ingrese los datos para crear usuario</p>
               
               <form className="form-container" onSubmit={handleSubmit(submitFormCreate)} >
                   <div className="formulario">
                   <p className="form_title">Usuario</p>
                        <input type="text"
                            className='form_input'
                            name="usuario_usuario"
                            ref={register}/>
                        <p className="form_title">Nombres</p>
                        <input type="text"
                            className='form_input'
                            name="usuario_nombre"
                            ref={register}/>
                        <p className="form_title">Rol</p>
                        <Select
                            className="basic-single"
                            classNamePrefix="select"
                            isSearchable={true}
                            name="usuario_rol"
                            options={roles}
                            getOptionLabel={(option) => option.descripcion}
                            getOptionValue={(option) => option.id_rol}
                            placeholder="Seleccione el rol..."
                            onChange={setRolSelected}
                            value={rolSelected}
                        />
                        <p className="form_title">Correo</p>
                        <input type="text"
                            className='form_input'
                            name="usuario_correo"
                            ref={register}/>
                        <p className="form_title">Cargo</p>
                        <input type="text"
                            className='form_input'
                            name="usuario_cargo"
                            ref={register}/>
                        <p className="form_title">Contrato</p>
                        <input type="text"
                            className='form_input'
                            name="usuario_contrato"
                            ref={register}/>
                        <button className='primmary' type="submit">Guardar</button>
                    </div>                     
               </form>
             </div>
             </div>
            </Popup>
        )
    }

    const createValue = (datos,consulta,tipo, id_rol) => {
        
        var data = {
            "id_consulta": consulta,
            "usuario_usuario": datos.usuario_usuario,
            "usuario_nombre": datos.usuario_nombre,
            "usuario_rol":id_rol,
            "usuario_correo":datos.usuario_correo,
            "usuario_cargo":datos.usuario_cargo,
            "usuario_contrato":datos.usuario_contrato,
        }

     
        servidorPost('/backend', data).then((response) => { 
            if (response.data.length > 0) {
                toast.success("Registro creado satisfactoriamente");
                if(id_rol === 3){
                    console.log(response.data)
                    let dataAdmin = {
                        id_consulta: "insert_rol_admin",
                        id_usuario: response.data[0].usuario_id
                    }
                    
                    servidorPost('/backend', dataAdmin).then((response) => { 
                        console.log(response)
                    })
                }
                getUsuarios();
            }else{
                toast.error("Ya existe el registro")
            }
        })


    }
    
    return (
        <Fragment>
            <h3>Usuarios</h3>
            <p>A continuación puede editar o agregar usuarios</p>
            <div>
                <br/>
                <TablaValores values={usuariosList} roles={rolesList}/>
            </div>
            <ToastContainer/>
        </Fragment> 
    )


}


export default Usuarios;