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

const xlsx = require('node-xlsx');

var uuid = require('uuid');
var path = require('path');
var mime = require('mime');
var moment = require('moment');
//para el servicio de mapas
const SphericalMercator = require("@mapbox/sphericalmercator")
const mercator = new SphericalMercator()

//convierte csv a json
const csvtojson = require('csvtojson');

//Convierte geojson a shp
const { convert } = require('geojson2shp');

//Llenar pdf
const PizZip = require("pizzip");
const DocxTemplater = require("docxtemplater");
const fsPromises = require('fs').promises;
const libre = require('libreoffice-convert');
libre.convertAsync = require('util').promisify(libre.convert);
// const fs = require("fs");
const axios = require('axios');
// const FormData = require('form-data');
const fileDownload = require('js-file-download');
const fileSaver = require('file-saver');
const Blob = require('buffer');
const gotenberg = require('gotenberg-js-client');

const ExcelJS = require('exceljs');

const urlPdf = "http://192.168.56.10:3000/forms/libreoffice/convert";



// var sess;
//conexión a la base de datos en postgresql
const { Pool, types } = require('pg')

const accessTokenSecret = 's1ka2te3';

types.setTypeParser(1082, str => str)

moment.locale('es');

types.setTypeParser(1114, str => moment.utc(str).local());

//produccion


//produccion


const pool = new Pool({
  user: 'docker',
  host: 'postgis_bupi',
  database: 'invias_bupi',
  password: 'docker',
  port: 5432,
  timezone: 'utc'
})

// desarrollo

// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',//'pg-acueducto',
//   database: 'bupi_invias',
//   // database: 'prueba_schema',
//   password: 'yeinerm12',
//   port: 5432,
//   timezone: 'utc'
// })


// const pool = new Pool({
//   user: 'docker',
//   host: '172.19.26.22',//'pg-acueducto',
//   database: 'invias_bupi',
//   // database: 'prueba_schema',
//   password: 'docker',
//   port: 25432,
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

// const pool = new Pool({
//   user: 'postgres',//docker
//   host: 'localhost',//'pg-acueducto',
//   database: 'invias_bupi',
//   password: 'postgres',//docker
//   port: 5433,//5432
//   // timezone: 'utc'
// })









named.patch(pool);


app.use(cors({ credentials: true, origin: 'http://localhost:9000' }));
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
app.use(express.json({ limit: '100mb' }));



