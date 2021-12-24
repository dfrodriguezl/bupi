import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { servidorPost, url } from '../../js/request'

const DescargaReportePredio = (props) => {

  const { id_expediente } = props;
  const [dataSend, setDataSend] = useState({});

  useEffect(() => {
    const data = {
      id_expediente: id_expediente,
      id_consulta: "get_reporte_tecnico"
    }

    servidorPost('/backend', data).then(function (response) {
      console.log(response);
      const dataJuridico = {
        id_expediente: id_expediente,
        id_consulta: "get_reporte_juridico"
      }
      servidorPost('/backend', dataJuridico).then(function (response1) {
        const dataSegregados = {
          id_expediente: id_expediente,
          id_consulta: "get_reporte_segregados"
        }
        servidorPost('/backend', dataSegregados).then(function (response2) {
          const dataPropietarios = {
            id_expediente: id_expediente,
            id_consulta: "get_reporte_propietarios"
          }
          servidorPost('/backend', dataPropietarios).then(function (response3) {
            const currentDate = new Date();
            setDataSend({
              dia: currentDate.getDate(),
              mes: currentDate.getMonth() + 1,
              anio: currentDate.getFullYear(),
              ...response.data[0],
              ...response1.data[0],
              segregados: response2.data,
              propietarios: response3.data
            })
          })
        })
      })
    });
  }, [])

  const onChange = (e) => {

    document.body.style.cursor = 'progress';
    

    servidorPost('/generate-pdf', dataSend).then(function (response) {
      const link = document.createElement('a');
      link.href = url + "/help/reporte.pdf";
      link.setAttribute('download', 'reporte.pdf'); //or any other extension
      document.body.appendChild(link);
      link.click();
      toast.success("Reporte generado");
      document.body.style.cursor = 'auto';
    });
  }

  return (
    <div onClick={onChange}>
      <label htmlFor="file1" className="label-input" >Descargar reporte PDF
        <p id="file1" className="input" />
      </label>
      <ToastContainer />
    </div>
  )
}

export default DescargaReportePredio;