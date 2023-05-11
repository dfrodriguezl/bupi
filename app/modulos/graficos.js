import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Chart from 'react-apexcharts'

import { servidorPost } from '../js/request'


class Barras extends Component {




  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
          id: 'apexchart-example'
        },
        legend: {
          show: false
        }
      },
      series: [{
        name: 'series-1',
        data: []
      }]
    }
  }


  componentDidMount() {

    var datos = { "id_consulta": this.props.id_consulta }

    servidorPost('/backend', datos).then((response) => {
      const data = response.data[0];

      console.log(data)
      this.setState({
        options: {
          chart: {
            id: 'apexchart-example'
          },
          xaxis: {
            categories: data["categoria"]
          },

          title: {
            text: this.props.titulo,
            style: {
              fontSize: '12px',
              fontFamily: 'Work Sans',
              fontWeight: '144',
              color: '#263238'
            },
          },
          plotOptions: {
            bar: {
              distributed: true,
              dataLabels: {
                position: 'top'
              },
            }
          },
          dataLabels: {
            enabled: true,
            enabledOnSeries: undefined,
            formatter: function (val, opts) {
              return val
            },
            textAnchor: 'middle',
            distributed: false,
            offsetX: 0,
            offsetY: -20,
            style: {
              fontSize: '12px',
              fontFamily: 'Work Sans',
              colors: ["#06357A"]
            },

          },
          theme: {

            palette: this.props.paleta,

          }
        },
        series: [{
          name: 'series-1',
          data: data["data"]
        }],

      })


    });

  }




  render() {
    return (
      <Chart options={this.state.options} series={this.state.series} type="bar" height={300} />
    )
  }
}


/*
var component = ReactDOM.render(<App id_consulta="grafico1" titulo="Avalúos por cliente" />, document.getElementById('grafico1'));

var component = ReactDOM.render(<App id_consulta="grafico2" titulo="Avalúos por año"  />, document.getElementById('grafico2'));

var component = ReactDOM.render(<App id_consulta="grafico5" titulo="Estatus del avalúo" />, document.getElementById('grafico5'));
*/

class Dona extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

      series: [],
      options: {
        chart: {

          type: 'pie',
        },
        colors: ['#FFB527', '#154A8A', '#E31414', '#FF8300', '#003B71', '#9DBEFF', '#6699FF'],
        legend: {
          show: false
        },
        labels: [],
        theme: {

          palette: this.props.paleta,

        }
      },


    };
  }


  componentDidMount() {

    var datos = { "id_consulta": this.props.id_consulta }

    servidorPost('/backend', datos).then((response) => {
      const data = response.data[0];

      console.log(data)
      this.setState({
        series: data["data"].map(i => Number(i)),
        options: {
          chart: {
            type: 'pie',
            // width: '100%',
            // marginLeft: 'auto',
            // marginRight: 'auto'
          },
          labels: data["categoria"],
          title: {
            text: this.props.titulo,
            align: 'center',
            style: {
              fontSize: '12px',
              fontFamily: 'Work Sans', 
              fontWeight: '400',
              color: '#263238'
            },
          },
          legend: {
            show: true,
            position: 'bottom',
            fontFamily: 'Work Sans'
          }
        },
      })


    });

  }




  render() {
    return (

      <div id="chart">
        <Chart options={this.state.options} series={this.state.series} type="pie" width="300" />
      </div>

    );
  }
}



/*
var component = ReactDOM.render(<Dona id_consulta="grafico3" titulo="Tipos de avalúo" />, document.getElementById('grafico3'));
  
var component = ReactDOM.render(<Dona id_consulta="grafico4" titulo="Estado de la programación" />, document.getElementById('grafico4'));
*/

