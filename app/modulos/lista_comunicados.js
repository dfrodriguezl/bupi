import React, { useEffect, useState } from 'react';
import { servidorPost } from '../js/request';
import EditarComunicado from './editar_comunicado';
import EditIcon from '@material-ui/icons/Edit';
import ModalDelete from './componentes/modal_delete';
import ReactSelect from 'react-select';


const ListaComunicados = (props) => {
  const { id_expediente, consecutivo, tabla, tipoSaneamiento, gravamen } = props;
  const [items, setItems] = useState([]);
  const [refreshTabla, setRefreshTabla] = useState(false)
  const [listEntregables, setListEntregables] = useState([])
  const [sanSeleccionado, setSanSeleccionado] = useState(tipoSaneamiento)

  useEffect(() => {
    
    const consulta = {
      id_consulta: 'get_comunicados',
      id_expediente: id_expediente,
      consecutivo: consecutivo,
      tabla: tabla,
      saneamiento: tipoSaneamiento
    }

    servidorPost("/backend", consulta).then((response) => {
      setItems(response.data)
      setRefreshTabla(false)
    })

    const dataDomain = {
      id_consulta: "get_valores_dominios",
      dominio: 'DOM_ENTREGABLE'
    }

    servidorPost("/backend", dataDomain).then((response) => {
      setListEntregables(response.data)
    })

    setSanSeleccionado(tipoSaneamiento)

  }, [refreshTabla, tipoSaneamiento, setListEntregables, setRefreshTabla, setItems])

  const onChangeSelect = (e) => {
    setGravamenSeleccionado(e)
  }


  return (
    <div id="seccion">
      <div id="titulo_seccion">Entregables</div>
      <p id="descripcion_seccion">Sección para visualizar los entregables asociados al saneamiento</p>
      <EditarComunicado open={<button className='primmary'>Nuevo entregable</button>} id_exp={id_expediente} index={tabla} consecutivo={consecutivo} setRefreshTabla={setRefreshTabla} tipo="save"
        tipoSaneamiento={sanSeleccionado} />
      <p className="enfasis">Total: {items.length} </p>
      <div id="documentos">
        <div className="head item-com" >
          <p>Entregable</p>
          <p>Fecha radicado</p>
          <p>Radicado</p>
          <p>Tema solicitud</p>
          <p>Dirigido a</p>
          <p>Editar</p>
          {/* <p>Editar</p> */}
          <p>Borrar</p>
        </div>
        {items.length > 0 ?
          items.map((e, i) => (
            <div className="item-com" key={e.id}>
              <p>{listEntregables.length > 0 && e.entregable !== null ? listEntregables.filter((o) => Number(o.valor) === Number(e.entregable))[0].descripcion : null}</p>
              <p>{e.fecha_comunicado}</p>
              <p>{e.radicado_invias_comunicado || e.radicado_respuesta}</p>
              <p>{e.objeto_comunicado}</p>
              <p>{e.entidad_comunicado}</p>
              <p><EditarComunicado open={<EditIcon />} id_exp={e.id_expediente} index={e.tabla} consecutivo={e.consecutivo_saneamiento} setRefreshTabla={setRefreshTabla} tipo="update"
                consecutivo_com={e.consecutivo_comunicado} entregable={e.entregable} tipoSaneamiento={tipoSaneamiento} /></p>
              <p><ModalDelete id_expediente={e.id_expediente} consec_san={e.consecutivo_saneamiento} consec_com={e.consecutivo_comunicado} tabla={e.tabla} setRefreshTabla={setRefreshTabla} /></p>
              {/* <DescriptionIcon onClick={() => verDocumento(e)} /> */}
              {/* <Comunicados open={<EditIcon />} id_exp={id_expediente} index={index} consecutivo={consecutivo} setRefreshTablas={setRefreshTablas}/> */}
              {/* <ModalDelete id={e.id} setRefreshTablas={setReloadTable} /> */}
              {/* <p>{e.fecha}</p> */}
              {/* <Modal  nombre={e.nombre} refresh={setRefresh}/>
                  <FindInPageIcon onClick={()=>download(e.id)}></FindInPageIcon> */}
            </div>
          )) : null}
      </div>
    </div>
  )
}

export default ListaComunicados;