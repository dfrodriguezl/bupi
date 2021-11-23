var express = require('express');
var app = express();
// var bodyParser = require('body-parser');//sirve para que el body de post sea en formato json
var named = require('node-postgres-named');//sirve para agregar named parameters en las consultas $data
const cors = require('cors')
const fileUpload = require('express-fileupload')
const jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser')
// var schedule = require('node-schedule');
// var compression = require('compression');

var expressStaticGzip = require("express-static-gzip");
const nodemailer = require("nodemailer");// para enviar emails

const xlsx =require('node-xlsx');

var uuid = require('uuid');
var path = require('path');
var mime = require('mime');
var moment = require('moment');
//para el servicio de mapas
const SphericalMercator = require("@mapbox/sphericalmercator")
const mercator = new SphericalMercator()

//convierte csv a json
const csvtojson = require('csvtojson');

// var sess;
//conexión a la base de datos en postgresql
const { Pool, types } = require('pg')

const accessTokenSecret = 's1ka2te3';

types.setTypeParser(1082, str => str)

moment.locale('es');

types.setTypeParser(1114, str => moment.utc(str).local());

//produccion


// const pool = new Pool({
//   user: 'docker',
//   host: 'pg_acueducto',//'pg-acueducto',
//   database: 'acueducto_bienes_raices',
//   password: 'docker',
//   port: 5432,//5432
//   timezone: 'utc'
// })

// const pool = new Pool({
//   user: 'docker',
//   host: '159.203.180.99',//'pg-acueducto',
//   database: 'acueducto_bienes_raices',
//   password: 'docker',
//   port: 25432,//5432
//   timezone: 'utc'
// })




//local

const pool = new Pool({
  user: 'postgres',//docker
  host: 'localhost',//'pg-acueducto',
  database: 'acueducto_bienes_raices',
  password: 'postgres',//docker
  port: 5433,//5432
  // timezone: 'utc'
})








named.patch(pool);


app.use(cors({credentials: true, origin: 'http://localhost:9000'}));
// app.use(compression());

app.use(cookieParser());
app.use(fileUpload())
app.use(express.json())
// app.use(bodyParser.json())
// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//     limit: '100mb'
//   })
// )
app.use(
  express.urlencoded({
    extended: true,
    limit: '100mb'
  })
)
// app.use(bodyParser.json({limit: '100mb'}));
app.use(express.json({limit: '100mb'})); 




const consulta = (request, response) => {

    var data=request.body;
    var id_consulta=request.body.id_consulta;
    
    var query_text=get_sql(id_consulta);

    var token=request.cookies.jwt;

    if (token) {
      jwt.verify(token, accessTokenSecret, (err, decoded) => {      
        if (err) {
          response.json({ mensaje: 'Token inválida' });    
        } else {
          request.decoded = decoded;   
          console.log(decoded)
          
          //logica para la actualizacion de datos
          if(query_text.includes("upd_query_alpaca")){
            query_text = query_text.replace("upd_query_alpaca", data.upd);
            var usuario = decoded.usuario_usuario;
            auditoria(data,usuario)
          }else if(query_text.includes("token")){
            query_text=query_text.replace(/token/g,"'"+decoded.usuario_usuario+"'");
            if(query_text.includes("insert-dinamico")){
              query_text=query_text.replace(/insert-dinamico/g,data.tabla);
            }
          }
          else if(query_text.includes("insert-dinamico")){
            query_text=query_text.replace(/insert-dinamico/g,data.tabla);
          }
          

          console.log(query_text)
          console.log(data)

          try {
            pool.query(query_text, data, (error, results) => {
              if (error) {
                console.log(err)
                response.status(200).json("error")
                throw error
              }
              
              
              response.status(200).json(results.rows)
             
            });
          }
          catch (err) {
            console.log(err)
            response.status(200).json("error")
          }
         



        }
      });
    }else{
      response.status(403).json({ mensaje: 'sin permisos' });
    }
    
  




  }