class Date extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

      series: [{
        name: '',
        data: []
      }],
      options: {
        chart: {
          type: 'area',
        },
        xaxis: {
          type: 'datetime',
        }
      },


    };
  }


  componentDidMount() {

    var datos = { "id_consulta": this.props.id_consulta }

    servidorPost('/backend', datos).then((response) => {
      const data = response.data;
      console.log(data)
      var array = []
      for (var i = 0; i < data.length; i++) {
        var obj = data[i];
        var elemento = [obj["grupo"], parseInt(obj["cuenta"])]
        array.push(elemento)

      }
      console.log(array)


      this.setState({
        series: [{
          name: 'Total',
          data: array
        }],
        options: {
          chart: {
            type: 'area',
            stacked: false,
            height: 350,
            zoom: {
              type: 'x',
              enabled: true,
              autoScaleYaxis: true
            },
            toolbar: {
              autoSelected: 'zoom'
            }
          },
          title: {
            text: this.props.titulo,
            style: {
              fontSize: '12px',
              fontFamily: 'Work Sans', 
              fontWeight: '144',
              color: '#263238'
            },
          },
          dataLabels: {
            enabled: false
          },
          markers: {
            size: 0,
          },
          fill: {
            type: 'solid',
            colors: ['#06357A']
          },
          yaxis: {
            labels: {
              formatter: function (val) {
                return (val / 1).toFixed(0);
              },
            },
            title: {
              text: 'Total'
            },
          },
          xaxis: {
            type: 'datetime',
          },
          tooltip: {
            shared: false,
            y: {
              formatter: function (val) {
                return (val / 1).toFixed(0)
              }
            }
          }
        },
      })


    });

  }


  render() {
    return (


      <div id="chart">
        <Chart options={this.state.options} series={this.state.series} type="area" height={350} />
      </div>


    );
  }
}

/*
var component = ReactDOM.render(<Date id_consulta="grafico6" titulo="Avalúos solicitados por fecha" width="700"/>, document.getElementById('grafico6'));
*/

const Form = (props) => {
  const { estadistica1 } = props;

  return (
    <>
      <div id="seccion" className="sec2">
        <Dona id_consulta="grafico_departamento" titulo="Número de predios por departamento" paleta="palette1" />
        <Dona id_consulta="grafico_titularidad" titulo="Número de predios por titularidad" paleta="palette1" />
      </div>
      <div id="seccion" className="sec2">
        <Dona id_consulta="grafico_publico" titulo="Número de predios uso público/fiscal" paleta="palette1" />
        <Dona id_consulta="grafico_administrador" titulo="Número de predios por administrador" paleta="palette1" />
      </div>
      <div id="seccion" className="sec2">
        <Dona id_consulta="grafico_transporte" titulo="Número de predios por modo de transporte" paleta="palette1" />
        {estadistica1}
        {/* <Dona id_consulta="grafico_administrador" titulo="Número de predios por administrador" paleta="palette1" /> */}
      </div>

      {/* <div id="seccion" className="sec2">

        <Dona id_consulta="grafico2" titulo="Número de predios por clase de suelo" paleta="palette10" />

        <Dona id_consulta="grafico3" titulo="Tipologia del impuesto" paleta="palette10" />

      </div> */}

      {/* <div id="seccion" className="sec2">

        <Dona id_consulta="grafico6" titulo="Depuración jurídica" paleta="palette10" />

        <Dona id_consulta="grafico7" titulo="Depuración técnica" paleta="palette10" />


      </div> */}

      {/* <div id="seccion">
        <p><b>En revisión:</b> Expedientes que los tiene el supervisor en su bandeja de entrada para su revisión.</p>
        <p><b>En gestión:</b> Expedientes que los tiene el técnico ó jurídico para su trabajo, estos expedientes ya tienen 13 campos diligenciados en el caso del componente técnico y 14 campos en el caso del componente jurídico.</p>
        <p><b>Asignado:</b> Expedientes que los tiene el técnico ó jurídico para su trabajo de depuración pero que no tienen los 13 campos diligenciados en el componente técnico ó los 14 campos diligenciados en el componente jurídico.</p>
        <p><b>SI:</b> Expedientes que ya han sido aprobados por el supervisor técnico ó jurídico.</p>
      </div> */}


      {/* <div id="seccion">

        <Date id_consulta="grafico4" titulo="Número de transacciones" />

      </div> */}
    </>
  )


}


export default Form;
