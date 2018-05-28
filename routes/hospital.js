var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');
// var SEED = require('../config/config').SEED;

var app = express();

var Hospital = require('../models/hospital')

// =================================
// Obtener todos los Hospitales
// =================================
app.get('/', ( req, res, next ) => {

  var desde = req.query.desde || 0;
  desde = Number(desde);

  Hospital.find({ })
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .exec(

      ( err, hospitales ) =>{

      if( err ){
        return res.status(500).json({
          ok: false,
          mensaje: 'Error cargando hospital',
          errors: err
        });
      }

      Hospital.count({}, (err, conteo) => {

        res.status(200).json({
          ok: true,
          hospitales: hospitales,
          total: conteo
        });

      });

    })

});

// =================================
// Actualizar un nuevo hospital
// =================================
//
app.put('/:id', mdAutenticacion.verificaToken, ( req, res ) =>{

  var id = req.params.id;
  var body = req.body;

  Hospital.findById( id, ( err, hospital ) =>{

    if( err ){
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al buscar hospital',
        errors: err
      });
    }

    if( !hospital ){
      return res.status(400).json({
        ok: false,
        mensaje: 'El hospital con el id ' + id + ' no existe',
        errors: { message: 'No existe un hospital con ese ID'}
      });
    }

    hospital.nombre = body.nombre;
    hospital.usuario = req.usuario._id;

    hospital.save( ( err, hospitalGuardado ) => {

      if( err ){
        return res.status(400).json({
          ok: false,
          mensaje: 'Error al actualizar hospital',
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        hospital: hospitalGuardado
      });

    });

  });

});

// =================================
// Crear un nuevo hospital
// =================================
//
// Crear el post
app.post('/', mdAutenticacion.verificaToken, ( req, res ) => {

  // leer el body
  var body = req.body;

  // creacion de un nuevo objeto tipo Usuario
  var hospital = new Hospital({
    // inicializar todas los campos
    nombre: body.nombre,
    usuario: req.usuario._id
  });

  // guardar usuario
  hospital.save( ( err, hospitalGuardado ) => {

    // si hay error mandar status
    if( err ){
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al crear hospital',
        errors: err
      });
    }

    // si no hay error guardar el hospital
    res.status(201).json({
      ok: true,
      hospital: hospitalGuardado,
    });

  });

});

// =================================
// Borrar un hospital por el id
// =================================
//

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

  var id = req.params.id;

  Hospital.findByIdAndRemove(id, ( err, hospitalBorrado) => {

    // si hay error mandar status
    if( err ){
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al borrar hospital',
        errors: err
      });
    }

    // no existe un hospital con ese id
    if( !hospitalBorrado ){
      return res.status(400).json({
        ok: false,
        mensaje: 'No existe un hospital con ese id',
        errors: { message: 'No existe un hospital con ese id'}
      });
    }

    // si no hay error guardar el usuario
    res.status(200).json({
      ok: true,
      hospital: hospitalBorrado
    });

  });

});

module.exports = app;
