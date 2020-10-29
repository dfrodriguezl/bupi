import React, { Component } from 'react';

import {servidorPost} from '../js/request'
import { Line } from 'rc-progress';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import CloseIcon from '@material-ui/icons/Close';

import CheckIcon from '@material-ui/icons/Check';

import { getPermisos } from '../variables/permisos'

const CargueDocumentos = () => {
    
    const [doc, setdoc] = React.useState([]);
    const [pdf, setPDF] = React.useState([]);
    const [progreso, setProgreso] = React.useState(0);

    const[meta,setMeta]=React.useState([]);
    const[permiso,setpermiso]=React.useState(false);
    const[load,setLoad]=React.useState(0)

    React.useEffect(() => {
        
        var data={"id_consulta":"get_metadata"}
        servidorPost('/backend/', data).then((response) => {
            
            console.log(response.data)
            setMeta(response.data)
            
        })

        getPermisos().then((response) => {
            setpermiso(response.some(r=> [3].includes(r)))
        })


    },[])



    const onChange1=e=>{
       
        const files=e.target.files
        var json=[]
        for (var i = 0; i < files.length; i++) {
          
        var json1={}
          json1["name"]=files[i].name
          json1["size"] = files[i].size
            
        var nombre = files[i].name
            
        var separators = ['-', '\\.'];
        var estruc = nombre.split(new RegExp(separators.join('|'), 'g'));

            
        if (estruc.length == 6) {
            
            console.log(estruc[4].length)

            if (estruc[0].length==8 && estruc[1].length==3 && estruc[2].length==8 && estruc[3].length==3 && estruc[4].length==2) {
               
                var tipo_documento=""
                
                meta.map((item, e) => {
                    if (item.cod_grupo==estruc[1]) {
                        tipo_documento = item.nombre
                        return
                    }
                })
                json1["tipo"] = tipo_documento

                json1["valido"] = true

            } else {
                
                json1["valido"] = false
            }


        } else {
            
            json1["valido"] = false
        }  
        
            


          json.push(json1)
        }
      
        setPDF(files)
        setdoc(json)
      
    }
    

    const upload = (e) => {
        var k = 0;
       
        for (var i = 0; i < doc.length; i++){


            if (doc[i].valido) {

                const formData = new FormData()
    
                formData.append("file",pdf[i])

                var id=doc[i].name.split("-")
                
                
                servidorPost('/upload/' + id[0], formData).then((response) => {
                    console.log(response)
                    setProgreso(((k + 1) / (doc.length)) * 100)
                    k = k + 1;
                    setLoad(k)
                })

            } else {
                console.log("no enviado")
            }


            
            
             
        }
        toast.success("Documentos cargados");
        

    }
    
 
    
    return (
        
        <div id="seccion">
            <div id="titulo_seccion">Cargue de documentos</div>
            <p id="descripcion_seccion">En esta sección usted puede cargar el expeediente que debe estar digitalizado en formato PDF y nombrado correctamente</p>

            <div className="img-descripcion">
                <img  src="bienes-raices/img/documento-explicacion.svg" alt=""/>
            </div>
            
            {permiso ?
                <>
            <div >
                <label htmlFor="file1" className="label-input" >Selecionar PDF's..
                <input type="file" id="file1" multiple="multiple" onChange={onChange1} className="input" /> 
                </label> 
            </div>
            <ToastContainer />
            <button className="primmary" onClick={upload} >Cargar Documentos</button>
            
            <p>Se Cargarán: {doc.reduce(function(sum, d) {
                return sum + d.valido;
            }, 0)} Documentos de {doc.length}</p>

            <Line percent={progreso} strokeWidth="1" strokeColor="#035B93" trailColor="#fff" />
            <p className="enfasis">Documentos subidos: {load} </p>
                    

            {doc.map((item,key)=>
     
            <div  key={key} className="documento">
            
                    {item.valido ?
                        <div className="item">
                            <CheckIcon />
                            <p>{item.name}</p>
                            <p>{item.tipo}</p>
                        </div>
                        :
                        <div className="item danger">
                            <CloseIcon />
                            <p>{item.name}</p>
                        </div>
                    }
            
            </div>
            
            )
            }
                
                </>
        :<p className="no-permiso">No cuentas con permisos para usar esta herramienta</p>}
        </div>

    )


}

export default CargueDocumentos;
