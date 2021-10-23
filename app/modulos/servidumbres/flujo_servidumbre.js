import React, { memo } from 'react';
import { useParams } from 'react-router-dom'
import ReactFlow, {
  Controls,
  Background,
  Handle
} from 'react-flow-renderer';


import { servidorPost } from '../../js/request';

import { makeStyles } from '@material-ui/core/styles';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import CheckIcon from '@material-ui/icons/Check';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';




var moment = require('moment');
moment.locale('es');




const FlujoServidumbre = () => {


  const [code, setCode] = React.useState(null);
  const [opt, setOpt] = React.useState([]);
  const [visible, setVisible] = React.useState(false);
  const nodeTypes = {
    oneTwo: OneTwoNode,
    TwoOne: TwoOneNode,
    twoTwo: TwoTwoNode
  };

  const elements = [
    { id: '1', type: 'input', data: { label: 'Inicio' }, position: { x: 0, y: 200 }, draggable: false, connectable: false, selectable: false, sourcePosition: 'right' },
    // you can also pass a React Node as a label

    { id: '2', type: 'oneTwo', data: { label: 'Técnico' }, position: { x: 300, y: 200 }, draggable: false, className: 'nodo', connectable: false, selectable: false, targetPosition: 'left', sourcePosition: 'right' },
    // { id: '3', type: 'oneTwo', data: { label: 'Juridico' }, position: { x: 300, y: 200 }, draggable: false, className: 'nodo', connectable: false, selectable: false, targetPosition: 'left', sourcePosition: 'right' },
    // { id: '4', type: 'TwoOne', data: { label: 'Sup. Juridico' }, position: { x: 700, y: 200 }, draggable: false, className: 'nodo', connectable: false, selectable: false, sourcePosition: 'right' },
    { id: '5', type: 'twoTwo', data: { label: 'Sup. Técnico' }, position: { x: 700, y: 200 }, draggable: false, className: 'nodo', connectable: false, selectable: false, sourcePosition: 'right' },
    { id: '6', type: 'TwoOne', data: { label: 'SIG' }, position: { x: 1100, y: 200 }, draggable: false, className: 'nodo', connectable: false, selectable: false, sourcePosition: 'right' },
    // { id: '6', type: 'output', data: { label: 'Fin técnico' }, position: { x: 1100, y: 0 }, draggable: false, className: 'nodo', connectable: false, selectable: false, targetPosition: 'left' },
    { id: '7', type: 'output', data: { label: 'Fin técnico' }, position: { x: 1500, y: 200 }, draggable: false, className: 'nodo', connectable: false, selectable: false, targetPosition: 'left' },
    // { id: '8', type: 'output', data: { label: 'Fin jurídico' }, position: { x: 1500, y: 200 }, draggable: false, className: 'nodo', connectable: false, selectable: false, targetPosition: 'left' },
    // { id: '9', data: { label: 'Social' }, position: { x: 300, y: 400 }, draggable: false, className: 'nodo', connectable: false, selectable: false, targetPosition: 'left', sourcePosition: 'right' },
    // { id: '10', type: 'output', data: { label: 'Fin social' }, position: { x: 1500, y: 400 }, draggable: false, className: 'nodo', connectable: false, selectable: false, targetPosition: 'left' },


    // { id: 'wait', data: { label: 'ESPERA' }, position: { x: 550, y: 100 }, draggable: false, connectable: false, selectable: false },


    { id: '1-2', source: '1', target: '2', type: 'step', label: 'Asigna predio', arrowHeadType: 'arrowclosed' },
    // { id: '1-3', source: '1', target: '3', type: 'step', label: 'Asigna predio', arrowHeadType: 'arrowclosed' },
    { id: '2-5', source: '2', target: '5', type: 'step', label: 'Envia a revisión', sourceHandle: 'envia', targetHandle: 'envia3', arrowHeadType: 'arrowclosed' },
    // { id: '3-4', source: '3', target: '4', type: 'step', label: 'Envia a revisión', sourceHandle: 'envia', arrowHeadType: 'arrowclosed' },
    // { id: '4-5', source: '4', target: 'wait', type: 'step', label: 'Envia a revisión' },

    // { id: '5-6', source: '5', target: '6', type: 'step', label: 'Aprueba todo' },

    { id: '5-2', source: '5', target: '2', type: 'step', label: 'Regresa tarea', sourceHandle: 'regresa3', targetHandle: 'regresa', arrowHeadType: 'arrowclosed' },
    // { id: '4-3', source: '4', target: '3', type: 'step', label: 'Regresa tarea', sourceHandle: 'regresa2', targetHandle: 'regresa', arrowHeadType: 'arrowclosed' },

    // { id: 'wait-5', source: 'wait', target: '5', type: 'step', label: 'llega al supervisor' },

    // { id: '4-8', source: '4', target: '8', type: 'step', label: 'Aprobado', sourceHandle: 'output', arrowHeadType: 'arrowclosed', targetPosition: 'left' },
    { id: '5-6', source: '5', target: '6', type: 'step', label: 'Aprobado', sourceHandle: 'regresa4', targetHandle: 'envia2', arrowHeadType: 'arrowclosed', targetPosition: 'left' },
    { id: '6-7', source: '6', target: '7', type: 'step', label: 'Aprobado SIG', sourceHandle: 'output', arrowHeadType: 'arrowclosed', targetPosition: 'left' },
    { id: '8-5', source: '6', target: '5', type: 'step', label: 'Regresa tarea', sourceHandle: 'regresa2', targetHandle: 'envia4', arrowHeadType: 'arrowclosed' },
    // { id: '1-9', source: '1', target: '9', type: 'step', label: 'Asigna predio', arrowHeadType: 'arrowclosed' },
    // { id: '9-10', source: '9', target: '10', type: 'step', label: 'Aprobado social', arrowHeadType: 'arrowclosed' },


  ];
  let { id } = useParams();

  React.useEffect(() => {

    setVisible(false)



    var data = { "id_consulta": "get_flujo", "id_expediente": id }
    servidorPost('/backend/', data).then((response) => {

      var data = { "id_consulta": "get_asignaciones", "id_expediente": id }
      servidorPost('/backend/', data).then((responseUsuarios) => {
        let usuarios = responseUsuarios.data;
        let flujo = response.data;
        usuarios.forEach((u) => {
          let filterList = flujo.filter((o) => o.id_tarea_next === u.id_tarea)
          if (filterList.length === 0) {
            flujo.push({
              ruta: u.id_tarea,
              id_tarea_next: u.id_tarea,
              path: '',
              usuario_nombre: u.usuario_nombre,
              descripcion: '',
              perfil: u.descripcion,
              estado: 0,
              fecha_asignacion: null,
              fecha_solucion: null
            })
          }
        })

        //Verificar aprobados

        if (flujo[0].tec === 1) {
          let filtro = flujo.filter((o) => o.path === '5-6');
          if (filtro.length === 0) {
            flujo.push({
              estado: 2,
              path: '5-6',
              id_tarea_next: 6
            })
          }
        }

        if (flujo[0].jur === 1) {
          let filtro = flujo.filter((o) => o.path === '4-8');
          if (filtro.length === 0) {
            flujo.push({
              estado: 2,
              path: '4-8',
              id_tarea_next: 8
            })
          }
        }

        let finSocial = flujo.filter((o) => o.path === '1-9');
        if(finSocial.length > 0){
          if(finSocial[0].fecha_solucion != null){
            flujo.push({
              estado: 2,
              path: '9-10',
              id_tarea_next: 10
            })
          }
        }
        

        // console.log(flujo)

        // var info = response.data;

        if (flujo.length > 0) {

          flujo.map((i) => {

            elements.map((k, e) => {
              if (k.id == i.id_tarea_next && (i.id_tarea_next === 7 || i.id_tarea_next === 8 || i.id_tarea_next === 10)) {
                elements[e].data.label = (<><p>Fin</p></>)
                elements[e].style = { background: '#81D37C' }
              }
              else if (k.id == i.id_tarea_next) {

                elements[e].data.label = (<><p>{i.perfil}</p><p>{i.usuario_nombre}</p><p>{i.estado === 2 ? moment.utc(i.fecha_solucion).format("dddd, MMMM D YYYY, h:mm:ss a") : i.estado === 0 ? null : moment.utc(i.fecha_asignacion).format("dddd, MMMM D YYYY, h:mm:ss a")}</p></>)
                elements[e].style = { background: i.estado == 1 ? '#3FA8F1' : i.estado == 0 ? '#FFFFFF' : '#81D37C' }

              } else if (k.id == i.path) {
                elements[e].style = { stroke: '#0E9700 ' }
                elements[e].animated = true
              }


            })


          })
        }

        setOpt(elements)
        setVisible(true)

      })


    })


  }, [])

  const onLoad = (reactFlowInstance) => {
    console.log('flow loaded:', reactFlowInstance);
    reactFlowInstance.fitView();
  };


  return (
    <div>
      <div id="seccion">
        <div id="titulo_seccion">Flujo</div>
        <p id="descripcion_seccion">Sección para ver el estado del proceso</p>

        {visible ? <>
          <ReactFlow
            elements={opt}
            snapToGrid={true}
            snapGrid={[15, 15]}
            onLoad={onLoad}
            nodeTypes={nodeTypes}
            className="flujo_servidumbre"
          >
            <Controls />

            {/* <Background color="#aaa" gap={16} /> */}

          </ReactFlow>
        </> : ''}



      </div>
    </div>
  );

}

