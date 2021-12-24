import React from 'react';


import variables from '../variables/var_mapa'

const Leyenda = ({ data_leyenda }) => {
  // Declare a new state variable, which we'll call "count"
  const [data, setData] = React.useState({ variables });

  return (
    <div id="leyenda">
      <p id="titulo">Leyenda</p>
      <div>
        {Object.keys(data_leyenda).map((i, e) =>
          <>
            { i !== "exportar" ?
            data.variables[i].id.includes("layer") ?
              <div className="item" >
                <span style={{ backgroundColor: data.variables[i].fill }}></span>
                <p>{data.variables[i].titulo}</p>
              </div> : null : null
            }

          </>
        )}
      </div>
    </div>
  );
}

export default Leyenda;