const auditoria = (data,user,id) => {
  
  var datetime = new Date();

  if(id != null){
    pool.query("insert into auditoria (data,usuario,fecha) values($1,$2,$3) returning id", [data,user,datetime], (error, results) => {
      if (error) {
        console.log(error)
        throw error
      }
          
      console.log(results.rows)
     
    });
  }else{
    pool.query("insert into auditoria (data,usuario,fecha) values($1,$2,$3) returning id", [data,user,datetime], (error, results) => {
      if (error) {
        console.log(error)
        throw error
      }
          
      console.log(results.rows)
     
    });
  }

  


}



  app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', "http://localhost:9000");

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    res.setHeader('Cache-Control', 'no-cache');

    // Pass to next layer of middleware
    next();
});



  const xml2js = require('xml2js');
  const fs = require('fs');
  const parser = new xml2js.Parser({ attrkey: "attr" });
  let xml_string = fs.readFileSync(__dirname+"/consultas.xml", "utf8");
  var json="";
  parser.parseString(xml_string, function(error, result) {
      if(error === null) {
          json=result;
      }
      else {
          console.log(error);
      }
  });


function get_sql(id_consulta){

    var appsArr = json.Consultas.Consulta;

    var requiredObj='';
    for (var i in appsArr) {
        if(appsArr[i].attr.id == id_consulta) {
            requiredObj = appsArr[i].sql;
            break;
        }
     }
    return requiredObj.toString();
}  

app
.route('/backend')
.post(consulta)


app.get('/test',(request,response) => {

  pool.query("select 1", (error, results) => {
    if (error) {
      console.log(error)
      response.status(404).json({'error:':'servicio'})
      throw error
    }
    
    console.log(results)
  });


})


app.post('/login',(request,response) => {

  console.log("hola")

  var data=request.body;
  var id_consulta=request.body.id_consulta;
  var query_text=get_sql(id_consulta);

  const usuario_usuario = request.body.usuario_usuario;

  

  pool.query(query_text,data, (error, results) => {
    if (error) {
      console.log(error)
      response.status(404).json({'error:':'servicio'})
      throw error
    }
    console.log(results.rows)

    const accessToken = jwt.sign({ usuario_usuario: usuario_usuario}, accessTokenSecret);
    response.cookie('jwt',accessToken, { httpOnly: false, secure: false, maxAge: 317125598072  })
    response.status(200).json(results.rows)

  });
  
 
});



/*
app.get('/logout', function (req, res) {

  var token=req.cookies.jwt;
  jwt.destroy(token)

  console.log("hola")
});
*/


//cargue de documentos
app.post('/upload/:id', (req, res) => {
  


  var token=req.cookies.jwt;

  if (token) {
    jwt.verify(token, accessTokenSecret, (err, decoded) => {      
      if (err) {
        response.json({ mensaje: 'Token inválida' });    
      } else {
        var usuario = decoded.usuario_usuario;

        let EDFile = req.files.file
        var id = req.params.id;
        console.log(id)
        
        var ruta = path.join(__dirname, `../repositorio/${id}`)
        var archivo=path.join(__dirname, `../repositorio/${id}/${EDFile.name}`)
        
        
        if (!fs.existsSync(ruta)){
          fs.mkdirSync(ruta,{ recursive: true });
        }
      
        
        EDFile.mv(archivo,err => {
            if(err) return res.status(500).send({ message : err })
      
          var datetime = new Date()
          var datetimeTime = datetime.getTime();

          var localOffset = datetime.getTimezoneOffset()*60000;
          var utc = datetimeTime + localOffset;
          var localTime = utc - (3600000*5);
          var newDate = new Date(localTime);
          // console.log(datetime)
          // console.log(newDate);
          
          pool.query("INSERT INTO documentos(id,identificador,ruta,nombre,fecha,usuario) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT(nombre) DO UPDATE set fecha=$5", [uuid.v1(),id,archivo,EDFile.name,newDate,usuario], (error, results) => {
            if (error) {
              console.log(error)
              return res.status(500).send({ message : error })
            }

            return res.status(200).send({ message : 'File upload' })
            
          })
          
          
        })


       



      }
    });
  }else{
    response.status(403).json({ mensaje: 'sin permisos' });
  }


});