const consulta = (request, response) => {

  var data = request.body;
  var id_consulta = request.body.id_consulta;

  var query_text = get_sql(id_consulta);

  var token = request.cookies.jwt;

  if (token) {
    jwt.verify(token, accessTokenSecret, (err, decoded) => {
      if (err) {
        response.json({ mensaje: 'Token inválida' });
      } else {
        request.decoded = decoded;
        console.log(decoded)

        //logica para la actualizacion de datos
        if (query_text.includes("upd_query_alpaca")) {
          query_text = query_text.replace("upd_query_alpaca", data.upd);
          var usuario = decoded.usuario_usuario;
          auditoria(data, usuario)
        } else if (query_text.includes("token")) {
          query_text = query_text.replace(/token/g, "'" + decoded.usuario_usuario + "'");
          if (query_text.includes("insert-dinamico")) {
            query_text = query_text.replace(/insert-dinamico/g, data.tabla);
          }
        }
        else if (query_text.includes("insert-dinamico")) {
          query_text = query_text.replace(/insert-dinamico/g, data.tabla);
        } else if (query_text.includes("where_parametros_avanzados")) {
          query_text = query_text.replace("where_parametros_avanzados", data.upd);
        } else if (query_text.includes("distinct_busqueda_saneamientos")){
          query_text = query_text.replace("distinct_busqueda_saneamientos", data.select);
        }

        console.log("QUERY TEXT", query_text);

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
  } else {
    response.status(403).json({ mensaje: 'sin permisos' });
  }






}

const auditoria = (data, user, id) => {

  var datetime = new Date();

  if (id != null) {
    pool.query("insert into auditoria (data,usuario,fecha) values($1,$2,$3) returning id", [data, user, datetime], (error, results) => {
      if (error) {
        console.log(error)
        throw error
      }

      console.log(results.rows)

    });
  } else {
    pool.query("insert into auditoria (data,usuario,fecha) values($1,$2,$3) returning id", [data, user, datetime], (error, results) => {
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
let xml_string = fs.readFileSync(__dirname + "/consultas.xml", "utf8");
var json = "";
parser.parseString(xml_string, function (error, result) {
  if (error === null) {
    json = result;
  }
  else {
    console.log(error);
  }
});


function get_sql(id_consulta) {

  var appsArr = json.Consultas.Consulta;

  var requiredObj = '';
  for (var i in appsArr) {
    if (appsArr[i].attr.id == id_consulta) {
      requiredObj = appsArr[i].sql;
      break;
    }
  }
  return requiredObj.toString();
}

app
  .route('/backend')
  .post(consulta)


app.get('/test', (request, response) => {

  pool.query("select 1", (error, results) => {
    if (error) {
      console.log(error)
      response.status(404).json({ 'error:': 'servicio' })
      throw error
    }

    console.log(results)
  });


})


app.post('/login', (request, response) => {

  console.log("hola")

  var data = request.body;
  var id_consulta = request.body.id_consulta;
  var query_text = get_sql(id_consulta);

  const usuario_usuario = request.body.usuario_usuario;



  pool.query(query_text, data, (error, results) => {
    if (error) {
      console.log(error)
      response.status(404).json({ 'error:': 'servicio' })
      throw error
    }
    console.log(results.rows)

    const accessToken = jwt.sign({ usuario_usuario: usuario_usuario }, accessTokenSecret);
    response.cookie('jwt', accessToken, { httpOnly: false, secure: false, maxAge: 317125598072 })
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



  var token = req.cookies.jwt;

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
        var archivo = path.join(__dirname, `../repositorio/${id}/${EDFile.name}`)


        if (!fs.existsSync(ruta)) {
          fs.mkdirSync(ruta, { recursive: true });
        }


        EDFile.mv(archivo, err => {
          if (err) return res.status(500).send({ message: err })

          var datetime = new Date()
          var datetimeTime = datetime.getTime();

          var localOffset = datetime.getTimezoneOffset() * 60000;
          var utc = datetimeTime + localOffset;
          var localTime = utc - (3600000 * 5);
          var newDate = new Date(localTime);
          // console.log(datetime)
          // console.log(newDate);

          pool.query("INSERT INTO documentos(id,identificador,ruta,nombre,fecha,usuario) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT(nombre) DO UPDATE set fecha=$5", [uuid.v1(), id, archivo, EDFile.name, newDate, usuario], (error, results) => {
            if (error) {
              console.log(error)
              return res.status(500).send({ message: error })
            }

            return res.status(200).send({ message: 'File upload' })

          })


        })






      }
    });
  } else {
    response.status(403).json({ mensaje: 'sin permisos' });
  }


});

// Carga de fotografías
app.post('/upload/picture/:id', (req, res) => {

  let EDFile = req.files.file;
  var id = req.params.id;
  let uuid_file = uuid.v1();

  var ruta = path.join(__dirname, `../repositorio/fotografias/`)
  var archivo = path.join(__dirname, `../repositorio/fotografias/${uuid_file}.${EDFile.name.split(".")[1]}`)


  if (!fs.existsSync(ruta)) {
    fs.mkdirSync(ruta, { recursive: true });
  }


  EDFile.mv(archivo, err => {
    if (err) return res.status(500).send({ message: err })

    var datetime = new Date()
    var datetimeTime = datetime.getTime();

    var localOffset = datetime.getTimezoneOffset() * 60000;
    var utc = datetimeTime + localOffset;
    var localTime = utc - (3600000 * 5);
    var newDate = new Date(localTime);
    // console.log(datetime)
    // console.log(newDate);

    pool.query("INSERT INTO fotografias(id_fotografia,codigo_bupi,fecha_captura,ruta) VALUES ($1,$2,$3,$4)", [uuid_file, id, newDate, archivo], (error, results) => {
      if (error) {
        console.log(error)
        return res.status(500).send({ message: error })
      }

      return res.status(200).send({ message: 'File upload' })

    })


  })

});

//borrar documentos
app.post('/delete/:nombre', (req, res) => {

  var token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, accessTokenSecret, (err, decoded) => {
      if (err) {
        response.json({ mensaje: 'Token inválida' });
      } else {

        var nombre = req.params.nombre;
        var id = nombre.split('-')[0]
        console.log(nombre)
        console.log(id)

        var archivo = path.join(__dirname, `../repositorio/${id}/${nombre}`)


        if (fs.existsSync(archivo)) {

          fs.unlink(archivo, function (err) {
            if (err) return res.status(500).send({ message: err })

            pool.query("DELETE from documentos where nombre=$1", [nombre], (error, results) => {
              if (error) {
                console.log(error)
                return res.status(500).send({ message: error })
              }

              return res.status(200).send({ message: 'File deleted' })

            })


          });

        }




      }
    });
  } else {
    response.status(403).json({ mensaje: 'sin permisos' });
  }


});




app.get('/descargar/:ruta', function (req, res) {

  var ruta = req.params.ruta;

  pool.query("SELECT * from documentos where id=$1", [ruta], (error, results) => {
    if (error) {
      return res.status(500).send({ message: error })
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

app.post('/xls', function (req, res) {
  console.log(req.files.file)

  let csvData = req.files.file.data.toString('utf8');
  console.log(csvData)
  return csvtojson().fromString(csvData).then(json => { return res.status(201).json({ csv: csvData, json: json }) })
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





app.post('/correo', function (req, res) {

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

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.status(500).send({ mensaje: 'error' })
    } else {
      res.status(200).send({ mensaje: info.response })
    }
  });

});


app.post('/todoreport/:reporte', function (request, response) {


  var reporte = request.params.reporte;

  var data = "";


  if (reporte == 'all') {
    var consultas = [
      'reporte_actividades',
      'reporte_info3_predios_segregados',
      'reporte_info6_avaluos',
      'reporte_info7_control_calidad_juridico',
      'reporte_info8_control_calidad_catastral',
      'reporte_info42_adquisicion_tradentes',
      'reporte_info41_adquisicion_matrices',
      'reporte_info14_saneamiento_juridico',
      'reporte_info13_saneamiento_catastral',
      'reporte_info11_adquisicion_escritura',
      'reporte_info12_pago',
      'reporte_info15_areas'
    ]
    var names = [
      'CONSOLIDADO',
      'PREDIOS_SEGREGADOS',
      'AVALUOS',
      'CONTROL_CALIDAD_JURIDICO',
      'CONTROL_CALIDAD_CATASTRAL',
      'ADQUISICION_TRADENTES',
      'ADQUISICION_MATRICES',
      'SANEAMIENTO_JURIDICO',
      'SANEAMIENTO_CATASTRAL',
      'ADQUISICION_ESCRITURA',
      'PAGO',
      'AREAS'
    ]
  } else if (reporte == 'tributaria') {

    var consultas = ['tributaria_principal', 'tributaria_zmpa', 'tributaria_juridico'];
    var names = ['TRIBUTARIA', 'ACTADM_ZMPA', 'PORCENTAJE_DE_PROPIEDAD']

  } else if (reporte === 'all_servidumbres') {
    var consultas = [
      'reporte_info1_servidumbres',
      'reporte_info2_servidumbres',
      'reporte_info3_servidumbres',
      'reporte_info4_servidumbres',
      'reporte_info5_servidumbres',
      'reporte_info6_servidumbres',
      'reporte_info7_servidumbres',
      'reporte_info8_servidumbres',
      'reporte_info9_servidumbres',
      'reporte_info10_servidumbres',
      'reporte_info11_servidumbres',
      'reporte_info12_servidumbres',
      'reporte_info13_servidumbres',
      'reporte_info14_servidumbres',
      'reporte_info15_servidumbres',
      'reporte_info16_servidumbres',
      'reporte_info17_servidumbres',
      'reporte_info18_servidumbres',
      'reporte_info19_servidumbres'
    ]
    var names = [
      'GENERAL_PROYECTO',
      'GENERAL_PREDIO_SIRVIENTE',
      'GENERAL_PREDIOS_DERIVADOS',
      'AREA_Y_USOS_PREDIO_SIRVIENTE',
      'SERVIDUMBRE',
      'AVALUOS',
      'ORDEN_DE_PAGO',
      'SOPORTES_PAGO',
      'JURIDICO_SERVIDUMBRE',
      'CONSTITUCION_SERVIDUMBRE',
      'PROPIETARIO_CATASTRAL',
      'PROPIETARIO_JURIDICO_ACTUAL',
      'PROPIETARIO_CONSTITUCION',
      'INFRAESTRUCTURA_SERVIDUMBRE',
      'SANEAMIENTO_BASICO',
      'MUNICIPIOS_INTERSECTADOS',
      'DOCUMENTOS_REQUERIDOS',
      'CONTROL_CALIDAD_TECNICO',
      'ESTADO_SANEAMIENTO_BASICO',
    ]
  }




  var token = request.cookies.jwt;

  if (token) {
    jwt.verify(token, accessTokenSecret, (err, decoded) => {
      if (err) {
        response.json({ mensaje: 'Token inválida' });
      } else {
        request.decoded = decoded;


        var informacion = [];




        async function processTasks() {

          let k = 0;
          for (const id_consulta of consultas) {



            var query_text = get_sql(id_consulta);


            const { rows } = await pool.query(query_text)

            var jsn = rows
            var data = []
            var result = []
            for (var j in jsn[0]) {
              result.push(j);

            }
            data.push(result)

            for (var i = 0; i < jsn.length; i++) {
              var obj = jsn[i];
              var result = []
              for (var j in obj) {
                if (moment.isMoment(obj[j])) {
                  result.push(moment.utc(obj[j]).format("YYYY-MM-DD"));

                } else {
                  result.push(obj[j]);
                }

              }
              data.push(result)
            }

            var info = { name: names[k], data: data }

            informacion.push(info)

            k = k + 1;


          };



          console.log("tarea:" + "all")

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
  } else {
    response.status(403).json({ mensaje: 'sin permisos' });
  }




});

app.get('/help/:file', function (req, res) {


  var token = req.cookies.jwt;

  const file = path.join(__dirname, `../help/${req.params.file}`)


  if (file.includes(".db") || file.includes(".docx")) {
    res.download(file); // Set disposition and send it.
  } else {
    if (token) {
      jwt.verify(token, accessTokenSecret, (err, decoded) => {
        if (err) {
          res.json({ mensaje: 'Token inválida' });
        } else {


          const file = path.join(__dirname, `../help/${req.params.file}`)
          res.download(file); // Set disposition and send it.


        }
      });
    } else {
      res.status(403).json({ mensaje: 'sin permisos' });
    }
  }

});



//servicio de vector tiles para mapas


app.get("/vector-tile/:layer/:x/:y/:z", function (req, res) {
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
  pool.query(sql, values, function (err, mvt) {
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
  ly = ly[1]


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

    var sql1 = results.rows[0].sql + ' where id=' + id

    pool.query(sql1, (error, results) => {
      if (error) {
        throw error
      }

      res.status(200).json(results.rows)
    });


  });



});



app.get('/descargar/:ruta', function (req, res) {

  var ruta = req.params.ruta;

  pool.query("SELECT * from documentos where id=$1", [ruta], (error, results) => {
    if (error) {
      return res.status(500).send({ message: error })
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



app.post('/excel', function (request, response) {

  var data = request.body;
  var id_consulta = request.body.id_consulta;

  var query_text = get_sql(id_consulta);

  var token = request.cookies.jwt;

  if (token) {
    jwt.verify(token, accessTokenSecret, (err, decoded) => {
      if (err) {
        response.json({ mensaje: 'Token inválida' });
      } else {
        request.decoded = decoded;
        console.log(decoded)

        if (query_text.includes("token")) {

          query_text = query_text.replace(/token/g, "'" + decoded.usuario_usuario + "'");
        }


        pool.query(query_text, data, (error, results) => {
          if (error) {
            response.status(403).json({ mensaje: 'error de consulta' });
            throw error
          }

          var jsn = results.rows
          var data = []
          var result = []
          for (var j in jsn[0]) {
            result.push(j);

          }
          data.push(result)

          for (var i = 0; i < jsn.length; i++) {
            var obj = jsn[i];
            var result = []
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
  } else {
    response.status(403).json({ mensaje: 'sin permisos' });
  }





  /*
 res.setHeader('Content-type', "text/csv");

 res.setHeader('Content-disposition', 'attachment; filename=file.xls');
 
 res.send(text);
  */


});

app.post('/excel_conciliacion', function (request, response) {

  var data = request.body;
  var id_consulta = request.body.id_consulta;

  var consultas = {
    G66: {query: 'select count(*) from info43_contabilidad where clasificacion_contable = 9'},
    G35: {query: 'select count(*) from info43_contabilidad where clasificacion_contable = 1'},
    G36: {query: 'select count(*) from info43_contabilidad where clasificacion_contable = 6'},
    G37: {query: 'select count(*) from info43_contabilidad where clasificacion_contable = 5'},    
    G38: {query: 'select count(*) from info43_contabilidad where clasificacion_contable = 2'},
    G40: {query: 'select count(*) from info43_contabilidad where clasificacion_contable in (4,10)'},
    G41: {query: 'select count(*) from info43_contabilidad where clasificacion_contable = 8'},
    G42: {query: 'select count(*) from info43_contabilidad where clasificacion_contable = 11'},
    G43: {query: 'select count(*) from info43_contabilidad where clasificacion_contable = 12'},
    G44: {query: 'select count(*) from info43_contabilidad where clasificacion_contable = 7'},   
    F53: {query: "select count(*) from info43_contabilidad where cuenta_contable like '%171014%'"},    
    F54: {query: "select count(*) from info43_contabilidad where cuenta_contable like '%170516%'"},    
    F55: {query: "select count(*) from info43_contabilidad where cuenta_contable like '%834706%'"},  
    G13: {query: "select count(*) from info43_contabilidad where anotacion_contabilidad like '%834706%'"},    
    G14: {query: "select count(*) from info43_contabilidad where anotacion_contabilidad like '%BOSA GIRARDOT%'"},    
    G15: {query: "select count(*) from info43_contabilidad where anotacion_contabilidad = 'R. RUTA DEL SOL'"},    
    G16: {query: "select count(*) from info43_contabilidad where anotacion_contabilidad like '%R. PEREIRA - LA VICTORIA%'"},
    G17: {query: "select count(*) from info43_contabilidad where anotacion_contabilidad like '%R. TRANSVERSAL DE LAS AMERICAS%'"},    
    G18: {query: "select count(*) from info43_contabilidad where anotacion_contabilidad like '%R. TRANSV, AMERICAS TAMALAMEQUE%'"},    
    G19: {query: "select count(*) from info43_contabilidad where anotacion_contabilidad like '%R. RUMICHACA - PASTO- CHACHAGUI-AEROPUERTO - DESARROLLO VIAL DE NARIÑO%'"},    
    G20: {query: "select count(*) from info43_contabilidad where anotacion_contabilidad = '2020-20 R. RUTA DEL SOL'"},    
    G21: {query: "select count(*) from info43_contabilidad where anotacion_contabilidad like '%ZIPAQUIRA - PALENQUE%'"},    
    G22: {query: "select count(*) from info43_contabilidad where anotacion_contabilidad like '%R. ZONA METROPOLITANA DE BUCARAMANGA%'"},    
    G23: {query: "select count(*) from info43_contabilidad where anotacion_contabilidad like '%R. NEIVA -CASTILLA - GIRADOT%'"},    
    G24: {query: "select count(*) from info43_contabilidad where anotacion_contabilidad like '%devimed%'"},    
    G25: {query: "select count(*) from info43_contabilidad where anotacion_contabilidad like '%MALLA VIAL DEL VALLE Y CAUCA%'"},    
    G26: {query: "select count(*) from info43_contabilidad where anotacion_contabilidad like '%R. ZONA METROP. CUCUTA%'"},    
    G27: {query: "select count(*) from info43_contabilidad where anotacion_contabilidad like '%Norte de Santander%'"},    
    G28: {query: "select count(*) from info43_contabilidad where anotacion_contabilidad like '%R. BOGOTA (CALLE 236) - ZIPAQUIRA - DEVINORTE%'"},    
    G29: {query: "select count(*) from info43_contabilidad where anotacion_contabilidad like '%S.%'"},    
    G30: {query: "select count(*) from info43_contabilidad where anotacion_contabilidad like '%1111111111%'"},    
    G31: {query: "select count(*) from info43_contabilidad where anotacion_contabilidad like '%M.83469 del%'"},    
    G32: {query: "select count(*) from info43_contabilidad where anotacion_contabilidad like '%RECLASIFICACION  SUBDIRECCION ADMINISTRATIVA%'"},    
    G33: {query: "select count(*) from info43_contabilidad where LOWER(anotacion_contabilidad) like '%otro%'"}
    

    // G65: {query: 'select count(*) from info43_contabilidad left join info2_adquisicion ia on info43_contabilidad.id_expediente = ia.id_expediente where clasificacion_contable = 9 and titular = 6'}
  }  
  

  var query_text = get_sql(id_consulta);

  var token = request.cookies.jwt;

  if (token) {
    jwt.verify(token, accessTokenSecret, (err, decoded) => {
      if (err) {
        response.json({ mensaje: 'Token inválida' });
      } else {
        request.decoded = decoded;
        console.log(decoded)

        if (query_text.includes("token")) {

          query_text = query_text.replace(/token/g, "'" + decoded.usuario_usuario + "'");
        }

        async function processTasks() {
          let resultsList = []
          let keys = Object.keys(consultas)
          console.log(keys)
          // let keys = Object.keys(consultas).map((key, idx) => {
          //   console.log(key)

          // })
          keys.forEach(element => {
            try {
              const promise = pool.query(consultas[element].query)
                .then(results => {
                  return results.rows;
                })
                .catch(err => {
                  console.log(err)
                  response.status(200).json("error")
                  throw err
                })
  
              resultsList.push(promise)
            }
            catch (err) {
              console.log(err)
              response.status(200).json("error")
            }
          });
          
          const array = await Promise.all(resultsList);
          // console.log(array)
          return array;
          // response.status(200).send(array);
        }

        processTasks().then(result => {
          consultas['resultados'] = result;
          console.log(result)
        });

        // console.log(resultados)


        pool.query(query_text, data, (error, results) => {
          if (error) {
            response.status(403).json({ mensaje: 'error de consulta' });
            throw error
          }

          var jsn = results.rows
          var data = []
          var result = []
          for (var j in jsn[0]) {
            result.push(j);

          }
          data.push(result)

          for (var i = 0; i < jsn.length; i++) {
            var obj = jsn[i];
            var result = []
            for (var j in obj) {
              if (moment.isMoment(obj[j])) {
                result.push(moment.utc(obj[j]).format("YYYY-MM-DD"));

              } else {
                result.push(obj[j]);
              }

            }
            data.push(result)
          }

          /*
          const filePath = __dirname + "/conciliacion.xlsx";
          // const filePath = '/conciliacion.xlsx';

          const workbook = new ExcelJS.Workbook();

          // Load the existing Excel file
          // workbook.xlsx.readFile('C:/Users/Yeiner Mendivelso/Documents/invias/bupi/bupi/backend/conciliacion.xlsx')
          workbook.xlsx.readFile(__dirname + "/conciliacion.xlsx")
          .then(() => {
            // const worksheet = workbook.getWorksheet('Hoja1');
            const worksheet = workbook.getWorksheet('CONCILIACION de');
            
            const today = new Date();
            const year = today.getFullYear();
            const month = today.getMonth() + 1; // Months are zero-based, so we add 1
            const day = today.getDate();

            const currentDate = `${year}/${month < 10 ? '0' + month : month}/${day < 10 ? '0' + day : day}`;

            worksheet.getCell('F4').value = currentDate;
            // worksheet2.getCell('J2').value = 'Yeiner Mendivelso Ochoa';

            workbook.xlsx.writeBuffer()
            .then((buffer) => {
              // Set the response headers for file download
              response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
              response.setHeader('Content-Disposition', 'attachment; filename=example.xlsx');
              response.setHeader('Content-Length', buffer.length);

              // Send the Excel file as the response
              response.send(buffer);
            })
            .catch((error) => {
              console.error('Error generating Excel file:', error);
              res.status(500).send('Error generating Excel file');
            });
          })
          .catch((error) => {
            console.error('Error generating Excel file:', error);
            res.status(500).send('Error generating Excel file');
          });
          */

          // Access the worksheet you want to manipulate
          // const worksheet = workbook.getWorksheet('Hoja1');

          // const sheet = workbook.addWorksheet('My Sheet');

          // const worksheet = workbook.getWorksheet(1);

          // Modify the desired data, such as cell values or formulas
          // sheet.getCell('J2').value = 'Yeiner Mendivelso Ochoa';

          // // Save the modified workbook
          // await workbook.xlsx.writeFile('path/to/save/modified.xlsx');

          // workbook.xlsx.writeBuffer()
          // .then((buffer) => {
          //   // Set the response headers for file download
          //   response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          //   response.setHeader('Content-Disposition', 'attachment; filename=example.xlsx');
          //   response.setHeader('Content-Length', buffer.length);

          //   // Send the Excel file as the response
          //   response.send(buffer);
          // })
          // .catch((error) => {
          //   console.error('Error generating Excel file:', error);
          //   res.status(500).send('Error generating Excel file');
          // });

          // const workbook = xlsx.parse(filePath);

          // var buffer = xlsx.build(workbook); // Returns a buffer

          // response.setHeader('Content-disposition', 'attachment; filename=conciliacion.xlsx');

          // // response.writeHead(200, [['Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']]);

          // response.end(Buffer.from(buffer));

        })

        const filePath = __dirname + "/conciliacion.xlsx";
          // const filePath = '/conciliacion.xlsx';

        const workbook = new ExcelJS.Workbook();

          // Load the existing Excel file
          // workbook.xlsx.readFile('C:/Users/Yeiner Mendivelso/Documents/invias/bupi/bupi/backend/conciliacion.xlsx')
        workbook.xlsx.readFile(__dirname + "/conciliacion.xlsx")
        .then(() => {
            // const worksheet = workbook.getWorksheet('Hoja1');
          const worksheet = workbook.getWorksheet('CONCILIACION de');
            
          const today = new Date();
          const year = today.getFullYear();
          const month = today.getMonth() + 1; // Months are zero-based, so we add 1
          const day = today.getDate();

          const currentDate = `${year}/${month < 10 ? '0' + month : month}/${day < 10 ? '0' + day : day}`;

          worksheet.getCell('F4').value = currentDate;

          // for (let index = 0; index < Object.keys(consultas).length; index++) {
          //   // const element = array[index];
          //   console.log(Object.keys(consultas)[index])
          //   console.log(index, consultas['resultados'][0][0].count, consultas['resultados'][index][0].count)

          //   worksheet.getCell(Object.keys(consultas)[index]).value = consultas['resultados'][index][0].count;
            
          // }

          worksheet.getCell('G66').value = consultas['resultados'][0][0].count;

          worksheet.getCell('G35').value = consultas['resultados'][1][0].count;

          worksheet.getCell('G36').value = consultas['resultados'][2][0].count;

          worksheet.getCell('G37').value = consultas['resultados'][3][0].count;

          worksheet.getCell('G38').value = consultas['resultados'][4][0].count;
          
          worksheet.getCell('G40').value = consultas['resultados'][5][0].count;

          worksheet.getCell('G41').value = consultas['resultados'][6][0].count;
          
          worksheet.getCell('G42').value = consultas['resultados'][7][0].count;

          worksheet.getCell('G43').value = consultas['resultados'][8][0].count;

          worksheet.getCell('G44').value = consultas['resultados'][9][0].count;

          worksheet.getCell('F53').value = consultas['resultados'][10][0].count;

          worksheet.getCell('F54').value = consultas['resultados'][11][0].count;

          worksheet.getCell('F55').value = consultas['resultados'][12][0].count;

          worksheet.getCell('G13').value = consultas['resultados'][13][0].count;

          worksheet.getCell('G14').value = consultas['resultados'][14][0].count;

          worksheet.getCell('G15').value = consultas['resultados'][15][0].count;

          worksheet.getCell('G16').value = consultas['resultados'][16][0].count;

          worksheet.getCell('G17').value = consultas['resultados'][17][0].count;

          worksheet.getCell('G18').value = consultas['resultados'][18][0].count;

          worksheet.getCell('G19').value = consultas['resultados'][19][0].count;

          worksheet.getCell('G20').value = consultas['resultados'][20][0].count;

          worksheet.getCell('G21').value = consultas['resultados'][21][0].count;

          worksheet.getCell('G22').value = consultas['resultados'][22][0].count;

          worksheet.getCell('G23').value = consultas['resultados'][23][0].count;

          worksheet.getCell('G24').value = consultas['resultados'][24][0].count;

          worksheet.getCell('G25').value = consultas['resultados'][25][0].count;

          worksheet.getCell('G26').value = consultas['resultados'][26][0].count;

          worksheet.getCell('G27').value = consultas['resultados'][27][0].count;

          worksheet.getCell('G28').value = consultas['resultados'][28][0].count;
          
          worksheet.getCell('G29').value = consultas['resultados'][29][0].count;

          worksheet.getCell('G30').value = consultas['resultados'][30][0].count;

          worksheet.getCell('G31').value = consultas['resultados'][31][0].count;

          worksheet.getCell('G32').value = consultas['resultados'][32][0].count;

          worksheet.getCell('G33').value = consultas['resultados'][33][0].count;

          console.log("pruebas", consultas['resultados'])
            // worksheet2.getCell('J2').value = 'Yeiner Mendivelso Ochoa';

          workbook.xlsx.writeBuffer()
          .then((buffer) => {
              // Set the response headers for file download
            // response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            // response.setHeader('Content-Disposition', 'attachment; filename=example.xlsx');
            // response.setHeader('Content-Length', buffer.length);

              // Send the Excel file as the response
            // response.send(buffer);

            response.setHeader('Content-disposition', 'attachment; filename=conciliacion.xlsx');
          // response.writeHead(200, [['Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']]);

            response.end(new Buffer.from(buffer, 'base64'));

          })
          .catch((error) => {
            console.error('Error generating Excel file:', error);
            response.status(500).send('Error generating Excel file');
          });
        })
        .catch((error) => {
          console.error('Error generating Excel file:', error);
          response.status(500).send('Error generating Excel file');
        });

        



      }
    });
  } else {
    response.status(403).json({ mensaje: 'sin permisos' });
  }





  /*
 res.setHeader('Content-type', "text/csv");

 res.setHeader('Content-disposition', 'attachment; filename=file.xls');
 
 res.send(text);
  */


});

app.post("/actualizacionMasiva", function (request, response) {
  var token = request.cookies.jwt;
  let data = request.body;

  var consultas = [
    'update_info1_fuente',
    'update_info2_adquisicion',
    'update_info4_informacion_catastral',
    'update_info5_informacion_invias',
    'update_info10_sig',
    'update_info11_adquisicion_escritura',
    'update_info13_saneamiento_catastral',
    'update_info14_saneamiento_juridico'
    // 'update_info2_general_predio',
    // 'update_info3_areas_usos',
    // 'update_info4_avaluos',
    // 'update_info5_juridicos',
    // 'update_info21_juridicos',
    // 'update_info7_propietario_catastral',
    // 'update_info8_propietario_juridico',
    // 'update_info6_propietario_anterior_juridico',
    // 'update_info9_zmpa',
    // 'update_info10_infraestructura',
    // 'update_info14_saneamiento_basico',
    // 'update_info15_saneamiento_juridico',
    // 'update_info18_municipios_intersectados',
    // 'update_info19_mutacion_predial',
    // 'update_info11_estudios_detallados',
    // 'update_info17_documentos_requeridos',
    // 'update_info12_control_calidad_tecnico',
    // 'update_info13_control_calidad_juridico',
    // 'update_info22_factura_municipio',
  ]
  var hojas = [
    'fuente',
    'info2_adquisicion',
    'informacion_catastral',
    'informacion_invias',
    'sig',
    'adquisicion_escritura',
    'saneamiento_catastral',
    'saneamiento_juridico'
    // 'general_predio',
    // 'areas_usos',
    // 'avaluos',
    // 'juridico',
    // 'adquisicion',
    // 'propietario_catastral',
    // 'propietario_juridico',
    // 'propietario_anterior_juridico',
    // 'zmpa',
    // 'infraestructura',
    // 'saneamiento_basico',
    // 'saneamiento_juridico',
    // 'municipios_intersectados',
    // 'mutacion_predial',
    // 'estudios_detallados',
    // 'documentos_requeridos',
    // 'control_calidad_tecnico',
    // 'control_calidad_juridico',
    // 'factura_municipio',
  ]

  if (token) {
    jwt.verify(token, accessTokenSecret, (err, decoded) => {
      if (err) {
        response.json({ mensaje: 'Token inválida' });
      } else {
        request.decoded = decoded;

        let totalData = 0;
        let counter = 0;

        Object.keys(data).map((key, idx) => {
          let hoja_nombre = data[key];
          if (hoja_nombre.length > 0) {
            totalData = totalData + hoja_nombre.length;
          }

        });


        // console.log(resultsList)

        async function processTasks() {
          let resultsList = []
          Object.keys(data).map((key, idx) => {
            let hoja_nombre = data[key];
            if (hoja_nombre.length > 0) {
              if (hojas.includes(key)) {
                hoja_nombre.forEach(element => {
                  counter = counter + 1;
                  let id_consulta = consultas[idx];
                  var query_text = get_sql(id_consulta);
                  var upd = ""
                  for (var k in element) {
                    upd = upd + k + "=$" + k + ","
                  }
                  upd = upd.replace(/,\s*$/, "");

                  if (query_text.includes("upd_query_alpaca")) {
                    query_text = query_text.replace("upd_query_alpaca", upd);
                    var usuario = decoded.usuario_usuario;
                    auditoria(element, usuario, counter)
                  } else if (query_text.includes("token")) {
                    query_text = query_text.replace(/token/g, "'" + decoded.usuario_usuario + "'");
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
  } else {
    response.status(403).json({ mensaje: 'sin permisos' });
  }
})

app.post('/download-shp', function (request, response) {
  const token = request.cookies.jwt;
  const data = request.body;

  if (token) {
    jwt.verify(token, accessTokenSecret, (err, decoded) => {
      if (err) {
        response.json({ mensaje: 'Token inválida' });
      } else {
        request.decoded = decoded;
        const geojson = data.geojson;
        const options = {
          layer: 'predio',
          targetCrs: 4326
        }

        async function convertGeoJSON() {
          const shpresult = await convert(geojson,
            path.join(__dirname, '../help/' + data.codigo_bupi + ".zip"),
            options);
          response.status(200).json({
            mensaje: 'Shape generado correctamente'
          })
        }

        convertGeoJSON();

      }

    });
  } else {
    response.status(403).json({ mensaje: 'sin permisos' });
  }
})


app.post('/generate-pdf', function (request, response) {
  const token = request.cookies.jwt;
  const data = request.body;

  if (token) {
    jwt.verify(token, accessTokenSecret, (err, decoded) => {
      if (err) {
        response.json({ mensaje: 'Token inválida' });
      } else {

        //Load the docx file as binary content
        const content = fs.readFileSync(
          path.resolve(__dirname, "../help/plantilla-reporte.docx"),
          "binary"
        );
        const zip = new PizZip(content);
        const doc = new DocxTemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
          nullGetter: function nullGetter(part, scopeManager) {
            if (!part.module) {
              return "";
            }
            if (part.module === "rawxml") {
              return "";
            }
            return "";
          }
        });
        // render the document
        // (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
        doc.render(data);
        const buf = doc.getZip().generate({ type: "nodebuffer" });
        // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
        fs.writeFileSync(path.resolve(__dirname, "../help/output.docx"), buf);
        // const form = new FormData();
        // form.append('file', fs.createReadStream(path.resolve(__dirname, "../help/output.docx")));
        // console.log(fs.createReadStream(path.resolve(__dirname, "../help/output.docx")));
        response.status(200).send(fs.createReadStream(path.resolve(__dirname, "../help/output.docx")));
        // const toPDF = gotenberg.pipe(
        //   gotenberg.gotenberg('http://192.168.56.10:3000'),
        //   gotenberg.convert,
        //   gotenberg.office,
        //   gotenberg.to(gotenberg.landscape),
        //   gotenberg.set(gotenberg.filename('reporte.pdf')),
        //   gotenberg.please
        // );

        // async function createPDF () {
        //   const pdf = await toPDF(path.resolve(__dirname, "../help/output.docx"));
        //   console.log("PDF RES", pdf);
        // }

        // createPDF();

        
        // axios.post(urlPdf, form, {
        //   headers: {
        //     ...form.getHeaders()
        //   }
        // }).then(res => {
        //   console.log("RES BACK", res);
        //   // response.setHeader('Content-disposition', 'attachment; filename=reporte.pdf');
        //   // console.log("RES PDF", new Blob([response.data]));
        //   // window.URL.createObjectURL(new Blob([response.data]));
        //   // fs.writeFileSync(path.resolve(__dirname, "../help/reporte.pdf"), Buffer.from(res.data,'binary'));
        //   // response.status(200).send(res.data);
          

        //   // fs.writeFileSync(path.resolve(__dirname, "../help/reporte.pdf"), new Buffer.from(res.data, 'base64'));
        //   // response.end(new Buffer.from(res.data, 'base64'));
        //   // const w = res.data.pipe(fs.createWriteStream(path.join(__dirname, `../help/reporte.pdf`)));
        //   // w.on('finish', () => {
        //   //   console.log("Finished")
        //   // })
        //   // fileDownload(res.data.pipe(), 'reporte.pdf');
        //   // fileSaver.saveAs(res.data, path.join(__dirname, `../help/reporte.pdf`));

        //   // response.end(new Buffer.from(buffer, 'base64'));
        // }).catch(err => {
        //   console.log("ERROR", err);
        // })

        // async function convertDocx() {
        //   const ext = '.pdf'
        //   const inputPath = path.join(__dirname, '../help/output.docx');
        //   const outputPath = path.join(__dirname, `../help/reporte${ext}`);

        //   // Read file
        //   const docxBuf = await fsPromises.readFile(inputPath);
        //   console.log("DOC BUF", docxBuf);
        //   // Convert it to pdf format with undefined filter (see Libreoffice docs about filter)
        //   const pdfBuf = await libre.convertAsync(docxBuf, ext, undefined);          
        //   console.log("PDF BUF", pdfBuf);
        //   // Here in done you have pdf file which you can save or transfer in another stream
        //   await fsPromises.writeFile(outputPath, pdfBuf);
        //   response.end(pdfBuf);
        // }

        // convertDocx().catch((err) => {
        //   console.log("Error converting file:" + err);
        // })

      }

    });
  } else {
    response.status(403).json({ mensaje: 'sin permisos' });
  }
})





//var DIST_DIR = path.join(__dirname, "../dist/");

//app.use("/", expressStaticGzip(DIST_DIR));
var DIST_DIR = path.join(__dirname, "../dist/");

app.use('/', expressStaticGzip(DIST_DIR));


app.get('/web/*', (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});


//backend en el puerto 3000
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

