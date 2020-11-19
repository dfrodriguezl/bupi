import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { useParams } from 'react-router-dom'

import { url,servidorPost } from '../js/request'


import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import DeleteIcon from '@material-ui/icons/Delete';
import ImageSearchIcon from '@material-ui/icons/ImageSearch';

import { useForm, Controller } from "react-hook-form";

import { getPermisos } from '../variables/permisos'


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ReactSelect from "react-select";


import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

var moment = require('moment');
import date from 'date-and-time';

import Popup from 'reactjs-popup';

import CargueDocumentos from './cargue_expedientes'


const gestionPermisos = (index) => {
    
    var tipo_permiso = 0;
    if ([2,3,4,7,10,11,14,17,19].includes(index)) {
        tipo_permiso = 6;//editar formulario técnico  
    } else if ([5,6,8,15,16,17,19,20,21].includes(index)) {
        tipo_permiso = 7;//editar formulario juridico  
    } else if ([12].includes(index)) {
        tipo_permiso = 4;//editar formulario juridico    
    } else if ([13].includes(index)) {
        tipo_permiso = 5;//editar formulario juridico    
    }
    return tipo_permiso;

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

        />
    )
};



const Form = ({ tbl, index,refresh,consecutivo }) => {


    const [fields, setFields] = React.useState([]);
    const [info, setInfo] = React.useState([]);
    const [lectura, setLectura] = React.useState(true);
    const [view, setView] = React.useState(false);
    const [defecto, setDefecto] = React.useState(true);
    const[permiso,setpermiso]=React.useState(false);
    const[reload,setReload]=React.useState(false);



    let { id } = useParams();

    useEffect(() => {
        console.log("cambios")
        setView(false)
        setpermiso(false)

        if (index>0) {
            
        

        var data = {
            "id_consulta": tbl,
            "id_expediente": id,
            "consecutivo":consecutivo
        }

        servidorPost('/backend', data).then((response1) => {

            var data = {
                "tabla": index,
                "id_consulta": "get_formulario"
            }
            console.log("datos primero")
            console.log(response1)

            servidorPost('/backend', data).then((response) => {

                var datos = response.data;

                console.log("estructura segundo")
                console.log(datos)



                var tipo_permiso=gestionPermisos(index);
                


                getPermisos().then((response) => {
                    console.log(response)
                    setpermiso(response.some(r=> [tipo_permiso].includes(r)))
               })


                if (response1.data.length>0) {
                     setFields({ data: datos,info: response1.data[0]}); 
                    
                    setView(true)
                } else {
                    setView(false)
                }

                var data={id_consulta:'tengo_predio',id_expediente:id}
                servidorPost('/backend', data).then((response) => {
                    setLectura(!response.data[0].exists)
                })
                

            })


        })
        }

    }, [index,refresh,reload]);

    const getRegex = (str) => {
        /*
        var regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        var str = regex.toString(); 
        */
        
        if (str) {
            var parts = /\/(.*)\/(.*)/.exec(str);
            var restoredRegex = new RegExp(parts[1], parts[2]);
            return restoredRegex;

        } else {
            return str;
        }
    }


    const { register, handleSubmit, watch, errors, control,setValue } = useForm();



    

    const onSubmit = datos => {

        console.log("datos-------")
        console.log(datos)
        var data = datos;


        Object.keys(data).forEach(function (key) {
            if (data[key] == "") {
                delete data[key];
            }
            
            if (Array.isArray(data[key])) {
                console.log("array")
                var item = fields.data.filter(item => item.doc.field == key).map(item => {
                    return item.doc.form
                });
                console.log(item)

                if (item[0] === "select") {
                    console.log(data[key][0].value)
                    data[key]=data[key][0].value
                }
                else if (item[0] === "select_multiple") {
                    
                    var arr = data[key].map(item => { return item.value });
 
                    data[key] = arr;

                }

            }
            if (typeof data[key] === 'undefined') {
                delete data[key];
            }
        });
        console.log(data)
        


        var key = ""
        for (var k in data) {
            key = key + k + "=$" + k + ","
        }
        key = key.replace(/,\s*$/, "");
        data.upd = key
        data.id_consulta = "update_" + tbl;
        data.id_expediente = id

        servidorPost('/backend', data).then(function (response) {
            var result = response.data;
            console.log(result)
            if (result == "error") {
                toast.error("Hubo un error al almacenar");

            } else {
                toast.success("Información almacenada de: " + result[0].id_expediente);

            }
        });

        data = null

    };

    
    const change = (msg,e) => {

        return msg;
    }


    const crear_registro = () => {
        

        var data = {
            "tabla": tbl,
            "id_consulta": "insertar_vacio",
            "id_expediente":id
        }

        
        servidorPost('/backend', data).then((response) => {

            var datos = response.data;

            toast.success("Registro creado: " + datos[0].id_expediente);
            setReload(Math.random())
        })
        
        

    }
    const handleMultiChange = selectedOption => {
        console.log(selectedOption)
        //setValue('mot_dev_tec', selectedOption);
        return selectedOption[0];
      };

    const default_multiple = (listado,compare) => {

        if (compare !== null) {
        var arr=listado.filter(option => compare.includes(option.value))
            return arr;
            
        } else {
            return null;
        }


    }

    return (
        <>
        <form onSubmit={handleSubmit(onSubmit)} className="form-container">

            {view ?
                <>
                {console.log("renderizando...")}


                    {fields.data.map((i, e) =>

                        <div className="formulario">

                            <p className="form_title">{i.doc.label}</p>


                            {i.doc.editable ?
                                <>
                                    
                                    {i.doc.form == 'select' ?
  
                                        <>

                                    <Controller
                                        as={ReactSelect}
                                        options={
                                            i.doc.enum
                                        }
                                        
                                        isDisabled={lectura}
                                        name={i.doc.field}
                                        isClearable
                                        
                                        control={control}
                                        defaultValue={defecto ? i.doc.enum.filter(option => parseInt(option.value) === parseInt(fields.info[i.doc.field])) : ''}
                                        onChange={(e)=>change(e,i.doc.field)}

                                        />
                                        </>

                                        : ''
                                    }

                                    {i.doc.form == 'select_multiple' ?
                                    
                                    <>
                                    <Controller
                                    as={ReactSelect}
                                    options={
                                        i.doc.enum
                                    }
                                    isDisabled={lectura}
                                    name={i.doc.field}
                                    isClearable
                                    isMulti
                                    control={control}
                                    onChange={handleMultiChange}
                                    defaultValue={defecto ? default_multiple(i.doc.enum,fields.info[i.doc.field]) : ''}
                                    />
                                    </>

                                    : ''
                                    }

                                    {i.doc.form == 'texto' ?
                                        <>
                                        <input type={i.doc.type}
                                            className='form_input'
                                            name={i.doc.field}
                                            disabled={lectura}
                                            defaultValue={defecto ? fields.info[i.doc.field] : ''}
                                            ref={register({
                                                pattern: {
                                                    value: getRegex(i.doc.regex),
                                                    message: i.doc.message
                                                  }
                                            })} />
                                            {errors[i.doc.field]&& <span className="msg-error">{errors[i.doc.field].message}</span>}
                                        </>
                                        : ''
                                    }
                                    {i.doc.form == 'numero' ?

                                        <input type="number"
                                            step="0.0001"
                                            className='form_input'
                                            name={i.doc.field}
                                            disabled={lectura}
                                            defaultValue={defecto ? fields.info[i.doc.field] : ''}
                                            ref={register({ min: 0 })} />
                                        : ''
                                    }
                                    {i.doc.form == 'area' ?

                                    <textarea 
                                        className='form_input'
                                        name={i.doc.field}
                                        disabled={lectura}
                                        defaultValue={defecto ? fields.info[i.doc.field] : ''}
                                        ref={register}
                                        rows="4"
                                        />
                                    : ''
                                    }
                                    {i.doc.form == 'fecha' ?


                                        <Controller
                                            as={DatePicker}
                                            control={control}
                                            name={i.doc.field}
                                            selected={(fields.info[i.doc.field] ? date.parse(fields.info[i.doc.field], 'YYYY-MM-DD') : '')}
                                            defaultValue={(fields.info[i.doc.field] ? date.parse(fields.info[i.doc.field], 'YYYY-MM-DD') : '')}
                                            onChange={([selected]) => selected}
                                        />
                                        : ''


                                    }
                                </>
                                : <input type={i.doc.type}
                                    className='form_input_static'
                                    name={i.doc.field}
                                    readOnly={false}
                                    defaultValue={defecto ? fields.info[i.doc.field] : ''}
                                    ref={register} />}

                            <p className="form_helper">{i.doc.helper}</p>
                        </div>

                    )}

                    {permiso &&!lectura ? <button className='primmary' type="submit">Guardar</button> : <p className="no-permiso">No cuentas con permisos para editar la información</p>}
                </>
                : ''}
            


        </form>

            {console.log(view)}
            {console.log(permiso)}

        {view ? '' :
            <>
                    {permiso &&!lectura ? <>
                        <p>Este expediente aún no tiene un registro para esta tabla, debe crear uno primero</p>
                        <button onClick={crear_registro}>Crear registro</button>
                    </>:<p>Este expediente aún no tiene un registro para esta tabla</p>} 
            </>
            }

        </>
        
    )



}