//borrar documentos
app.post('/delete/:nombre', (req, res) => {
  
  var token=req.cookies.jwt;

  if (token) {
    jwt.verify(token, accessTokenSecret, (err, decoded) => {      
      if (err) {
        response.json({ mensaje: 'Token inválida' });    
      } else {
        
        var nombre = req.params.nombre;
        var id=nombre.split('-')[0]
        console.log(nombre)
        console.log(id)
        
        var archivo=path.join(__dirname, `../repositorio/${id}/${nombre}`)
        
        
        if (fs.existsSync(archivo)) {
          
          fs.unlink(archivo,function(err){
            if(err) return res.status(500).send({ message : err })
            
            pool.query("DELETE from documentos where nombre=$1", [nombre], (error, results) => {
              if (error) {
                console.log(error)
                return res.status(500).send({ message : error })
              }
  
              return res.status(200).send({ message : 'File deleted' })
              
            })


          }); 

        }
      
        


      }
    });
  }else{
    response.status(403).json({ mensaje: 'sin permisos' });
  }


});




app.get('/descargar/:ruta', function(req, res){
  
  var ruta=req.params.ruta;

  pool.query("SELECT * from documentos where id=$1", [ruta], (error, results) => {
    if (error) {
      return res.status(500).send({ message : error })
    }

    var file = results.rows[0].ruta;

    var filename = path.basename(file);
    var mimetype = mime.lookup(file);
  
    res.setHeader('Content-disposition', 'inline; filename=' + filename);
    res.setHeader('Content-type', mimetype);
  
    var filestream = fs.createReadStream(file);
    filestream.pipe(res); 
    
  })

});

app.post('/xls', function(req,res){
  console.log(req.files.file)

  let csvData = req.files.file.data.toString('utf8');
  console.log(csvData)
  return csvtojson().fromString(csvData).then(json => 
    {return res.status(201).json({csv:csvData, json:json})})
});

/*
var DIST_DIR = path.join(__dirname, "../dist/");
app.use(express.static(DIST_DIR));
app.get("*", function (req, res) {
  res.sendFile(path.join(DIST_DIR, "html/login.html"));
}); 
*/

