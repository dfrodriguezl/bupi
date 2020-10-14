import React, { Component } from 'react';

import {servidorPost} from '../js/request'
import { Line } from 'rc-progress';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const CargueDocumentos = () => {
    
    const [doc, setdoc] = React.useState([]);
    const [pdf, setPDF] = React.useState([]);
    const [progreso, setProgreso] = React.useState(0);

    const onChange1=e=>{
       
        const files=e.target.files
        var json=[]
        for (var i = 0; i < files.length; i++) {
          
          var json1={}
          json1["name"]=files[i].name
          json1["size"]=files[i].size
          json.push(json1)
        }
      
        setPDF(files)
        setdoc(json)
      
    }
    

    const upload = (e) => {

       
        for (var i = 0; i < doc.length; i++){

            const formData = new FormData()
  
            formData.append("file",pdf[i])

             var id=doc[i].name.split("-")
            
            servidorPost('/upload/' + id[0], formData).then((response) => {
                console.log(response)
                setProgreso(((i+1)/(doc.length))*100)
            })
            
             
        }
        toast.success("Documentos cargados");
        

    }
    
 
    
    return (
        
        <div id="seccion">
            <div id="titulo_seccion">Cargue de documentos</div>
            <p id="descripcion_seccion">En esta sección usted puede cargar el expeediente que debe estar digitalizado en formato PDF y nombrado correctamente</p>
            <div >
                <label htmlFor="file1" className="label-input" >Selecionar PDF's..
                <input type="file" id="file1" multiple="multiple" onChange={onChange1} className="input" /> 
                </label> 
            </div>
            <ToastContainer />
            
            <button className="primmary" onClick={upload} >Cargar Documentos</button>
            
            <p>Se Cargarán: {Object.keys(doc).length} Documentos</p>
            {doc.map((item,key)=>
     
            <div  key={key} className="documento">
            
            {/(^[A-Z]{4}[0-9]{4})-\b([1-9]|[1-8][0-9]|9[0-9]|1[0-3][0-9]|14[0-3])\b-(\d{1,2}\d{1,2}\d{4})-([1-9]|[1-9][0-9]).pdf/.test(item.name)?
            <><p>  {item.name} </p><i className="gg-check"></i></>
            :
            <><p>  {item.name} </p><i className="gg-close"></i></>}
            
            </div>
            
            )
            }
        <Line percent={progreso} strokeWidth="1" strokeColor="#035B93" trailColor="#fff"/>
        </div>

    )


}

export default CargueDocumentos;
