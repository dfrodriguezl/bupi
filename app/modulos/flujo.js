import React, { Component } from 'react';
import Flowchart from 'react-simple-flowchart';
 
 





const Flujo=()=>{
 

    const code =
        `st=>start: Inicio
        e=>end: Fin
        para=>parallel: Asignación|node1
        op1=>operation: Técnico|node2
        op2=>operation: Abogado|node3
        op3=>operation: Sup. Jurídico|node4
        op4=>operation: Sup. Técnico|node5

        st(right)->para
        para(path1, bottom)->op1(right)->op4
        para(path3, right)->op2(right)->op3(bottom)->op4->e
`;

    const opt = {
        x: 0,
        y: 0,
        'line-width': 1.5,
        'line-length': 15,
        'text-margin': 10,
        'font-size': 12,
        'font-color': 'black',
        'line-color': '#7B7B7B',
        'element-color': '#7B7B7B',
        fill: 'white',
        'yes-text': 'yes',
        'no-text': 'no',
        'arrow-end': 'block',
        scale: 1,
        flowstate: {
          node1: { fill: '#fff' },
          node2: { fill: '#fff' },
        },
      };
 

    
    return (
      <div>
        <div id="seccion">
        <div id="titulo_seccion">Flujo</div>
        <p id="descripcion_seccion">Sección para ver el estado del proceso</p>
        
        <Flowchart
          chartCode={code}
          options={opt}
            />
        </div>  
      </div>
    );
  
}

export {Flujo}