export { FlujoServidumbre }

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '6px 16px',
  },
  activo: {
    backgroundColor: '#9CCB9C',
    padding: '6px 16px',
  }
}));

export function CustomizedTimeline() {
  const classes = useStyles();

  const [info, setInfo] = React.useState([]);

  let { id } = useParams();


  React.useEffect(() => {



    var data = { "id_consulta": "get_flujo", "id_expediente": id }

    servidorPost('/backend/', data).then((response) => {

      setInfo(response.data)


    })


  }, [])




  return (


    <>
      <div id="seccion">
        <div id="titulo_seccion">Flujo</div>
        <p id="descripcion_seccion">Sección para ver el estado del proceso</p>

        <div className="static">
          <Timeline align="alternate">
            {info.map((i) =>

              <>
                <TimelineItem>
                  <TimelineOppositeContent>
                    <Typography variant="body2" color="textSecondary">
                      {moment.utc(i.fecha_asignacion).format("dddd, MMMM D YYYY, h:mm:ss a")}
                    </Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot>
                      {i.estado == 1 ? <ErrorOutlineIcon /> : <CheckIcon />}

                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Paper elevation={3} className={i.estado == 1 ? classes.activo : classes.paper}>
                      <p>{i.perfil}</p>
                      <p>{i.descripcion}</p>
                      <p>Encargado: {i.usuario_nombre}</p>
                    </Paper>
                  </TimelineContent>
                </TimelineItem>

              </>
            )}

          </Timeline>
        </div>
      </div>

    </>




  );
}