const Files = ({titulo,cod}) => {
    
    const[filename,setFilename]=useState(null)
    const[uri,setUri]=useState(false)
    const[refresh,setRefresh]=useState(false)


    let { id } = useParams();



    useEffect(() => {
        
        var data = {
            "id_consulta": "get_soportes",
            "identificador": id+'-'+cod
        }
        console.log(data)

        servidorPost('/backend', data).then((response) => {

            if (response.data.length > 0) {
                setFilename(response.data[0].nombre)
                setUri(response.data[0].id)
            }
            

        })

    },[refresh])

    const download=()=> {
        
        window.open(url+'/descargar/'+uri)
        
      }

    const upload = e=> {
        
        const files = e.target.files
        console.log(files[0].name)
        setFilename(id + '-' + cod+'.pdf')

   

        const formData = new FormData()
    
        formData.append("file",files[0],id + '-' + cod+'.pdf')

        servidorPost('/upload/' + id+'-'+cod, formData).then((response) => {
            console.log(response)
            if (response.status==200) {
                toast.success("Documento cargado al sistema: " + titulo);
                setRefresh(!refresh)
            } else {
                toast.error("Problema al cargar documento");
                
            }
        })

        


    }

    return (
        <div className="upload_file">
        <div >
            <label htmlFor={titulo} className="label-input" >{uri?'Actualizar':'Anexar'} {titulo}
            <input type="file" id={titulo} onChange={upload} className="input" accept="application/pdf"/> 
            </label> 
            </div>
        {uri&&<ImageSearchIcon onClick={download} />}
        <div><p>{ filename}</p></div>
        
        </div>
    )
}


