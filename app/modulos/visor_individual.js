
import React from 'react'

import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';

import GeoJSON from 'ol/format/GeoJSON';
import { Fill, Stroke, Style } from 'ol/style';
import { Vector as VectorSource } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { fromLonLat } from 'ol/proj';
import Overlay from 'ol/Overlay';
import XYZ from 'ol/source/XYZ';


import { useParams } from 'react-router-dom'
import { servidorPost } from '../js/request'


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CargaShape from './componentes/CargaShape';
import { getPermisos } from '../variables/permisos';
import variables from '../variables/var_mapa'
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import leyenda_salida from '../img/leyenda_salida_grafica.png'
import rosa_vientos from '../img/rosa_vientos.png'
import small_logo from '../img/small_logo.png'

const Mapa = () => {


  const [mapa, setMapa] = React.useState({});
  const [lectura, setLectura] = React.useState(true);
  const [data, setData] = React.useState({ variables });
  const [layers, setLayers] = React.useState({
    "geometria_verificada": true,
    "geometria_revision": false
  })
  const [mapSize, setMapSize] = React.useState({});
  let lecturaLocal = true;

  const dims = {
    a0: [1189, 841],
    a1: [841, 594],
    a2: [594, 420],
    a3: [420, 297],
    a4: [297, 210],
    a5: [210, 148],
  };

  const [layerExtent, setLayerExtent] = React.useState(null)
  const [vectorLayer, setVectorLayer] = React.useState(null)
  const [vectorLayerRev, setVectorLayerRev] = React.useState(null)
  const [session, setSession] = React.useState(0)
  const { id } = useParams();


  const handleChange = (e) => {
    const valor = e.target.name;
    const check = e.target.checked;

    if (valor === "geometria_verificada") {
      vectorLayer.setVisible(check)
    } else if (valor === "geometria_revision") {
      vectorLayerRev.setVisible(check)
    }

  }


  React.useEffect(() => {

    let vLay, vLayRev;

    const dataSession = { "id_consulta": "info2_general_predio", id_expediente: id };

    servidorPost('/backend', dataSession).then(function (response) {

      const datos = response.data[0]
      setSession(datos)

    });

    const getBloqueo = (id_exp) => {


      const data = {
        id_expediente: id_exp,
        id_consulta: 'get_observacion'
      }

      return servidorPost('/backend', data);
    }



    getPermisos().then((response) => {

      if (response.some(r => r == 10)) {
        setLectura(false)
        lecturaLocal = false;
      } else {

        var data = { id_consulta: 'tengo_predio', id_expediente: id }

        servidorPost('/backend', data).then((response) => {
          getBloqueo(id).then((r) => {
            if (r.data[0].bloqueo_predio) {
              setLectura(true)
              lecturaLocal = true;
            } else {
              setLectura(!response.data[0].exists)
              lecturaLocal = !response.data[0].exists;
            }
          })

        });

      }
    })


    var datos = { "id_consulta": "get_geometria_predio", "id_expediente": id }


    servidorPost('/backend', datos).then(function (response) {

      const data = response.data;

      var vectorSource = new VectorSource();
      var vectorSourceRev = new VectorSource();

      data.forEach((d) => {
        if (d.tipo === 'geometria_verificada') {
          if (d.geojson.features != null) {
            vectorSource = new VectorSource({
              features: new GeoJSON().readFeatures(d.geojson, {
                featureProjection: 'EPSG:3857'
              }),
            });
            vLay = new VectorLayer({
              source: vectorSource,
              style: new Style({
                stroke: new Stroke({
                  color: 'rgb(59, 246, 12)',
                  width: 1
                }),
                fill: new Fill({
                  color: 'rgb(59, 246, 12, 0.5)'
                }),
              })
            })
            setVectorLayer(vLay);
          } else {
            toast.info("Predio sin geometria");
          }

        } else if (d.tipo === 'geometria_revision') {
          if (d.geojson.features != null) {
            vectorSourceRev = new VectorSource({
              features: new GeoJSON().readFeatures(d.geojson, {
                featureProjection: 'EPSG:3857'
              }),
            });
            vLayRev = new VectorLayer({
              source: vectorSourceRev,
              style: new Style({
                stroke: new Stroke({
                  color: 'rgb(129, 1, 146)',
                  width: 1
                }),
                fill: new Fill({
                  color: 'rgb(129, 1, 146, 0.5)'
                }),
              })

            })
            setVectorLayerRev(vLayRev);
          }

        }
      })

      if (vLayRev !== undefined) {
        if (vLay === undefined) {
          vLayRev.setVisible(true)
        } else {
          vLayRev.setVisible(false)
        }
      }


      var token = "pk.eyJ1IjoiZGZyb2RyaWd1ZXpsIiwiYSI6ImNqeTRyYjB3MjAwMnMzZnB2dXVmdmNwOHoifQ.jZhX17AepTfhI8xoPOpvvg"

      var base = new TileLayer({
        source: new XYZ({
          url: 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}?access_token=' + token,
          crossOrigin: "Anonymous"
        })
      });

      const container = document.getElementById('popup');
      const content = document.getElementById('popup-content');
      const closer = document.getElementById('popup-closer');

      const overlay = new Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
          duration: 250,
        },
      });

      closer.onclick = function () {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
      };

      const map = new Map({
        target: 'visor1',
        overlays: [overlay],
        layers:
          vLay !== undefined && vLayRev !== undefined ?
            [base, vLay, vLayRev] :
            vLay === undefined && vLayRev === undefined ?
              [base] :
              vLay === undefined ?
                [base, vLayRev] :
                vLayRev === undefined ?
                  [base, vLay] : null
        ,
        view: new View({
          center: fromLonLat([-74.02, 4.62]),
          zoom: 10
        })
      });

      setMapa(map);

      setLayerExtent(vLay !== undefined ?
        vLay.getSource().getExtent() :
        vLayRev.getSource().getExtent());

      let estats = {
        "Geometria verificada": [2],
        "Geometria en revisión": [1]
      };

      // Popup
      map.on('singleclick', function (evt) {
        const coordinate = evt.coordinate;
        let mensaje = "";
        let id = "";

        let feature = map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
          id = layer.get('id')

          return feature;

        }, {
          hitTolerance: 2
        });

        const id_expediente_click = feature.values_.id_expediente;
        const estado = feature.values_.estado === null || feature.values_.estado === 2 ?
          "Geometria verificada" : "Geometria en revisión";
        const id_geom = feature.values_.id;

        if (!lecturaLocal) {
          if (feature) {
            mensaje = '<p> ' + id_expediente_click + '</p>';
            mensaje = mensaje + '<p>' + estado + '</p>';
            let selectEstados = '<select name="estados" id="estados" >';
            Object.keys(estats).forEach((es) => {
              selectEstados = selectEstados + '<option value="' + estats[es][0] + '">' + es + '</option>';
            })
            selectEstados = selectEstados + '</select>';
            mensaje = mensaje + selectEstados;
            mensaje = mensaje + '<button class="primmary" id="estado_button" type="submit">Cambiar estado</button>';
            content.innerHTML = mensaje;
            overlay.setPosition(coordinate);
            container.style.visibility = "visible";
            const selectEstadosComponent = document.getElementById("estados");
            const cambioEstado = document.getElementById("estado_button");
            cambioEstado.onclick = () => {
              let selectedValue = selectEstadosComponent.options[selectEstadosComponent.selectedIndex].value;
              let dataPredio = {
                id_consulta: 'update_predio',
                id_expediente: id_expediente_click,
                id: id_geom,
                estado: selectedValue
              }

              servidorPost('/backend', dataPredio).then((response) => {
                if (response.data.length > 0) {
                  const id_exp_return = response.data[0].id_expediente;
                  toast.success("Poligono actualizado para el expediente " + id_exp_return)
                }
              })
            }
          }
        }




      });

    })




  }, []);

  if (vectorLayer != null) {
    vectorLayer.set('id', 'avaluos')
  }

  if (vectorLayerRev != null) {
    vectorLayerRev.set('id', 'avaluos2')
  }

  if (layerExtent) {
    mapa.getView().fit(layerExtent);
  }

  variables.exportar = () => {
    document.body.style.cursor = 'progress';
    const dim = dims['a4'];
    const resolution = 150;
    const width = Math.round((dim[0] * resolution) / 25.4);
    const height = Math.round((dim[1] * resolution) / 25.4);

    const size = mapa.getSize();
    const viewResolution = mapa.getView().getResolution();

    mapa.once('rendercomplete', () => {
      const mapCanvas = document.createElement('canvas');
      mapCanvas.width = width;
      mapCanvas.height = height;
      const mapContext = mapCanvas.getContext('2d');
      Array.prototype.forEach.call(
        document.querySelectorAll('.ol-layer canvas'),
        function (canvas) {
          if (canvas.width > 0) {
            const opacity = canvas.parentNode.style.opacity;
            mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
            const transform = canvas.style.transform;
            // Get the transform parameters from the style's transform matrix
            const matrix = transform
              .match(/^matrix\(([^\(]*)\)$/)[1]
              .split(',')
              .map(Number);
            // Apply the transform to the export map context
            CanvasRenderingContext2D.prototype.setTransform.apply(
              mapContext,
              matrix
            );
            mapContext.drawImage(canvas, 0, 0);
          }
        }
      );

      const currentDate = new Date();

      const pdf = new jsPDF('landscape', undefined, "a4");
      pdf.rect(2, 2, pdf.internal.pageSize.width - 70, pdf.internal.pageSize.height - 4, 'S');
      pdf.rect(pdf.internal.pageSize.width - 66, 2, 64, pdf.internal.pageSize.height - 4, 'S');
      pdf.addImage(
        mapCanvas.toDataURL('image/jpeg'),
        'JPEG',
        3,
        9,
        pdf.internal.pageSize.width - 72,
        190
      );
      pdf.addImage(
        rosa_vientos,
        'PNG',
        pdf.internal.pageSize.width - 93,
        5,
        20,
        20
      );
      pdf.addImage(
        small_logo,
        'PNG',
        pdf.internal.pageSize.width - 45,
        10,
        25,
        20
      );
      pdf.setFontSize(7);
      pdf.text("DIRECCIÓN DE BIENES RAÍCES", pdf.internal.pageSize.width - 53, 40);
      pdf.text("SISTEMA DE INFORMACIÓN GEOGRÁFICA", pdf.internal.pageSize.width - 58, 45);
      pdf.setFontSize(11);
      pdf.text("Matrícula inmobiliaria: ", pdf.internal.pageSize.width - 54, 105);
      pdf.text(session.num_mi, pdf.internal.pageSize.width - 50, 110);
      pdf.text("Dirección: ", pdf.internal.pageSize.width - 46, 115);
      pdf.text(session.dir_act, pdf.internal.pageSize.width - 53, 120);
      pdf.text("Chip catastral: ", pdf.internal.pageSize.width - 48, 125);
      pdf.text(session.chip_cat, pdf.internal.pageSize.width - 64, 130);
      pdf.text("Cédula catastral: ", pdf.internal.pageSize.width - 50, 135);
      pdf.text(session.ced_cat, pdf.internal.pageSize.width - 64, 140);
      pdf.text("Código predial: ", pdf.internal.pageSize.width - 50, 145);
      pdf.text(session.cod_predial, pdf.internal.pageSize.width - 64, 150);
      // pdf.text("Chip catastral: " + id, pdf.internal.pageSize.width - 64, 110);
      // pdf.text("Cédula catastral: " + id, pdf.internal.pageSize.width - 64, 115);
      // pdf.text("Código predial: " + id, pdf.internal.pageSize.width - 64, 120);
      pdf.addImage(
        leyenda_salida,
        'PNG',
        10,
        130,
        50,
        30
      );
      pdf.setFontSize(7);
      const lines = pdf.splitTextToSize(`Generado desde el módulo web de depuración predial de la EAAB`, (pdf.internal.pageSize.width  - (pdf.internal.pageSize.width - 63) - 3));
      pdf.text(lines, pdf.internal.pageSize.width - 63, 185);
      pdf.text(`Fecha: ${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`, pdf.internal.pageSize.width - 63, 180);
      pdf.save('map.pdf');
      // Reset original map size
      mapa.setSize(size);
      mapa.getView().setResolution(viewResolution);
      document.body.style.cursor = 'auto';
    })


    // Set print size
    const printSize = [width, height];
    mapa.setSize(printSize);
    const scaling = Math.min(width / size[0], height / size[1]);
    mapa.getView().setResolution(viewResolution / scaling);

  }


  return (
    <div id="seccion">


      <div id="titulo_seccion">Visor Geográfico</div>
      <p id="descripcion_seccion">En esta sección usted puede visualizar la información cartográfica del predio</p>
      <div id="visor1" >
      </div>
      <div id="leyenda_capas">
        <p id="titulo">Capas</p>
        <div>
          <br />
          {Object.keys(data.variables).map((i, e) =>
            <>
              {i !== "exportar" ?
                data.variables[i].id.includes("pred") && i !== "exportar" ?
                  <div className="item" >
                    <input type="checkbox" id={data.variables[i].id} name={data.variables[i].id_html}
                      defaultChecked={layers[data.variables[i].id_html]}
                      onChange={handleChange} />
                    <label htmlFor={data.variables[i].id}> {data.variables[i].titulo}
                    </label>
                    <br />
                  </div> : null : null}
            </>
          )}
        </div>
      </div>
      <div id="leyenda_predio">
        <p id="titulo">Leyenda</p>
        <div>
          {Object.keys(data.variables).map((i, e) =>
            <>
              {i !== "exportar" ?
                data.variables[i].id.includes("pred") ?
                  <div className="item" >
                    <span style={{ backgroundColor: data.variables[i].fill }}></span>
                    <p>{data.variables[i].titulo}</p>
                  </div> : null : null}
            </>
          )}
        </div>
      </div>
      <a id="image-download" download="map.png"></a>

      <ToastContainer />
      {!lectura ?
        <CargaShape id_expediente={id} /> :
        null
      }

    </div>

  )
}


export default Mapa;

