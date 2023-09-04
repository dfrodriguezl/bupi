import React, { useState, useEffect } from 'react';
import 'chart.js/auto';
import { Chart as ChartJS, LineController, LineElement, PointElement, LinearScale, Title } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { servidorPost } from '../js/request'
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(LineController, LineElement, PointElement, LinearScale, Title);

ChartJS.register(ChartDataLabels);

const PieChart = ({id_consulta, titulo}) => {

    // let data = {
    //     labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    //     datasets: [
    //       {
    //         label: '# of Votes',
    //         data: [12, 19, 3, 5, 2, 3],
    //         backgroundColor: [
    //           'rgba(255, 99, 132, 0.2)',
    //           'rgba(54, 162, 235, 0.2)',
    //           'rgba(255, 206, 86, 0.2)',
    //           'rgba(75, 192, 192, 0.2)',
    //           'rgba(153, 102, 255, 0.2)',
    //           'rgba(255, 159, 64, 0.2)',
    //         ],
    //         borderColor: [
    //           'rgba(255, 99, 132, 1)',
    //           'rgba(54, 162, 235, 1)',
    //           'rgba(255, 206, 86, 1)',
    //           'rgba(75, 192, 192, 1)',
    //           'rgba(153, 102, 255, 1)',
    //           'rgba(255, 159, 64, 1)',
    //         ],
    //         borderWidth: 1,
    //       },
    //     ],
    // };

    // return (
    //     <div>
    //         <Pie data={data} />
    //     </div>        
    //     );

    let categorias = [
        "INCO",
        "MINISTERIO DE TRANSPORTE",
        "PARTICULAR / ANI",
        "DESARROLLO VIAL DE NARIÑO S.A. DEVINAR S.A. NIT 900.125.507-4 ACTUANDO COMO DELEGATARIA DE LA AGENCIA NACIONAL DE INFRAESTRUCTURA",
        "OTROS",
        "ANI",
        "MUNICIPIO DE SINCELEJO",
        "PARTICULAR",
        "INVIAS / PARTICULAR",
        "FERROVIAS",
        "MINISTERIO DE OBRAS PUBLICAS",
        "MUNICIPIO DE CAJAMARCA TOLIMA",
        "INVIAS",
        "CORPORACION AUTONOMA REGIONAL PARA LA DEFENSA DE LA MESETA DE BUCARAMANGA C.D.M.B.",
        "FONDO NACIONAL DE VIAS",
        "LA NACIÓN",
        "CABILDO INDIGENA INGA DE SAN PEDRO"
      ]

      let valores = [
        2276,
        1,
        1,
        1,
        14,
        2577,
        1,
        242,
        48,
        2,
        1,
        1,
        11219,
        2,
        8,
        3,
        2
      ]

    let backgroundColor = ['#FFB527', '#154A8A', '#FF8300', '#003B71', '#9DBEFF', '#6699FF'];
    // console.log(variables.state)
    const [data, setData] = useState({
        labels: [],

        datasets: [
            {
                label: '',
                // labels: myLabels,
                backgroundColor: [],
                data: []
            }
        ]
    }
        
    // {
    // //   labels: [],
    //   labels: categorias,
  
    //   datasets: [
    //       {
    //           label: 'Total',
    //           // labels: myLabels,
    //           backgroundColor: ['#FFB527', '#154A8A', '#E31414', '#FF8300', '#003B71', '#9DBEFF', '#6699FF'],
    //           data: valores
    //       }
    //   ]
    // }    
    );

    const [total, setTotal] = useState(0)

    function getColor() {
        const randomIndex = Math.floor(Math.random() * backgroundColor.length);
        return backgroundColor[randomIndex];
    }

    

    useEffect(() => {

        var datos = { "id_consulta": id_consulta }

        servidorPost('/backend', datos).then((response) => {
            const data = response.data[0];
      
            console.log(data, "graficos", Number(data["data"][0]))

            const colores = [];

            let datos = data["data"].map(i => Number(i));

            let sum = 0;
            
            datos.forEach((value) => {
                sum += value;
            });

            setTotal(sum);

            for (let i = 0; i < data["categoria"].length; i++) {
                const randomElement = getColor();
                colores.push(randomElement);
            }
            
            console.log("colores", colores)

            let dataP = {
              labels: data["categoria"],
              datasets: [
                {
                  label: 'Total',
                  // labels: myLabels,
                  backgroundColor: colores,
                  data: data["data"].map(i => Number(i))
                }
              ]
            }
        
            setData(dataP)

            // let opciones = {
            //     title: {
            //         display: true,
            //         text: titulo
            //     },
            //     plugins: {
            //         datalabels: {
            //           anchor: 'end', // Set the position of the value labels
            //           align: 'top', // Set the alignment of the value labels
            //           formatter: (value) => `${value}`, // Format the value labels as desired
            //           color: '#000', // Color of the value labels
            //           font: {
            //             weight: 'bold', // Font weight of the value labels
            //           },
            //         },
            //     },
            //     legend: {
            //       position: 'bottom',
            //       align: 'start',
            //       fullWidth: true,
            //       labels: {
            //         boxWidth: 20,
            //         fontColor: 'black',
            //         fontSize: 12,
            //         usePointStyle: true
            //       }
            //     },
            //     tooltips: {
            //         enabled:true
            //     }
            // }

            // setData(opciones)
      
        });       


    }, [id_consulta]);
  
    return (
      <div className="charts">
        {/* <h2 className="charts__subtitle" id="title">{titulo}</h2> updateMode="resize"*/}
        <Pie
          data={data}
          options={{
                title: {
                    display: true,
                    text: "titulo"
                },
                legend: {
                  position: 'bottom',
                  align: 'start',
                //   fullWidth: true,
                  labels: {
                    boxWidth: 20,
                    fontColor: 'black',
                    fontSize: 12,
                    usePointStyle: true
                  }
                },
                plugins: {
                    title: {
                        display: true,
                        font: 'Work Sans',
                        text: titulo
                    },
                    maintainAspectRatio:true,
                    datalabels: {
                      formatter: (value) => `${((value/total)*100).toFixed(2)} %`, // Format the value labels as desired
                      color: '#fff', // Color of the value labels
                      font: {
                        weight: 'bold', // Font weight of the value labels
                      },
                    },
                    legend: {
                        position: 'bottom',
                        align: 'start', //fullWidth: true, fullSize: false,
                        maxHeight: 100,   
                        labels: {
                            boxWidth: 20,
                            fontColor: 'black',
                            fontSize: 12,
                            filter: (v1,v2) => {
                                console.log("ob1",v1,"ob2",v2,"ind",v2.labels.indexOf(v1.text))
                                let position = v2.labels.indexOf(v1.text);
                                let valor = v2.datasets[0].data[position];
                                console.log("val",v2.datasets[0].data[position])
                                if(valor > 10) {
                                    return v1;
                                }                            
                            },    
                            font: 'Work Sans',
                            maxWidth: 100,
                            usePointStyle: true
                        }
                    }
                },
                tooltips: {
                    enabled:true
                }
            }}
        />
      </div>
    );
  }

  
export default PieChart;