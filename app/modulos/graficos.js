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
              fontFamily: 'Helvetica, Arial, sans-serif',
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
var component = ReactDOM.render(<App id_consulta="grafico1" titulo="Aval??os por cliente" />, document.getElementById('grafico1'));

var component = ReactDOM.render(<App id_consulta="grafico2" titulo="Aval??os por a??o"  />, document.getElementById('grafico2'));

var component = ReactDOM.render(<App id_consulta="grafico5" titulo="Estatus del aval??o" />, document.getElementById('grafico5'));
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
            type: 'pie'
          },
          labels: data["categoria"],
          title: {
            text: this.props.titulo,
            style: {
              fontSize: '12px',
              fontWeight: '144',
              color: '#263238'
            },
          },
          legend: {
            show: true,
            position: 'bottom'
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
var component = ReactDOM.render(<Dona id_consulta="grafico3" titulo="Tipos de aval??o" />, document.getElementById('grafico3'));
  
var component = ReactDOM.render(<Dona id_consulta="grafico4" titulo="Estado de la programaci??n" />, document.getElementById('grafico4'));
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
var component = ReactDOM.render(<Date id_consulta="grafico6" titulo="Aval??os solicitados por fecha" width="700"/>, document.getElementById('grafico6'));
*/

const Form = (props) => {
  const { estadistica1 } = props;

  return (
    <>
      <div id="seccion" className="sec2">
        <Dona id_consulta="grafico_departamento" titulo="N??mero de predios por departamento" paleta="palette1" />
        <Dona id_consulta="grafico_titularidad" titulo="N??mero de predios por titularidad" paleta="palette1" />
      </div>
      <div id="seccion" className="sec2">
        <Dona id_consulta="grafico_publico" titulo="N??mero de predios uso p??blico/fiscal" paleta="palette1" />
        <Dona id_consulta="grafico_administrador" titulo="N??mero de predios por administrador" paleta="palette1" />
      </div>
      <div id="seccion" className="sec2">
        <Dona id_consulta="grafico_transporte" titulo="N??mero de predios por modo de transporte" paleta="palette1" />
        {estadistica1}
        {/* <Dona id_consulta="grafico_administrador" titulo="N??mero de predios por administrador" paleta="palette1" /> */}
      </div>

      {/* <div id="seccion" className="sec2">

        <Dona id_consulta="grafico2" titulo="N??mero de predios por clase de suelo" paleta="palette10" />

        <Dona id_consulta="grafico3" titulo="Tipologia del impuesto" paleta="palette10" />

      </div> */}

      {/* <div id="seccion" className="sec2">

        <Dona id_consulta="grafico6" titulo="Depuraci??n jur??dica" paleta="palette10" />

        <Dona id_consulta="grafico7" titulo="Depuraci??n t??cnica" paleta="palette10" />


      </div> */}

      {/* <div id="seccion">
        <p><b>En revisi??n:</b> Expedientes que los tiene el supervisor en su bandeja de entrada para su revisi??n.</p>
        <p><b>En gesti??n:</b> Expedientes que los tiene el t??cnico ?? jur??dico para su trabajo, estos expedientes ya tienen 13 campos diligenciados en el caso del componente t??cnico y 14 campos en el caso del componente jur??dico.</p>
        <p><b>Asignado:</b> Expedientes que los tiene el t??cnico ?? jur??dico para su trabajo de depuraci??n pero que no tienen los 13 campos diligenciados en el componente t??cnico ?? los 14 campos diligenciados en el componente jur??dico.</p>
        <p><b>SI:</b> Expedientes que ya han sido aprobados por el supervisor t??cnico ?? jur??dico.</p>
      </div> */}


      {/* <div id="seccion">

        <Date id_consulta="grafico4" titulo="N??mero de transacciones" />

      </div> */}
    </>
  )


}


export default Form;
