var express =require('express');

var fileUpload = require('express-fileupload');

var app = express();

// default options
app.use(fileUpload());


app.put('/:tipo/:id', ( req, res, next ) => {

  var tipo = req.params.tipo;
  var id =req.params.id;

  // Tipos de coleccion
  var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
  if( tiposValidos.indexOf( tipo ) < 0 ){
    return res.status(400).json({
      ok: false,
      mensaje: 'Tipo de coleccion no es valida',
      errors: { message: 'Tipo de coleccion no es valida' }
    });
  }

  if( !req.files ){
    return res.status(400).json({
      ok: false,
      mensaje: 'No selecciono nada',
      errors: { message: 'Debe de seleccionar una imagen' }
    });
  }

  //  Obtener nombre del archivo
  var archivo = req.files.imagen;
  var nombreCortado = archivo.name.split('.');
  var extensionArchivo = nombreCortado[ nombreCortado.length - 1];

  // solo estas extensiones aceptamos
  var extensionesValdias = ['png', 'jpg', 'gif', 'jpeg'];

  if( extensionesValdias.indexOf( extensionArchivo ) < 0){
    return res.status(400).json({
      ok: false,
      mensaje: 'Extension no valida',
      errors: { message: 'Las extensiones validas son ' + extensionesValdias.join(', ') }
    });
  }

  // Nombre de archivo personalizado
  var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;

  // Mover el archivo del temporal a un path
  var path = `./uploads/${ tipo }/${ nombreArchivo }`;

  archivo.mv( path, err => {

    if( err ){
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al mover archivo',
        errors: err
      });
    }

    res.status(200).json({
      ok: true,
      mensaje: 'Archivo movido',
      extensionArchivo: extensionArchivo
    });

  });


});

module.exports = app;
