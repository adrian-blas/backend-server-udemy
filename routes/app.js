var express =require('express');

var app = express();
// rutas
app.get('/', ( req, res, next ) => {

  res.status(403).json({
    ok: true,
    mensaje: 'Peticion realizada correctamente'
  });

});

module.exports = app;
