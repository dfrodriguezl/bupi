import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { servidorPost, url } from '../../js/request'
import {
  pipe,
  gotenberg,
  convert,
  office,
  to,
  landscape,
  set,
  filename,
  please,
} from 'gotenberg-js-client'
import fileDownload from 'js-file-download';

const DescargaReportePredio = (props) => {

  const { id_expediente } = props;
  const [dataSend, setDataSend] = useState({});
  // const urlPdf = "http://192.168.56.10/gotenberg/forms/libreoffice/convert";
  // const urlPdf = "http://192.168.56.10/bienes-raices/gotenberg/forms/libreoffice/convert";
  const urlPdf = "https://www.acueducto.com.co/depuracionpredial/bienes-raices/gotenberg/forms/libreoffice/convert";

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
      console.log("RESPONSE PDF", response);
      const toPDF = pipe(
        gotenberg('http://192.168.56.10/gotenberg'),
        convert,
        office,
        to(landscape),
        set(filename('result.pdf')),
        please
      )

      console.log("TOPDF", toPDF);

      Axios({
        method: 'get',
        url: url + '/help/output.docx',
        responseType: 'blob'
      }).then(resDOC => {
        const form = new FormData();
        const file = new File([new Blob([resDOC.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })], 'output.docx');
        console.log("FILE", file);
        form.append('file', file);

        Axios({
          method: 'post',
          url: urlPdf,
          data: form,
          responseType: 'blob'
        }).then(res => {
          fileDownload(new File([new Blob([res.data, 'application/pdf'])], 'reporte.pdf'), "reporte.pdf");
          toast.success("Reporte generado");
          document.body.style.cursor = 'auto';
        })

      })


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