const Alerta=({btn,msg,action})=>{
    

    return (

        <Popup
        trigger={btn}
        modal
        nested
      >
        {close => (
          <div className="modal">
            <button className="close" onClick={close}>
              &times;
            </button>
            <div className="header"> Confirmación </div>
            <div className="content">{msg}</div>
            <div className="actions">
            <button
                className="button"
                onClick={() => {
                    action()
                    close();
                  }}
                
              >
                Si
              </button>
              <button
                className="button"
                onClick={() => {
                  close();
                }}
              >
                No
              </button>
            </div>
          </div>
        )}
      </Popup>


    )

}




const FormMultiple=({tbl,index,titulo})=>{

    const[activate,setActivate]=React.useState(false)
    const[multiple,setMultiple]=React.useState(false)
    const[consecutivo,setConsecutivo]=React.useState(0)
    const[opciones,setOpciones]=React.useState([])
    const[refresh,setRefresh]=React.useState(false)
    const [autoref, setAutoref] = React.useState(0)
    const[permiso,setPermiso]=React.useState(false)

    let { id } = useParams();

    useEffect(() => {
        setActivate(false)
        setMultiple(false)


        var tipo_permiso=gestionPermisos(index);

        getPermisos().then((response) => {
            console.log("permisos-multiple")
            console.log(response)
            console.log(tipo_permiso)

            setPermiso(response.some(r => [tipo_permiso].includes(r)))
            console.log(permiso)
       })

        
        if ([18,6,7,8,9,12,13,21].includes(index)) {
            setMultiple(true)
           

            var data = {
                "id_consulta": "get_consecutivos",
                "id_expediente": id,
                "tabla":tbl
            }

            console.log(data)
    
            servidorPost('/backend', data).then((response) => {

                if (response.data.length > 0) {
                    setOpciones(response.data) 
                } else {
                    setOpciones([]) 
                    
                }
                
    
            })







        } else {
            setActivate(true)
            
        }

        
    },[index,autoref])

    const activar = (con) =>()=> {
        console.log("activado")
        console.log(con)
        console.log(tbl)
        setConsecutivo(con)
        setActivate(true)
        setRefresh(Math.random())
    }

    const add_registro = () => {
        
        var data = {
            "id_consulta": "insert_consecutivo",
            "id_expediente": id,
            "tabla":tbl
        }

      
        servidorPost('/backend', data).then((response) => {

            console.log(response)
            if (response.data.length > 0) {
                toast.success("Registro creado satisfactoriamente");
                setAutoref(Math.random())
            }
            

        })


    }

const delete_registro=(con)=>{

    var data = {
        "id_consulta": "delete_consecutivo",
        "id_expediente": id,
        "tabla": tbl,
        "consecutivo":con
    }

  
    servidorPost('/backend', data).then((response) => {

        console.log(response)
        if (response.data.length > 0) {
            toast.success("Registro borrado satisfactoriamente");
            setAutoref(Math.random())
        }
        

    })


}


    return (

        <div className="form-big">
            <h3>{titulo}</h3>
            <p>Formulario para la edición de información relaciona a: {titulo}</p>
            {multiple && <>
                <p>Seleccione un registro para ver su información</p>
                {opciones.map((i, e)=>
                <>
                    <div className="grupo-multiple">
                            <button onClick={activar(i.consecutivo)}>Ver registro {i.consecutivo}</button>
                    

                            {permiso?<Alerta
                                btn={<DeleteIcon />}
                                msg="Se encuentra seguro de borrar este registro?"
                                action={() => delete_registro(i.consecutivo)}
                            />:''}

                            
                    </div>
                    
                </>
                )}
                {permiso?<Alerta
                    btn={<button className="primmary" >Adicionar registro</button>}
                    msg="Se encuentra seguro de adicionar un nuevo registro?"
                    action={add_registro}
                />:''}
            </>}

            {activate && <Form tbl={tbl} index={index} refresh={refresh} consecutivo={consecutivo }/>}


        </div>
    )




}

