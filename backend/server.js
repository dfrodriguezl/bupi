var express = require('express');
var app = express();
var bodyParser = require('body-parser');//sirve para que el body de post sea en formato json
var named = require('node-postgres-named');//sirve para agregar named parameters en las consultas $data
const cors = require('cors')
const fileUpload = require('express-fileupload')
const jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser')
var schedule = require('node-schedule');

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

var sess;
//conexión a la base de datos en postgresql
const { Pool, types } = require('pg')
const accessTokenSecret = 's1ka2te3';

types.setTypeParser(1082, str => str)

moment.locale('es');

types.setTypeParser(1114, str => moment.utc(str).local());

//produccion


const pool = new Pool({
  user: 'docker',
  host: 'pg-acueducto',//'pg-acueducto',
  database: 'acueducto_bienes_raices',
  password: 'docker',
  port: 5432,//5432
  timezone: 'utc'
})




//local
/*
const pool = new Pool({
  user: 'postgres',//docker
  host: 'localhost',//'pg-acueducto',
  database: 'acueducto_bienes_raices',
  password: '123456',//docker
  port: 5432,//5432
  timezone: 'utc'
})
*/







named.patch(pool);


app.use(cors({credentials: true, origin: 'http://localhost:9000'}));

app.use(cookieParser());
app.use(fileUpload())
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
  })
)
app.use(bodyParser.json({limit: '50mb'})); 




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
          }
          else if(query_text.includes("insert-dinamico")){
            query_text=query_text.replace(/insert-dinamico/g,data.tabla);
          }
          

          console.log(query_text)

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

const auditoria = (data,user) => {
  
  var datetime = new Date();

  pool.query("insert into auditoria values((select max(id)+1 from auditoria),$1,$2,$3) returning id", [data,user,datetime], (error, results) => {
    if (error) {
      console.log(error)
      throw error
    }
        
    console.log(results.rows)
   
  });


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

app.post('/login',(request,response) => {

  var data=request.body;
  var id_consulta=request.body.id_consulta;
  var query_text=get_sql(id_consulta);

  const usuario_usuario = request.body.usuario_usuario;

  
  pool.query(query_text,data, (error, results) => {
    if (error) {
      response.status(404).json({'error:':'servicio'})
      throw error
    }

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
      
          var datetime = new Date();
          
          pool.query("INSERT INTO documentos(id,identificador,ruta,nombre,fecha,usuario) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT(nombre) DO UPDATE set fecha=$5", [uuid.v1(),id,archivo,EDFile.name,datetime,usuario], (error, results) => {
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


  app.post('/todoreport', function(request, response){

    var data = "";
    
    var consultas = [
       'reporte_info1' ,
       'reporte_info2' ,
       'reporte_info3' ,
       'reporte_info4' ,
       'reporte_info5' ,
       'reporte_info6' ,
       'reporte_info7' ,
       'reporte_info8' ,
       'reporte_info9' ,
       'reporte_info10' ,
       'reporte_info11' ,
       'reporte_info12' ,
       'reporte_info13' ,
       'reporte_info14' ,
       'reporte_info15' ,
       'reporte_info17',
       'reporte_info18' ,
      'reporte_info21',
      'reporte_actividades' 
    ]
    var names = [
       'GENERAL_PROYECTO' ,
       'GENERAL_PREDIO' ,
       'AREAS_Y_USOS' ,
       'AVALUOS' ,
       'JURIDICO' ,
       'PROPIETARIO_ANTERIOR_JURIDICO' ,
       'PROPIETARIO_CATASTRAL' ,
       'PROPIETARIO_JURIDICO' ,
       'ZMPA' ,
       'INFRAESTRUCTURA' ,
       'ESTUDIOS_DETALLADOS' ,
       'CONTROL_CALIDAD_TECNICO' ,
       'CONTROL_CALIDAD_JURIDICO' ,
       'SANEAMIENTO_BASICO' ,
       'SANEAMIENTO_JURIDICO' ,
       'DOCUMENTOS_REQUERIDOS' ,
       'MUNICIPIOS_INTERSECTADOS' ,
       'ADQUISICIÓN',
       'ACTIVIDADES'       
    ]
    
    
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
          response.writeHead(200, [['Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']]);
       
         response.end(new Buffer(buffer, 'base64'));


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
              TileBBox(${req.params.z}, ${req.params.x}, ${req.params.y}, 102233),
              4096,
              0,
              false
          ) geom
      FROM ${req.params.layer}
      WHERE ST_Intersects(geom, (SELECT ST_Transform(ST_MakeEnvelope($1, $2, $3, $4, $5), 102233)))
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
          
          response.writeHead(200, [['Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']]);
       
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


var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [1, new schedule.Range(2, 5)];
rule.hour = [8,10,12,14,16,18,20];
rule.minute = 0;
 
var j = schedule.scheduleJob(rule, function(){

  console.log("tarea programada")
  var esquemas = ['public', 'tareas'];


  esquemas.forEach(myFunction); 

  function myFunction(schema, index) 
  { 
      
    var file = moment().format('YYYY-MM-DD-HH-mm-ss');


    var command = `pg_dump --dbname=postgresql://docker:docker@159.203.180.99:25432/acueducto_bienes_raices -n ${schema} -Fc --file ./backups/${schema}_${file}.sql`;
       
      
      const exec = require('child_process').exec;
  
      function os_func() {
          this.execCommand = function(cmd, callback) {
              exec(cmd, (error, stdout, stderr) => {
                  if (error) {
                      console.error(`exec error: ${error}`);
                      return;
                  }
      
                  callback(stdout);
              });
          }
      }
      var os = new os_func();
      
      os.execCommand(command, function (returnvalue) {
        
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          secure: false,
          auth: {
            user: 'ivancho4321@gmail.com',
            pass: 's1ka2te3'
          },
          tls: {
            rejectUnauthorized: false
          }
        });
        
        var mailOptions = {
          from: 'ivancho4321@gmail.com',
          to: 'ivancho4321@gmail.com',
          subject: `Backup Bienes Raices -${schema}`,
          text: `Backup del esquema ${schema} con fecha de: ${file}`,
          attachments: [
            {
              path:`./backups/${schema}_${file}.sql`
            }
          ]
        };
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            
            console.log({ mensaje: error })
            
          } else {
           
            console.log({ mensaje: info.response  })
          }
        });
    
  
      });
  


  }



  




  


});





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