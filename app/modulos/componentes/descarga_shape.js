import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { servidorPost, url } from '../../js/request'

const DescargaShape = (props) => {

  const { id_expediente } = props;

  const onChange = (e) => {
    const datos = { "id_consulta": "get_geometria_predio", "id_expediente": id_expediente }
    let geometria = null;

    servidorPost('/backend', datos).then(function (response) {

      const data = response.data;
      console.log("DATA", data);

      data.every((d) => {
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

        }
      })

      const dataDownload = {
        geojson: geometria,
        id_expediente: id_expediente
      }

      if(geometria != null){
        servidorPost('/download-shp', dataDownload).then(function (response) {
          const link = document.createElement('a');
          link.href = url + "/help/" + id_expediente + ".zip";
          link.setAttribute('download', id_expediente + '.zip'); //or any other extension
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