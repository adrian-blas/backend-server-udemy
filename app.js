// requires
var express = require('express');
var mongoose = require('mongoose');

// inicializar variables
var app = express();

// conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', ( err, res ) => {

  if( err ) throw err;

  console.log('Base de datos: \x1b[32m%s\x1b[0m',' online');

})

// rutas
app.get('/', ( req, res, next ) => {

  res.status(403).json({
    ok: true,
    mensaje: 'Peticion realizada correctamente'
  });

})

// escuchar peticiones
app.listen(3000, () => {
  console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m',' online');
})
