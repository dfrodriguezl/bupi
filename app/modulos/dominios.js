import React, { Fragment, useEffect, useState} from 'react';
import { servidorPost, servidorDocs } from '../js/request.js'
import Select from 'react-select';
import EditIcon from '@material-ui/icons/Edit';
import Popup from 'reactjs-popup';
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import XLSX from 'xlsx'


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

  const clickDescarga = () => {
      let data = {
          id_consulta: "reporte_dominios",
          dominio: dominio
      }

    servidorDocs('/excel', data).then(response => {
        console.log(response)
    })
  }

    const onChangeSelect = (e) => {
        console.log(e)
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

    const TablaValores = ({values,domi}) => {

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
                // console.log(data);
                data.map((d) => {
                    const datos = {
                        dominio: d.dominio,
                        valor: d.valor,
                        descripcion: d.descripcion
                    }

                    createValue(datos,"insert_valor_dominios")
                    // console.log(d)
                })

                getValores(domi)
                // servidorPost('/backend',)
            }

            reader.readAsBinaryString(f);
            // setFilename(id + '-' + cod+'.pdf')
    
            // const formData = new FormData()
        
            // formData.append("file",files[0],id + '-' + cod+'.pdf')
    
            // servidorPost('/upload/' + id+'-'+cod, formData).then((response) => {
            //     console.log(response)
            //     if (response.status==200) {
            //         toast.success("Documento cargado al sistema: " + titulo);
            //         setRefresh(!refresh)
            //     } else {
            //         toast.error("Problema al cargar documento");
                    
            //     }
            // })
    
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
                <div id="documentos">            
                    <div className="item head" >
                        <p>Valor</p>
                        <p>Descripción</p>
                        <p>Actualizar</p>
                        </div>
                    {values.map((e,i) => (
                        <div className="item" key={i}>
                            <p>{e.valor}</p>
                            <p>{e.descripcion}</p>
                            <ModalForm open={<EditIcon/>} valor={e.valor} descripcion={e.descripcion} dominio={e.dominio}></ModalForm>
                        </div>
                  ))}
                 </div>
            </Fragment>
            
            
        )
    }
    
    const ModalForm = ({open,valor,descripcion}) => {
    
        const submitFormEdit = (datos) => {
            console.log 
            createValue(datos,"insert_valor_dominios","ind")
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
                            {...register('dominio')}/>
                        <p className="form_title">Valor</p>
                        <input type="text"
                            className='form_input'
                            name="valor"
                            disabled={true} 
                            value={valor} 
                            {...register('valor')}/>
                            <p className="form_title">Descripción</p>
                        <input type="text"
                            className='form_input'
                            name="descripcion"
                            defaultValue={descripcion} 
                            {...register('descripcion')}/>
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
            createValue(datos,"insert_valor_dominios","ind")
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
                           {...register('dominio')}/>
                       <p className="form_title">Valor</p>
                       <input type="text"
                           className='form_input'
                           name="valor" 
                           {...register('valor')}
                           defaultValue=""/>
                           <p className="form_title">Descripción</p>
                       <input type="text"
                           className='form_input'
                           name="descripcion" 
                           {...register('descripcion')}
                           defaultValue=""/>     
                   </div>
                    <button className='primmary' type="submit" >Guardar</button>
                   
               </form>
             </div>
             </div>
            </Popup>
        )
    }

    const createValue = (datos,consulta,tipo) => {
        
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
                if(tipo != null){
                    getValores(datos.dominio)
                }
                
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
                    <TablaValores values={valores} domi={dominio}/>
                    :null}
            </div>
            <ToastContainer/>
        </Fragment> 
    )


}


export default Dominios;