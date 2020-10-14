
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



import {url,servidorGet} from '../js/request'

import variables from '../variables/var_mapa'

console.log(variables)
console.log(variables.layer1.id)

var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');


closer.onclick = function() {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

var overlay = new Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250
  }
});


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
  
  React.useEffect(() => {
  
 

var resolutions = [];
for (var i = 0; i <= 8; ++i) {
  resolutions.push(156543.03392804097 / Math.pow(2, i * 2));
}

const tileUrlFunction1=(tileCoord) =>{

    return (
      url+'/vector-tile/geometria.'+variables.layer1.capa+'/{x}/{y}/{z}.pbf'
    )
      .replace('{z}', String(tileCoord[0] * 2 - 1))
      .replace('{x}', String(tileCoord[1]))
      .replace('{y}', String(tileCoord[2]))
  }
  const tileUrlFunction2=(tileCoord) =>{

      return (
        url+'/vector-tile/geometria.'+variables.layer2.capa+'/{x}/{y}/{z}.pbf'
      )
        .replace('{z}', String(tileCoord[0] * 2 - 1))
        .replace('{x}', String(tileCoord[1]))
        .replace('{y}', String(tileCoord[2]))
    }
    const tileUrlFunction3=(tileCoord) =>{

      return (
        url+'/vector-tile/geometria.'+variables.layer3.capa+'/{x}/{y}/{z}.pbf'
      )
        .replace('{z}', String(tileCoord[0] * 2 - 1))
        .replace('{x}', String(tileCoord[1]))
        .replace('{y}', String(tileCoord[2]))
 }
    
 const tileUrlFunction4=(tileCoord) =>{

  return (
    url+'/vector-tile/geometria.'+variables.layer4.capa+'/{x}/{y}/{z}.pbf'
  )
    .replace('{z}', String(tileCoord[0] * 2 - 1))
    .replace('{x}', String(tileCoord[1]))
    .replace('{y}', String(tileCoord[2]))
} 
    
    
    const source = (VectorFunction) => {
      return new VectorTileSource({
        format: new MVT(),
        tileGrid: new TileGrid({
          extent: getProjection('EPSG:900913').getExtent(),
          resolutions: resolutions,
          tileSize: 512,
        }),
        tileUrlFunction: VectorFunction,
      });
    }

    const layer = (source,color,fill) => {
      return new VectorTileLayer({
        source: source,
        zIndex: 1,
        style: new Style({
          stroke: new Stroke({
            color: color,
            width: 1
          }),
          fill: new Fill({
            color: fill
          }),
        })
      });
    }


    var token = "pk.eyJ1IjoiaXZhbjEyMzQ1Njc4IiwiYSI6ImNqc2ZkOTNtMjA0emgzeXQ3N2ppMng4dXAifQ.2k-OLO6Do2AoH5GLOWt-xw"

var base = new TileLayer({
  source: new XYZ({
    url: 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}?access_token=' + token,
    crossOrigin: "Anonymous"
  })
});


    var map = new Map({

      target: 'visor',
      overlays: [overlay],
      layers: [
        base
      ],
      view: new View({
        center: fromLonLat([-74.02, 4.62]),
        zoom: 10
      })
    });




    const layer1_source = source(tileUrlFunction1)
    const layer1 = layer(layer1_source,variables.layer1.stroke,variables.layer1.fill)
    map.addLayer(layer1);
    layer1.set('id', variables.layer1.id)

    const layer2_source = source(tileUrlFunction2)
    const layer2 = layer(layer2_source,variables.layer2.stroke,variables.layer2.fill)
    map.addLayer(layer2);
    layer2.set('id', variables.layer2.id)

    const layer3_source = source(tileUrlFunction3)
    const layer3 = layer(layer3_source,variables.layer3.stroke,variables.layer3.fill)
    map.addLayer(layer3);
    layer3.set('id', variables.layer3.id)

    const layer4_source = source(tileUrlFunction4)
    const layer4 = layer(layer4_source,variables.layer4.stroke,variables.layer4.fill)
    map.addLayer(layer4);
    layer4.set('id', variables.layer4.id)


    //popup

    map.on('singleclick', function (evt) {
      var coordinate = evt.coordinate;
      console.log("aqui")
      var mensaje = "";
      var id = "";
    
     var feature= map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
        id = layer.get('id')
       
        return feature;
    
      }, {
        hitTolerance: 2
      });
     
    /*
      if (id == "mz_uso_viv") {
        mensaje = "<p>Cod DANE: " + info[0] + "</p><p>Conteo: " + info[1] + "</p><p>% : " + info[4] + "</p>"
      } 
    */
      if (feature) {
        

        servidorGet(url+'/props/' + feature.get("layer") + '/' + feature.get("id")).then((response) => {
         
          var datos = response[0];
          
          mensaje = ""
          

          for (var key in datos){
            var value = datos[key];
            mensaje = mensaje+"<p>"+key+' : '+ value + "</p>"
          }

          
          if (mensaje != "") {
            
            content.innerHTML = '<p>' + mensaje + '</p>';
            overlay.setPosition(coordinate);
            container.style.visibility = "visible";
          }

        })
        
        
      
        

      }

    
    
    });





}, []);
  
  

  
  return (
    <div id="seccion">

    
    <div id="titulo_seccion">Visor Geográfico</div>
      <p id="descripcion_seccion">En esta sección usted puede visualizar la información cartográfica de los predios</p>
      <div id="visor" ></div>
  </div>

  )
}




export default Mapa;