/*
var DIST_DIR = path.join(__dirname, "../dist/");

app.use("/", expressStaticGzip(DIST_DIR));

app.get('*', (req,res) =>{
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});
*/





  app.post('/correo', function(req, res){

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ivancho4321@gmail.com',
        pass: 's1ka2te3'
      }
    });
    
    var mailOptions = {
      from: 'ivancho4321@gmail.com',
      to: 'idcarrillod@correo.udistrital.edu.co',
      subject: 'Información del sistema de Bienes raices',
      text: 'That was easy!'
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        res.status(500).send({mensaje:'error'})
      } else {
        res.status(200).send({mensaje:info.response})
      }
    });
    
  });


  app.post('/todoreport/:reporte', function(request, response){


    var reporte = request.params.reporte;

    var data = "";
    
    if (reporte == 'all') {
      var consultas = [
        'reporte_actividades',
         'reporte_info5' ,
        'reporte_info7' ,
        'reporte_info8' ,
         'reporte_info6' ,  
         'reporte_info9' ,
         'reporte_info10' ,
        'reporte_info14' ,
        'reporte_info15' ,
        'reporte_info18',
        'reporte_info19',  
        'reporte_info11' ,
        'reporte_info17',
         'reporte_info12' ,
         'reporte_info13' ,
         'reporte_info22' ,     
      ]
      var names = [
         'TÉCNICO',
         'JURIDICO' ,
        'PROPIETARIO_CATASTRAL' ,
        'PROPIETARIO_JURIDICO' ,
         'PROPIETARIO_ANTERIOR_JURIDICO' ,
         'ZMPA' ,
         'INFRAESTRUCTURA' ,
        'SANEAMIENTO_BASICO' ,
        'SANEAMIENTO_JURIDICO' ,
        'MUNICIPIOS_INTERSECTADOS',
        'MUTACION PREDIAL',
         'ESTUDIOS_DETALLADOS' ,
        'DOCUMENTOS_REQUERIDOS' , 
         'CONTROL_CALIDAD_TECNICO' ,
         'CONTROL_CALIDAD_JURIDICO' ,
         'FACTURA_MUNICIPIO' ,          
      ]
    } else if (reporte == 'tributaria') {
      
      var consultas = ['tributaria_principal','tributaria_zmpa','tributaria_juridico'];
      var names=['TRIBUTARIA','ACTADM_ZMPA','PORCENTAJE_DE_PROPIEDAD']

    } else if (reporte === 'all_servidumbres'){
      var consultas = [
        'reporte_info1_servidumbres',
         'reporte_info2_servidumbres' ,
        'reporte_info3_servidumbres' ,
        'reporte_info4_servidumbres' ,
         'reporte_info5_servidumbres' ,  
         'reporte_info6_servidumbres' ,
         'reporte_info7_servidumbres' ,
        'reporte_info8_servidumbres' ,
        'reporte_info9_servidumbres' ,
        'reporte_info10_servidumbres',
        'reporte_info11_servidumbres',  
        'reporte_info12_servidumbres' ,
        'reporte_info13_servidumbres',
         'reporte_info14_servidumbres' ,
         'reporte_info15_servidumbres' ,
         'reporte_info16_servidumbres' ,   
        'reporte_info17_servidumbres',
        'reporte_info18_servidumbres',
        'reporte_info19_servidumbres'  
      ]
      var names = [
         'GENERAL_PROYECTO',
         'GENERAL_PREDIO_SIRVIENTE' ,
        'GENERAL_PREDIOS_DERIVADOS' ,
        'AREA_Y_USOS_PREDIO_SIRVIENTE' ,
         'SERVIDUMBRE' ,
         'AVALUOS' ,
         'ORDEN_DE_PAGO' ,
        'SOPORTES_PAGO' ,
        'JURIDICO_SERVIDUMBRE' ,
        'CONSTITUCION_SERVIDUMBRE',
        'PROPIETARIO_CATASTRAL',
         'PROPIETARIO_JURIDICO_ACTUAL' ,
        'PROPIETARIO_CONSTITUCION' , 
         'INFRAESTRUCTURA_SERVIDUMBRE' ,
         'SANEAMIENTO_BASICO' ,
         'MUNICIPIOS_INTERSECTADOS' ,   
         'DOCUMENTOS_REQUERIDOS' ,   
         'CONTROL_CALIDAD_TECNICO' ,   
         'ESTADO_SANEAMIENTO_BASICO' ,          
      ]
    }


    
    
    var token=request.cookies.jwt;

    if (token) {
      jwt.verify(token, accessTokenSecret, (err, decoded) => {      
        if (err) {
          response.json({ mensaje: 'Token inválida' });    
        } else {
          request.decoded = decoded;   
          

          var informacion = [];




          async function processTasks() {

            let k = 0;
            for (const  id_consulta of consultas){
              
              

              var query_text=get_sql(id_consulta);
  

              const { rows } = await pool.query(query_text)

              var jsn = rows
              var data = []
              var result=[]
              for (var j in jsn[0]) {
                result.push(j);
                
              }
              data.push(result)
          
              for (var i = 0; i < jsn.length; i++){
                var obj = jsn[i];
                var result=[]
                for (var j in obj) {
                  if (moment.isMoment(obj[j])) {
                    result.push(moment.utc(obj[j]).format("YYYY-MM-DD"));
                    
                  } else {
                    result.push(obj[j]);
                  }
                  
                }
                data.push(result)
            }
  
              var info={name:names[k],data:data}
  
              informacion.push(info)
  
              k = k + 1;
  
  
            };



            console.log("tarea:"+"all")

          }


          async function tarea() {
            await processTasks()
            console.log('Completed!!!');


          var buffer = xlsx.build(informacion); // Returns a buffer
        
          response.setHeader('Content-disposition', 'attachment; filename=reporte.xlsx');
          // response.writeHead(200, [['Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']]);
       
         response.end(new Buffer.from(buffer, 'base64'));


          }

          tarea()
          

          



        }
      });
    }else{
      response.status(403).json({ mensaje: 'sin permisos' });
    }
    
  

    
  });

  app.get('/help/:file', function(req, res){


    var token=req.cookies.jwt;

    const file = path.join(__dirname, `../help/${req.params.file}`)
          

          if(file.includes(".db")){
            res.download(file); // Set disposition and send it.
          }else{
            if (token) {
              jwt.verify(token, accessTokenSecret, (err, decoded) => {      
                if (err) {
                  res.json({ mensaje: 'Token inválida' });    
                } else {
        
        
                  const file = path.join(__dirname, `../help/${req.params.file}`)
                  res.download(file); // Set disposition and send it.
        
        
                }
              });
            }else{
              res.status(403).json({ mensaje: 'sin permisos' });
            }
          }

  });



