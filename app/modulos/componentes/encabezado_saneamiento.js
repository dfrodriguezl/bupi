import React, { useEffect, useState } from "react";
import { servidorPost } from "../../js/request";

const EncabezadoSaneamiento = (props) => {
  const { tipo, codigo_bupi, consecutivo } = props;
  const [estadoSaneamiento, setEstadoSaneamiento] = useState(null);

  useEffect(() => {
    var data = {
      "id_consulta": tipo === 39 ? "get_estado_san_tecnicos" : "get_estado_san_juridicos",
      "codigo_bupi": codigo_bupi,
      "consecutivo": consecutivo
    }

    servidorPost('/backend', data).then((response) => {
      if (response.data.length > 0) {
        setEstadoSaneamiento(response.data[0].estado)
      }
    })
  }, [tipo])

  return (
    <div id="titulo_seccion">
      <p>Estado saneamiento: {estadoSaneamiento}</p>
    </div>
  )
}

export default EncabezadoSaneamiento;