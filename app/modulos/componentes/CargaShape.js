import React, { Fragment, useState } from 'react'
import shp from 'shpjs'
import { servidorPost } from '../../js/request'

const CargaShape = ({id_expediente}) => {

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
            id_consulta: "insertar_dibujo_mapa",
            id_expediente: id_expediente,
            estado: 1,
            shape: JSON.stringify(shape)
          }
          
          console.log("DATA",data)
          servidorPost("/backend",data).then((response) => {
            console.log("RESPONSE", response)
          })
        }
        
      })  

      // const wb = XLSX.read(bstr, { type: 'binary' });
      // wb.SheetNames.forEach((sh) => {
      //   let sh_data = wb.Sheets[sh];
      //   data[sh] = XLSX.utils.sheet_to_json(sh_data, { header: 0 });
      // })

      // servidorPost('/actualizacionMasiva', data).then((response) => {
      //   // console.log(response)
      //   if (response.status == 200) {
      //     toast.success("Expedientes actualizados correctamente");
      //   } else {
      //     toast.error("Problema actualizar expedientes");

      //   }
      // })
    }

    reader.readAsArrayBuffer(yourFile);
    
    // reader.readAsArrayBuffer(yourFile);

    // shp(yourFile).then((geojson) => {
    //   console.log("GEOJSON", geojson)
    // })
    // servidorPost('/xls', formData).then((response) => {
    //   const data = response.data;
    //   // console.log(data.json[0])
    //   if (typeof data.json[0].id_expediente != "undefined") {
    //     setdoc(data.json)
    //   } else {
    //     alert("Seleccione un documento csv válido")
    //     setdoc([])
    //   }

    // });

  }

  return (
    <div >
      <label htmlFor="file1" className="label-input" >Cargar shape
        <input type="file" id="file1" onChange={onChange} className="input" accept="application/zip,application/x-zip-compressed" />
      </label>
      <p>El shape debe estar en formato comprimido .zip, debe estar en sistema de referencia espacial WGS84 y debe contener por lo menos los ficheros .shp, .dbf, .prj y .shx</p>
    </div>
  )
}

export default CargaShape;