//servicio de vector tiles para mapas


app.get("/vector-tile/:layer/:x/:y/:z", function(req, res) {
  let bbox = mercator.bbox(req.params.x, req.params.y, req.params.z)
  console.log(bbox.join(", "))

  const sql = `
  SELECT ST_AsMVT(q, '${req.params.layer}', 4096, 'geom')
  FROM (
      SELECT
          id,
          ST_AsMVTGeom(
              geom,
              TileBBox(${req.params.z}, ${req.params.x}, ${req.params.y}, 4326),
              4096,
              0,
              false
          ) geom
      FROM ${req.params.layer}
      WHERE ST_Intersects(geom, (SELECT ST_Transform(ST_MakeEnvelope($1, $2, $3, $4, $5), 4326)))
  ) q`
  const values = [bbox[0], bbox[1], bbox[2], bbox[3], 4326]
  pool.query(sql, values , function(err, mvt) {
          if (err) {
              console.log(err)
              response.status(400)
          } else {
            
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Content-Type', 'application/x-protobuf')
              res.send(mvt.rows[0].st_asmvt)
          }
  })
})

app.get('/props/:layer/:id', (req, res) => {

  var layer = req.params.layer;
  var id = req.params.id;

  var ly = layer.split(".")
  ly=ly[1]


  var sql = `SELECT 'SELECT ' || STRING_AGG('o.' || column_name, ', ') || ' FROM ${layer} AS o' as sql
  FROM information_schema.columns
  WHERE table_name = '${ly}'
  AND table_schema = 'geometria'
  AND column_name NOT IN ('id', 'geom')`;

  console.log(sql)

  pool.query(sql, (error, results) => {
    if (error) {
      throw error
    }
    
    var sql1=results.rows[0].sql+' where id='+id

    pool.query(sql1, (error, results) => {
      if (error) {
        throw error
      }
  
      res.status(200).json(results.rows)
    });

    
  });
  
 

});



app.get('/descargar/:ruta', function(req, res){
  
  var ruta=req.params.ruta;

  pool.query("SELECT * from documentos where id=$1", [ruta], (error, results) => {
    if (error) {
      return res.status(500).send({ message : error })
    }

    var file = results.rows[0].ruta;

    var filename = path.basename(file);
    var mimetype = mime.getType(file);
  
    res.setHeader('Content-disposition', 'inline; filename=' + filename);
    res.setHeader('Content-type', mimetype);
  
    var filestream = fs.createReadStream(file);
    filestream.pipe(res); 
    
  
  })





});



app.post('/excel', function(request, response){

  var data=request.body;
  var id_consulta=request.body.id_consulta;

  var query_text=get_sql(id_consulta);

  var token = request.cookies.jwt;
  
  if (token) {
    jwt.verify(token, accessTokenSecret, (err, decoded) => {      
      if (err) {
        response.json({ mensaje: 'Token inválida' });    
      } else {
        request.decoded = decoded;   
        console.log(decoded)
        
        if (query_text.includes("token")) {
          
          query_text=query_text.replace(/token/g,"'"+decoded.usuario_usuario+"'");
        }


        pool.query(query_text,data, (error, results) => {
          if (error) {
            response.status(403).json({ mensaje: 'error de consulta' });
            throw error
          }

          var jsn = results.rows
          var data = []
          var result=[]
          for (var j in jsn[0]) {
            result.push(j);
            
          }
          data.push(result)
      
          for (var i = 0; i < jsn.length; i++){
            var obj = jsn[i];
            var result=[]
            for (var j in obj) {
              if (moment.isMoment(obj[j])) {
                result.push(moment.utc(obj[j]).format("YYYY-MM-DD"));
                
              } else {
                result.push(obj[j]);
              }
              
            }
            data.push(result)
        }

          var buffer = xlsx.build([{ data: data }]); // Returns a buffer
      
          response.setHeader('Content-disposition', 'attachment; filename=reporte.xlsx');
          
          // response.writeHead(200, [['Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']]);
       
         response.end(Buffer.from(buffer));

        })

      }
    });
  }else{
    response.status(403).json({ mensaje: 'sin permisos' });
  }
  




  /*
 res.setHeader('Content-type', "text/csv");

 res.setHeader('Content-disposition', 'attachment; filename=file.xls');
 
 res.send(text);
  */

  
});

