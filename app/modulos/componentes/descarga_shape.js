import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { servidorPost, url } from '../../js/request'

const DescargaShape = (props) => {

  const { codigo_bupi } = props;

  const onChange = (e) => {
    const datos = { "id_consulta": "get_geometria_predio", "codigo_bupi": codigo_bupi }
    let geometria = null;

    servidorPost('/backend', datos).then(function (response) {

      const data = response.data;

      data.every((d) => {
        console.log("DD", d);
        if (d.tipo === 'geometria_verificada') {
          if (d.geojson.features != null) {
            console.log("GEOMETRIA", d.geojson);
            geometria = d.geojson;
            return false;
          } else {
            toast.info("Predio sin geometria");
          }

        } else if (d.tipo === 'geometria_revision') {
          if (d.geojson.features != null) {
            console.log("GEOMETRIA", d.geojson);
            geometria = d.geojson;
            return true;
          }
          return true;

        }
      })

      const dataDownload = {
        geojson: geometria,
        codigo_bupi: codigo_bupi
      }

      console.log("DATA DOWNLOAD", dataDownload);

      if(geometria != null){
        servidorPost('/download-shp', dataDownload).then(function (response) {
          const link = document.createElement('a');
          link.href = url + "/help/" + codigo_bupi + ".zip";
          link.setAttribute('download', codigo_bupi + '.zip'); //or any other extension
          document.body.appendChild(link);
          link.click();
          toast.success("Shape generado");
        });
      }else{
        toast.error("Error al generar shape o no hay poligono asociado al predio");
      }
    })

  }

  return (
    <div onClick={onChange}>
      <label htmlFor="file1" className="label-input" >Descargar shape
        <p id="file1" className="input" />
      </label>
      <ToastContainer />
    </div>
  )
}

export default DescargaShape;