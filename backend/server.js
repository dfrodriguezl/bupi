var express = require('express');
var app = express();
var bodyParser = require('body-parser');//sirve para que el body de post sea en formato json
var named = require('node-postgres-named');//sirve para agregar named parameters en las consultas $data
const cors = require('cors')
const fileUpload = require('express-fileupload')
const jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser')

var expressStaticGzip = require("express-static-gzip");
const nodemailer = require("nodemailer");// para enviar emails

const xlsx =require('node-xlsx');

var uuid = require('uuid');
var path = require('path');
var mime = require('mime');

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

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'acueducto_bienes_raices',
  password: '123456',
  port: 5432,
  timezone: 'utc'
})
named.patch(pool);


app.use(cors({credentials: true, origin: 'http://localhost:9000'}));

app.use(cookieParser());
app.use(fileUpload())
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)



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
            query_text=query_text.replace("upd_query_alpaca", data.upd);
          }else if(query_text.includes("token")){
            query_text=query_text.replace("token","'"+decoded.usuario_usuario+"'");
          }
          

          console.log(query_text)
          var temp_sql = query_text;

          for (key in data){
            
            temp_sql=temp_sql.replace('$'+key,"'"+data[key]+"'")
            

          }
          console.log(temp_sql)

          try {
            pool.query(query_text, data, (error, results, fields) => {
              if (error) {
                console.log(err)
                response.status(200).json("error")
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
      throw error
    }

    const accessToken = jwt.sign({ usuario_usuario: usuario_usuario}, accessTokenSecret);
    response.cookie('jwt',accessToken, { httpOnly: true, secure: false, maxAge: 3600000 })
    response.status(200).json(results.rows)
  });
  
 
});




app.post('/logout', function(req, res){
  cookie = req.cookies;
  res.setHeader('set-cookie', 'jwt=; max-age=0');
  res.status(200).json({mensaje:'logout'})
});



//cargue de documentos
app.post('/upload/:id', (req, res) => {
  
  let EDFile = req.files.file
  var id = req.params.id;
  console.log(id)
  
  var ruta = path.join(__dirname, `../repositorio/${id}`)
  var archivo=path.join(__dirname, `../repositorio/${id}/${EDFile.name}`)
  
  if (!fs.existsSync(ruta)){
    fs.mkdirSync(ruta,{ recursive: true });
  }

  
  console.log(archivo)
  
  EDFile.mv(archivo,err => {
      if(err) return res.status(500).send({ message : err })

      var datetime = new Date();
      pool.query("INSERT INTO documentos(id,identificador,ruta,nombre,fecha,usuario) VALUES ($1,$2,$3,$4,$5,$6)", [uuid.v1(),id,archivo,EDFile.name,datetime,'idcarrillod'], (error, results) => {
        if (error) {
          console.log(error)
          return res.status(500).send({ message : error })
        }
        
        return res.status(200).send({ message : 'File upload' })
      })
    
    
      
  })




});

app.get('/descargar', function(req, res){
  
  var folder=req.query.id_expediente
  var archivo=req.query.archivo
  var file = 'C:/Users/Ivan Carrillo/Desktop/repositorio/'+folder+'/'+archivo;

  var filename = path.basename(file);
  var mimetype = mime.getType(file);

  res.setHeader('Content-disposition', 'inline; filename=' + filename);
  res.setHeader('Content-type', mimetype);

  var filestream = fs.createReadStream(file);
  filestream.pipe(res); 

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


//var DIST_DIR = path.join(__dirname, "../dist/");

//app.use("/", expressStaticGzip(DIST_DIR));

app.use(express.static(path.join(__dirname, '../dist/')));


app.get('*', (req,res) =>{
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});


  //backend en el puerto 3000
  app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
  });


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


  app.get('/excel/:id_consulta', function(request, response){

    var data = "";
    console.log(request.params.id_consulta)
    var id_consulta=request.params.id_consulta;

    var query_text=get_sql(id_consulta);

    var token=request.cookies.jwt;

    if (token) {
      jwt.verify(token, accessTokenSecret, (err, decoded) => {      
        if (err) {
          response.json({ mensaje: 'Token inválida' });    
        } else {
          request.decoded = decoded;   
          console.log(decoded)
          
          
          console.log(query_text)

          pool.query(query_text,data, (error, results) => {
            if (error) {
              response.status(403).json({ mensaje: 'error de consulta' });
              throw error
            }

            var jsn=results.rows
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
                result.push(obj[j]);
              }
              data.push(result)
          }
        
            var buffer = xlsx.build([{ data: data }]); // Returns a buffer
        
            response.setHeader('Content-disposition', 'attachment; filename=reporte.xlsx');
            response.writeHead(200, [['Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']]);
         
           response.end(new Buffer(buffer, 'base64'));

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





//servicio de vector tiles para mapas


app.get("/vector-tile/:layer/:x/:y/:z.pbf", function(req, res) {
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