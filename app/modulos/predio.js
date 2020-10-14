import React, { useState,useEffect   } from 'react';
import ReactDOM from 'react-dom';

import { useParams } from 'react-router-dom'

import { servidorPost } from '../js/request'


import { useForm,Controller } from "react-hook-form";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

var moment = require('moment');
import date from 'date-and-time';

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



const Form = ({tbl,index}) => {
    

    const [fields, setFields] = React.useState([]);
    const [info, setInfo] = React.useState([]);
    const [lectura, setLectura] = React.useState(false);
    const [view, setView] = React.useState(false);

    let { id } = useParams();

    useEffect(() => {
        setView(false)
    var data = {
        "id_consulta": tbl,
        "id_expediente": id
        }
        
        servidorPost('/backend', data).then((response1)=>{
            
            var data = {
                "tabla": index,
                "id_consulta": "get_formulario"
            }
            console.log(response1)

            servidorPost('/backend', data).then((response)=>{
                
                var datos = response.data;
                console.log(datos)

                
                
                setFields(datos);
                setInfo(response1.data[0])
                setView(true)
            })


        })


},[index]);

    
    const { register, handleSubmit, watch, errors,control } = useForm();
    console.log(errors);
    const onSubmit = data => { 
        
    console.log("datos-------")    
    console.log(data)

    Object.keys(data).forEach(function(key){
        if(data[key]=="")
          delete data[key];
      });
   
    
    var key = ""
    for (var k in data) {
        key = key + k + "=$" + k + ","
    }
    key = key.replace(/,\s*$/, "");
    data.upd = key
    data.id_consulta = "update_" + tbl;
    data.id_expediente =id
        
    servidorPost('/backend', data).then(function (response) {
        var result = response.data;                           
        console.log(result)
        if (result == "error") {
            toast.error("Hubo un error al almacenar");
            
        } else {
            toast.success("Información almacenada de: "+result[0].id_expediente);
            
        }
    });
    data=null

};
    
    
    
    
    return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-container">
    
    {view?       
    <>
    {fields.map((i, e) => 
        
        <div className="formulario">
            
            <p className="form_title">{i.doc.label}</p>

            {i.doc.editable?
            <>
            {i.doc.type == 'select' ?
                
                <select className='form_input'
                    name={i.doc.field}
                    readOnly={lectura}
                    defaultValue={info[i.doc.field]}
                    ref={register}>
                    {i.doc.enum.map((opc) =>
                        <option value={opc}>{i.doc.optionLabels[opc-1]}</option>
                    )}
                </select>

                :''
            }
            {i.doc.type == 'text' ?
                
                <input type={i.doc.type}
                className='form_input'
                name={i.doc.field}
                readOnly={lectura}
                defaultValue={info[i.doc.field]}
                ref={register} />
                :''
            }
            {i.doc.type == 'number' ?
                
                <input type={i.doc.type}
                className='form_input'
                name={i.doc.field}
                readOnly={lectura}
                defaultValue={info[i.doc.field]}
                    ref={register({min:0})} />
                :''
            }
            {i.doc.type == 'date' ?
                
                
                <Controller 
                    as={DatePicker} 
                    control={control} 
                    name={i.doc.field}
                    selected={(info[i.doc.field] ? date.parse(info[i.doc.field], 'YYYY-MM-DD') : '')}
                    defaultValue={(info[i.doc.field]?date.parse(info[i.doc.field], 'YYYY-MM-DD'):'')}
                    onChange={([selected]) => selected}
                />
                : ''


            }
            </>
            : <input type={i.doc.type}
            className='form_input_static'
            name={i.doc.field}
            readOnly={false}
            defaultValue={info[i.doc.field]}
            ref={register} />}
            
            <p className="form_helper">{i.doc.helper}</p>
        </div>

    )}
    
    <button className='primmary' type="submit">Guardar</button>     
    </>
      :''}       
</form>
    )



}



const Predio = () => {

    const [index, setIndex] = React.useState(0)
    const [tbl, setTbl] = React.useState(null)
    

    const sel_change = (e) => {

        setIndex(e.target[e.target.selectedIndex].id)
        setTbl(e.target.value)

    }

    return(
      <div id="seccion">
        <div id="titulo_seccion">Predio</div>
        <p id="descripcion_seccion">Sección para edición de la información predial, por favor seleccione un formulario para observar el detalle.</p>
            
            <select onChange={sel_change} >
            <option value="" tbl="">Seleccione...</option>
                <option value="info1_general_proyecto" id={1}>Información general del proyecto</option>
                <option value="info2_general_predio" id={2}>Información general del predio</option>
                <option value="info3_areas_usos" id={3}>Información areas y usos</option>
                <option value="info4_avaluos" id={4}>Información avaluos</option>
                <option value="info5_juridicos" id={5}>Información juridica</option>
                <option value="info6_propietario_anterior_juridico" id={6}>Información propietario anterior juridico</option>
                <option value="info7_propietario_catastral" id={7}>Información propietario catastral</option>
                <option value="info8_propietario_juridico" id={8}>Información propietario juridico</option>
                <option value="info9_zmpa" tbl="1" id={9}>Información zampa</option>
                <option value="info10_infraestructura" id={10}>Información infraestructura</option>
                <option value="info11_estudios_detallados" id={11}>Información estudios detallados</option>
                <option value="info12_control_calidad_tecnico" id={12}>Información control de calidad técnico</option>
                <option value="info13_control_calidad_juridico" id={13}>Información control de calidad juridico</option>
                <option value="info14_saneamiento_basico" id={14}>Información saneamiento básico</option>
                <option value="info15_saneamiento_juridico" id={15}>Información saneamiento juridico</option>
                <option value="info16_tributaria" id={16}>Información tributaria</option>
                
        </select>
            {index>0?<Form tbl={tbl} index={index} />:''}
            
            <ToastContainer />  
      </div>
  
  )
  
  }
  
  
  export default Predio