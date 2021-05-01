
import React from 'react'
import { render } from 'react-dom'

import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';

import GeoJSON from 'ol/format/GeoJSON';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {fromLonLat} from 'ol/proj';
import Overlay from 'ol/Overlay';
import XYZ from 'ol/source/XYZ';
import MVT from 'ol/format/MVT';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import TileGrid from 'ol/tilegrid/TileGrid';

import {get as getProjection} from 'ol/proj';


import { useParams } from 'react-router-dom'
import {url,servidorPost} from '../js/request'


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Mapa = () => {
  

  const [puntos, setPuntos] = React.useState(false);
  const [mapa, setMapa] = React.useState({});

/*
  React.useEffect(() => {
       
    var datos={"id_consulta":"mapa_avaluos"}

    servidor.servidorPost('/backend',datos).then(function(response){
    
    const data = response.data[0]["geojson"];
    console.log(data)
    var vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(data,{
        featureProjection: 'EPSG:3857'
      }),
    });
      
    var vectorLayer = new VectorLayer({
      source: vectorSource,
      style:new Style({
        image: image,
      }),
    });
      
    vectorLayer.set('id','avaluos')
  
      
      var map = new Map({

        target: 'visor',
        overlays: [overlay],
        layers: [
          new TileLayer({
            source: new OSM()
          }),
          vectorLayer
        ],
        view: new View({
          center: fromLonLat([-74.02, 4.62]),
          zoom: 10
        })
      });



      setMapa(map)


    }).catch((error) => {
      


  });
    
    
}, []);
*/
  let { id } = useParams();
  React.useEffect(() => {
  

    var datos={"id_consulta":"get_geometria_predio","id_expediente":id}

    console.log(datos)

    servidorPost('/backend', datos).then(function (response) {
    
      const data = response.data[0]["geojson"];
      console.log(data)


      var vectorSource = new VectorSource();


      var vectorLayer = new VectorLayer({
        source: vectorSource,
      });


      if (data.features !== null) {
        vectorSource = new VectorSource({
          features: new GeoJSON().readFeatures(data, {
            featureProjection: 'EPSG:3857'
          }),
        });
        
        vectorLayer = new VectorLayer({
          source: vectorSource,
          style: new Style({
            stroke: new Stroke({
              color: 'rgb(129, 1, 146 )',
              width: 1
            }),
            fill: new Fill({
              color: 'rgba(236, 99, 255,0.5)'
            }),
          })
        });
        
        vectorLayer.set('id', 'avaluos')
      } else {
        toast.info("Predio sin geometria");
      }




var token = "pk.eyJ1IjoiZGZyb2RyaWd1ZXpsIiwiYSI6ImNqeTRyYjB3MjAwMnMzZnB2dXVmdmNwOHoifQ.jZhX17AepTfhI8xoPOpvvg"

var base = new TileLayer({
  source: new XYZ({
    url: 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}?access_token=' + token,
    crossOrigin: "Anonymous"
  })
});


    var map = new Map({

      target: 'visor1',
      layers: [
        base,
        vectorLayer
      ],
      view: new View({
        center: fromLonLat([-74.02, 4.62]),
        zoom: 10
      })
    });
      var layerExtent = vectorLayer.getSource().getExtent();
      
  if (layerExtent) {
    map.getView().fit(layerExtent,{size:map.getSize(), maxZoom:17});
  }

/*
    const layer1_source = source(tileUrlFunction1)
    const layer1 = layer(layer1_source,variables.layer1.stroke,variables.layer1.fill)
    map.addLayer(layer1);
    layer1.set('id', variables.layer1.id)
*/




})




}, []);
  
  

  
  return (
    <div id="seccion">

    
    <div id="titulo_seccion">Visor Geográfico</div>
      <p id="descripcion_seccion">En esta sección usted puede visualizar la información cartográfica del predio</p>
      <div id="visor1" ></div>
      <ToastContainer />  
  </div>

  )
}




export default Mapa;

