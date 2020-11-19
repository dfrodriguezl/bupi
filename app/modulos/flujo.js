import React, { Component } from 'react';
import { useParams } from 'react-router-dom'
import ReactFlow,{Controls,
  Background} from 'react-flow-renderer';
 

import {servidorPost} from '../js/request'




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




const Flujo=()=>{
 

  const[code,setCode]=React.useState(null);
  const[opt,setOpt]=React.useState([]);
  const[visible,setVisible]=React.useState(false);

  const elements = [
    { id: '1', type: 'input', data: { label: 'Inicio' }, position: { x: 0, y: 100 } },
    // you can also pass a React Node as a label
  
    { id: '2', data: { label: 'Técnico' }, position: { x: 150, y: 0 },className:'nodo' },
    { id: '3', data: { label: 'Juridico' }, position: { x: 150, y: 200 },className:'nodo' },
    { id: '4', data: { label: 'Sup. Juridico' }, position: { x: 450, y: 200 },className:'nodo' },
    { id: '5', data: { label: 'Sup. Técnico' }, position: { x: 450, y: 0 },className:'nodo' },
    { id: '6', type: 'output', data: { label: 'Final' }, position: { x: 750, y: 0 },className:'nodo' },
  
    { id: 'wait', data: { label: 'ESPERA' }, position: { x: 550, y: 100 }, },
    

    { id: '1-2', source: '1', target: '2',type: 'step', label: 'Asigna predio' },
    { id: '1-3', source: '1', target: '3',type: 'step', label:'Asigna predio' },
    { id: '2-5', source: '2', target: 'wait',type: 'step', label:'Enviá a revisión' },
    { id: '3-4', source: '3', target: '4',type: 'step', label: 'Enviá a revisión' },
    { id: '4-5', source: '4', target: 'wait',type: 'step',label:'Enviá a revisión' },
    
    { id: '5-6', source: '5', target: '6', type: 'step',  label: 'Aprueba todo' },
    
    { id: '5-2', source: '5', target: '2',type: 'step', label:'Regresa tarea'},
    { id: '5-3', source: '5', target: '3', type: 'step', label: 'Regresa tarea' },

    { id: 'wait-5', source: 'wait', target: '5', type: 'step', label: 'llega al supervisor' },
    
    
  ];
  let { id } = useParams();

  React.useEffect(() => {
     
    setVisible(false)

   

    var data={"id_consulta":"get_flujo","id_expediente":id}
    servidorPost('/backend/', data).then((response) => {
      
      console.log("hola")
      console.log(response.data)
     
      var info = response.data;

      if (info.length>0) {
        
      
      info.map((i) => {
        
        elements.map((k,e) => {
          if (k.id==i.id_tarea_next) {

            elements[e].data.label =(<><p>{i.perfil}</p><p>{i.usuario_nombre}</p></>)
            elements[e].style = { background: i.estado==1?'#81D37C':'#3FA8F1'}
            
          } else if (k.id==i.path) {
            elements[e].style = { stroke: '#0E9700 ' }
            elements[e].animated=true
          }
          
        })


      })
    }
      console.log(elements)

      setOpt(elements)
      setVisible(true)
    })


},[])

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
            >
              <Controls />

              <Background color="#aaa" gap={16} />

            </ReactFlow>
          </> : ''}
            
        
          
        </div>  
      </div>
    );
  
}

export { Flujo }

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

  const [info, setInfo] =React.useState([]);
  
  let { id } = useParams();


  React.useEffect(() => {
     
    

    var data = { "id_consulta": "get_flujo", "id_expediente": id }
    
    servidorPost('/backend/', data).then((response) => {
      
      setInfo(response.data)


    })


},[])




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
                  {i.estado==1?<ErrorOutlineIcon/>:<CheckIcon />}
              
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Paper elevation={3} className={i.estado==1 ? classes.activo : classes.paper}>
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
