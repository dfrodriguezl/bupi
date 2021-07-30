import React, { Fragment, useEffect, useState} from 'react';
import { servidorPost } from '../js/request.js'
import Select from 'react-select';
import EditIcon from '@material-ui/icons/Edit';
import Popup from 'reactjs-popup';
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Dominios = () => {

    const [dominiosList, setDominiosList] = useState(["Seleccione el dominio..."]);
    const [isLoading, setIsLoading] = useState(true)
    const [dominio, setDominio] = useState("")
    const [valores, setValores] = useState([])
    const { register, handleSubmit } = useForm();

    useEffect(() => {
        const getDominios = () => {
            var datos={"id_consulta":"get_dominios"}

            servidorPost('/backend',datos).then((response) =>{
                setDominiosList(response.data)
                setIsLoading(false)
            });
        }


        getDominios();
    },[])

    const onChangeSelect = (e) => {
        let dom = e.dominio;
        setDominio(dom);
        getValores(dom);
    }

    const getValores = (domi) => {
        var datos={"id_consulta":"get_valores_dominios",dominio:domi}
        
        servidorPost('/backend',datos).then((response) =>{
            setValores(response.data)
        });
    }

    const TablaValores = ({values}) => {


        return (
            <Fragment>
                
                <ModalCreate open={<button>Crear valor</button>}></ModalCreate>
                <br/>
                <div id="documentos">            
                    <div className="item head" >
                        <p>Valor</p>
                        <p>Descripción</p>
                        <p>Actualizar</p>
                        </div>
                    {values.map((e,i) => (
                        <div className="item" key={e.id}>
                            <p>{e.valor}</p>
                            <p>{e.descripcion}</p>
                            <ModalForm open={<EditIcon/>} valor={e.valor} descripcion={e.descripcion} dominio={e.dominio}></ModalForm>
                        {/* <p>{e.usuario}</p>
                        <p>{e.fecha}</p>
                        <Modal  nombre={e.nombre} refresh={setRefresh}/>
                        <FindInPageIcon onClick={()=>download(e.id)}></FindInPageIcon> */}
                        </div>
                  ))}
                 </div>
            </Fragment>
            
            
        )
    }
    
    const ModalForm = ({open,valor,descripcion}) => {
    
        const submitFormEdit = (datos) => { 
            createValue(datos,"update_valor_dominios")
        }
    
        return (
            <Popup
            trigger={open}
            modal
          >
            <div className="modal">
                <div id="seccion">       
                    <div id="titulo_seccion">Editar dominio</div>
                    <p id="descripcion_seccion">Ingrese el valor y descripción</p>
                
                <form className="form-container" onSubmit={handleSubmit(submitFormEdit)}>
                    <div className="formulario">
                    <p className="form_title">Dominio</p>
                        <input type="text"
                            className='form_input'
                            name="dominio"
                            value={dominio}
                            disabled={true} 
                            ref={register}/>
                        <p className="form_title">Valor</p>
                        <input type="text"
                            className='form_input'
                            name="valor"
                            disabled={true} 
                            value={valor} 
                            ref={register}/>
                            <p className="form_title">Descripción</p>
                        <input type="text"
                            className='form_input'
                            name="descripcion"
                            defaultValue={descripcion} 
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
            createValue(datos,"insert_valor_dominios")
        }
    
    
        return (
            <Popup
            trigger={open}
            modal
            nested
          >               
               <div className="modal">
               <div id="seccion">       
                   <div id="titulo_seccion">Crear dominio</div>
                   <p id="descripcion_seccion">Ingrese el valor y descripción</p>
               
               <form className="form-container" onSubmit={handleSubmit(submitFormCreate)} >
                   <div className="formulario">
                   <p className="form_title">Dominio</p>
                       <input type="text"
                           className='form_input'
                           name="dominio"
                           value={dominio}
                           disabled={true} 
                           ref={register}/>
                       <p className="form_title">Valor</p>
                       <input type="text"
                           className='form_input'
                           name="valor" 
                           ref={register}
                           defaultValue=""/>
                           <p className="form_title">Descripción</p>
                       <input type="text"
                           className='form_input'
                           name="descripcion" 
                           ref={register}
                           defaultValue=""/>     
                   </div>
                    <button className='primmary' type="submit" >Guardar</button>
                   
               </form>
             </div>
             </div>
            </Popup>
        )
    }

    const createValue = (datos,consulta) => {
        
        console.log(datos)
        var data = {
            "id_consulta": consulta,
            "dominio": datos.dominio,
            "valor":datos.valor,
            "descripcion": datos.descripcion
        }

      
        servidorPost('/backend', data).then((response) => { 
            if (response.data.length > 0) {
                toast.success("Registro creado satisfactoriamente");
                getValores(datos.dominio)
            }else{
                toast.error("Ya existe el registro")
            }
        })


}
    
    return (
        <Fragment>
            <h3>Dominios</h3>
            <p>A continuación seleccione de la lista de dominios el que desea actualizar</p>
            <div>
                <Select
                    className="basic-single"
                    classNamePrefix="select"
                    isLoading={isLoading}
                    isSearchable={true}
                    name="dominio"
                    options={dominiosList}
                    getOptionLabel={(option) => option.dominio}
                    getOptionValue={(option) => option.dominio}
                    placeholder="Seleccione el dominio..."
                    onChange={onChangeSelect}
                />
                <br/>
                {dominio!=""?
                    <TablaValores values={valores}/>
                    :null}
            </div>
            <ToastContainer/>
        </Fragment> 
    )


}


export default Dominios;