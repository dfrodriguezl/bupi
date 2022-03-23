import React, { useEffect, useState } from 'react';
import { servidorPost } from '../js/request';
import EditarComunicado from './editar_comunicado';
import EditIcon from '@material-ui/icons/Edit';
import ModalDelete from './componentes/modal_delete';


const ListaComunicados = (props) => {
  const { id_expediente, consecutivo, tabla } = props;
  const [items, setItems] = useState([]);
  const [refreshTabla, setRefreshTabla] = useState(false)

  useEffect(() => {
    const consulta = {
      id_consulta: 'get_comunicados',
      id_expediente: id_expediente,
      consecutivo: consecutivo,
      tabla: tabla
    }

    servidorPost("/backend", consulta).then((response) => {
      setItems(response.data)
      setRefreshTabla(false)
    })

  }, [refreshTabla])


  return (
    <div id="seccion">
      <div id="titulo_seccion">Comunicados generados</div>
      <p id="descripcion_seccion">Sección para visualizar los comunicados generados</p>
      <EditarComunicado open={<button className='primmary'>Nuevo comunicado</button>} id_exp={id_expediente} index={tabla} consecutivo={consecutivo} setRefreshTabla={setRefreshTabla} tipo="save" />
      <p className="enfasis">Total de comunicados: {items.length} </p>
      <div id="documentos">
        <div className="item head item-com" >
          <p>Fecha</p>
          <p>Radicado INVIAS</p>
          <p>Objeto</p>
          <p>Entidad</p>
          <p>Editar</p>
          {/* <p>Editar</p> */}
          <p>Borrar</p>
        </div>
        {items.map((e, i) => (
          <div className="item item-com" key={e.id}>
            <p>{e.fecha_comunicado}</p>
            <p>{e.radicado_invias_comunicado}</p>
            <p>{e.objeto_comunicado}</p>
            <p>{e.entidad_comunicado}</p>
            <p><EditarComunicado open={<EditIcon />} id_exp={e.id_expediente} index={e.tabla} consecutivo={e.consecutivo_saneamiento} setRefreshTabla={setRefreshTabla} tipo="update" 
                consecutivo_com={e.consecutivo_comunicado} /></p>
            <p><ModalDelete id_expediente={e.id_expediente} consec_san={e.consecutivo_saneamiento} consec_com={e.consecutivo_comunicado} tabla={e.tabla} setRefreshTabla={setRefreshTabla} /></p>
            {/* <DescriptionIcon onClick={() => verDocumento(e)} /> */}
            {/* <Comunicados open={<EditIcon />} id_exp={id_expediente} index={index} consecutivo={consecutivo} setRefreshTablas={setRefreshTablas}/> */}
            {/* <ModalDelete id={e.id} setRefreshTablas={setReloadTable} /> */}
            {/* <p>{e.fecha}</p> */}
            {/* <Modal  nombre={e.nombre} refresh={setRefresh}/>
                  <FindInPageIcon onClick={()=>download(e.id)}></FindInPageIcon> */}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ListaComunicados;