const customNodeStyles = {
  padding: 10,
  textAlign: 'center',
  color: 'black',
  border: '1px solid black',
  borderRadius: 0
};

const OneTwoNode = (({ data }) => {
  return (
    <div style={customNodeStyles}>
      <Handle
        type="target"
        position="left"
      />
      <div>
        {data.label}
      </div>
      <Handle
        type="source"
        position="right"
        id="envia"
        style={{ top: 10, background: '#555' }}
      />
      <Handle
        type="target"
        position="right"
        id="regresa"
        style={{ bottom: 10, top: 'auto', background: '#555' }}
      />
    </div>
  );
});

const TwoOneNode = (({ data }) => {
  return (
    <div style={customNodeStyles}>
      <Handle
        type="target"
        position="left"
        id="envia2"
        style={{ top: 10, background: '#555' }}
      />
      <Handle
        type="source"
        position="left"
        id="regresa2"
        style={{ bottom: 10, top: 'auto', background: '#555' }}
      />
      <div>
        {data.label}
      </div>
      <Handle
        type="source"
        position="right"
        id="output"
      />
    </div>
  );
});

const TwoTwoNode = (({ data }) => {
  return (
    <div style={customNodeStyles}>
      <Handle
        type="target"
        position="left"
        id="envia3"
        style={{ top: 10, background: '#555' }}
      />
      <Handle
        type="source"
        position="left"
        id="regresa3"
        style={{ bottom: 10, top: 'auto', background: '#555' }}
      />
      <div>
        {data.label}
      </div>
      <Handle
        type="source"
        position="right"
        id="regresa4"
        style={{ top: 10, background: '#555' }}
      />
      <Handle
        type="target"
        position="right"
        id="envia4"
        style={{ bottom: 10, top: 'auto', background: '#555' }}
      />

    </div>
  );
});