app.post("/actualizacionMasiva", function(request, response){
  var token = request.cookies.jwt;
  let data = request.body;

  var consultas = [
    'update_info1_general_proyecto',
    'update_info2_general_predio' ,
    'update_info3_areas_usos' ,
    'update_info4_avaluos' ,
    'update_info5_juridicos' ,  
    'update_info21_juridicos' ,
    'update_info7_propietario_catastral' ,
    'update_info8_propietario_juridico' ,
    'update_info6_propietario_anterior_juridico' ,
    'update_info9_zmpa',
    'update_info10_infraestructura',  
    'update_info14_saneamiento_basico' ,
    'update_info15_saneamiento_juridico',
     'update_info18_municipios_intersectados' ,
     'update_info19_mutacion_predial' ,
     'update_info11_estudios_detallados' , 
     'update_info17_documentos_requeridos' , 
     'update_info12_control_calidad_tecnico' , 
     'update_info13_control_calidad_juridico' , 
     'update_info22_factura_municipio' ,     
  ]
  var hojas = [
     'general_proyecto',
     'general_predio' ,
    'areas_usos' ,
    'avaluos' ,
     'juridico' ,
     'adquisicion' ,
     'propietario_catastral' ,
    'propietario_juridico' ,
    'propietario_anterior_juridico' ,
    'zmpa',
    'infraestructura',
     'saneamiento_basico' ,
    'saneamiento_juridico' , 
     'municipios_intersectados' ,
     'mutacion_predial' ,
     'estudios_detallados' ,  
     'documentos_requeridos' ,  
     'control_calidad_tecnico' ,  
     'control_calidad_juridico' ,  
     'factura_municipio' ,          
  ]

  if (token) {
    jwt.verify(token, accessTokenSecret, (err, decoded) => {      
      if (err) {
        response.json({ mensaje: 'Token inválida' });    
      } else {
        request.decoded = decoded;   
        
        let totalData = 0;
        let counter = 0;

        Object.keys(data).map((key,idx) => {
          let hoja_nombre = data[key];
          if(hoja_nombre.length > 0){
            totalData = totalData + hoja_nombre.length;
          }

        });


        // console.log(resultsList)

        async function processTasks(){
          let resultsList = []
          Object.keys(data).map((key,idx) => {
            let hoja_nombre = data[key];
            if(hoja_nombre.length > 0){
              if(hojas.includes(key)){
                hoja_nombre.forEach(element => {
                  counter = counter + 1;
                  let id_consulta = consultas[idx];
                  var query_text=get_sql(id_consulta);
                  var upd = ""
                  for (var k in element) {
                    upd = upd + k + "=$" + k + ","
                  }
                  upd = upd.replace(/,\s*$/, "");
                  
                  if(query_text.includes("upd_query_alpaca")){
                    query_text = query_text.replace("upd_query_alpaca", upd);
                    var usuario = decoded.usuario_usuario;
                    auditoria(element,usuario, counter)
                  }else if(query_text.includes("token")){
                    query_text=query_text.replace(/token/g,"'"+decoded.usuario_usuario+"'");
                  }
  
                  try {
                    console.log(counter)
                    const promise = pool.query(query_text, element)
                                    .then(results => {
                                      return results.rows;
                                    })
                                    .catch(err => {
                                        console.log(err)
                                        response.status(200).json("error")
                                        throw error
                                    })

                    resultsList.push(promise)
                  }
                  catch (err) {
                    console.log(err)
                    response.status(200).json("error")
                  }
                  
                });
                
              }
            }
  
          })

          const array = await Promise.all(resultsList);
          response.status(200).send(array);
        }

        processTasks()

          

          // response.status(200).send(await Promise.all(resultsList));
      }
    });
  }else{
    response.status(403).json({ mensaje: 'sin permisos' });
  }
})








//var DIST_DIR = path.join(__dirname, "../dist/");

//app.use("/", expressStaticGzip(DIST_DIR));
var DIST_DIR = path.join(__dirname, "../dist/");

app.use( '/',expressStaticGzip(DIST_DIR));


app.get('/web/*', (req,res) =>{
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});


//backend en el puerto 3000
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

