import React, { Fragment, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import shp from 'shpjs'
import { servidorPost } from '../../js/request'

const CargaShape = ({codigo_bupi}) => {

  const [doc, setDoc] = useState([]);

  const onChange = (e) => {
    const yourFile = e.target.files[0]
    // console.log("File", yourFile)

    let reader = new FileReader();
    reader.onload = function (e) {
      const bstr = e.target.result;
      // console.log("BSTR", bstr)
      // const geojson = await shp(bstr);
      shp(bstr).then((geojson) => {
        // console.log("GEOJSON", geojson)
        delete geojson.fileName;
        delete geojson.type;
        let features = geojson.features;
        if(features.length == 1){
          let shape = features[0].geometry;
          delete shape.bbox;
          let data = {
            id_consulta: "insertar_dibujo_mapa_bupi",
            codigo_bupi: codigo_bupi,
            shape: JSON.stringify(shape)
          }

          if(codigo_bupi.includes("S_")){
            data.id_consulta = 'insertar_dibujo_mapa_servidumbre'
          }
          
          servidorPost("/backend",data).then((response) => {
            console.log("RESPONSE", response)
            toast.success("Poligono cargado al código BUPI " + response.data[0].codigo_bupi ? response.data[0].codigo_bupi : response.data[0].id_expedie);
          })
        }
        
      })  
    }

    reader.readAsArrayBuffer(yourFile);
    

  }

  return (
    <div >
      <label htmlFor="file1" className="label-input" >Cargar shape
        <input type="file" id="file1" onChange={onChange} className="input" accept="application/zip,application/x-zip-compressed" />
      </label>
      <p>El shape debe estar en formato comprimido .zip, debe estar en sistema de referencia espacial WGS84 y debe contener por lo menos los ficheros .shp, .dbf, .prj y .shx</p>
      <ToastContainer />
    </div>
  )
}

export default CargaShape;