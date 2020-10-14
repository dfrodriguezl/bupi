import React,{Component} from 'react';


import variables from '../variables/var_mapa'

const Leyenda=()=> {
    // Declare a new state variable, which we'll call "count"
    const [data, setData] = React.useState({variables});
  
    return (
      <div id="leyenda">
        <p id="titulo">Leyenda</p>
              <div>
                    {Object.keys(data.variables).map((i, e) => 
                        <>
                        
                        <div className="item" >
                        <span style={{ backgroundColor: data.variables[i].fill }}></span>
                        <p>{data.variables[i].titulo}</p>
                        </div>
                        </>
                    )}
              </div>
      </div>
    );
  }

export default Leyenda;