const Ayuda=()=>{

    const[info,setInfo]=React.useState([])

    let { id } = useParams();

    useEffect(() => {

        var data = {
            "id_consulta": "info_header_form",
            "id_expediente": id,
        }

        console.log(data)

        servidorPost('/backend', data).then((response) => {

            setInfo(response.data[0])

        })



    },[false])


    return(

        <div className="header-help-form">
            <div><p>Número de matricula: </p>   <p>{info.num_mi}</p></div>
            <div><p>CHIP: </p> <p>{info.chip_cat}</p></div>
            <div><p>Código predial: </p>   <p>{ info.cod_predial}</p></div>
            
         </div>

    )

}


const Predio = () => {

    const [index, setIndex] = React.useState(0)
    const [tbl, setTbl] = React.useState(null)

    const [active, setActive] = React.useState(0)
    const [recarga, setRecarga] = React.useState(null)
    const [titulo, setTitulo] = React.useState(null)

    const getForm = (id, form,descripcion) => {

        setIndex(id)
        setTbl(form)
        setActive(id)
        setTitulo(descripcion)

        setRecarga(Math.random())
    }



    return (
        <div id="seccion">
            <div id="titulo_seccion">Predio</div>
            <p id="descripcion_seccion">Sección para edición de la  información predial, por favor seleccione un item y luego un formulario para observar el detalle.</p>


            <Tabs  onSelect={()=>setIndex(0)}>
                <TabList>
                    <Tab>Técnico</Tab>
                    <Tab>Jurídico</Tab>
                    <Tab>Financiera</Tab>
                    <Tab>Social</Tab>
                    <Tab>Documentos</Tab>
                </TabList>
                <TabPanel>

                    <h3>Formularios técnico</h3>
                    <p>A continuación seleccione un formulario para visualizar su información en caso de que tenga datos almacenados en la base de datos.</p>

                    <div className="grupo-formularios">

                        <button onClick={() => getForm(1, "info1_general_proyecto", "Información general del proyecto")}
                            className={active == 1 ? 'active' : ''}    >
                            general del proyecto
            </button>
                        <button onClick={() => getForm(2, "info2_general_predio","Información general del predio")} className={active == 2 ? 'active' : ''}>
                            general del predio
            </button>
                        <button onClick={() => getForm(3, "info3_areas_usos","Información de áreas y usos")} className={active == 3 ? 'active' : ''} >
                            areas y usos
            </button>
                        <button onClick={() => getForm(4, "info4_avaluos","Información de avalúos")} className={active == 4 ? 'active' : ''}>
                            avaluos
            </button>

                        <button onClick={() => getForm(9, "info9_zmpa","ZMPA")} className={active == 9 ? 'active' : ''}>
                            ZMPA
            </button>
                        <button onClick={() => getForm(10, "info10_infraestructura","Infraestructura")} className={active == 10 ? 'active' : ''} >
                            infraestructura
            </button>
                        <button onClick={() => getForm(11, "info11_estudios_detallados","Estudios detallados")} className={active == 11 ? 'active' : ''}>
                            estudios detallados
            </button>
            <button onClick={() => getForm(7, "info7_propietario_catastral","Propietario Catastral")} className={active == 7 ? 'active' : ''}>
                            propietario catastral
            </button>


                        <button onClick={() => getForm(14, "info14_saneamiento_basico","Saneamiento técnico")} className={active == 14 ? 'active' : ''}>
                            saneamiento técnico
            </button>


            <button onClick={() => getForm(17, "info17_documentos_requeridos","Documentos requeridos")} className={active == 17 ? 'active' : ''}>
                            Documentos requeridos
            </button>

            <button onClick={() => getForm(19, "info19_mutacion_predial","Mutación predial")} className={active == 19 ? 'active' : ''}>
                            Mutación predial
            </button>
                        
            <button onClick={() => getForm(18, "info18_municipios_intersectados","Municipios intersectados")} className={active == 18 ? 'active' : ''}>
                            Municipios intersectados
            </button>

            <button onClick={() => getForm(12, "info12_control_calidad_tecnico","Control de calidad técnico")} className={active == 12 ? 'active' : ''} >
                            control de calidad técnico
            </button>

                        
                        
                    </div>

        <h3>Documentos</h3>
        <Files titulo="Soporte" cod={1} />
        <Files titulo="Concepto técnico" cod={2}/>
        <Ayuda/>
                </TabPanel>

                <TabPanel>

                <h3>Formularios Jurídicos</h3>
                    <p>A continuación seleccione un formulario para visualizar su información en caso de que tenga datos almacenados en la base de datos.</p>

                    <div className="grupo-formularios">
                        <button onClick={() => getForm(5, "info5_juridicos","Información juridica")} className={active == 5 ? 'active' : ''}>
                            juridica
            </button>
            <button onClick={() => getForm(21, "info21_juridicos","Información juridica Adquisición")} className={active == 21 ? 'active' : ''}>
                            juridica - adquisición
            </button>
                        <button onClick={() => getForm(6, "info6_propietario_anterior_juridico","Propietario anterior juridico")} className={active == 6 ? 'active' : ''}>
                            propietario anterior juridico
            </button>

                        <button onClick={() => getForm(8, "info8_propietario_juridico","Propietario según folio")} className={active == 8 ? 'active' : ''}>
                            propietario según folio
            </button>
                        <button onClick={() => getForm(15, "info15_saneamiento_juridico","Saneamiento Juridico")} className={active == 15 ? 'active' : ''} >
                            saneamiento juridico
            </button>



                        <button onClick={() => getForm(19, "info19_mutacion_predial","Mutación predial")} className={active == 19 ? 'active' : ''}>
                            Mutación predial
            </button>

                        
            <button onClick={() => getForm(17, "info17_documentos_requeridos","Documentos requeridos")} className={active == 17 ? 'active' : ''}>
                            Documentos requeridos
            </button>
                        
            <button onClick={() => getForm(13, "info13_control_calidad_juridico","Control de calidad juridico")} className={active == 13 ? 'active' : ''}>
                            control de calidad juridico
            </button>
                        
                    </div>
                    <h3>Documentos</h3>
                    <Files titulo="soporte" cod={3}/>
                    
                    <Ayuda/>

                </TabPanel>

                <TabPanel>
                <button onClick={() => getForm(16, "info16_tributaria","Información tributaria")} className={active == 16 ? 'active' : ''}>
                            tributaria
            </button>


            
                    
                </TabPanel>
                <TabPanel>
                    En construcción...
                </TabPanel>
                <TabPanel>
                    <CargueDocumentos/>
                </TabPanel>

            </Tabs>


            
            
            {index > 0 ? <FormMultiple tbl={tbl} index={index} titulo={titulo}/> : ''}

            <ToastContainer />
        </div>

    )

}


export default Predio