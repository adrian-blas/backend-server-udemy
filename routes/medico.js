var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');
// var SEED = require('../config/config').SEED;

var app = express();

var Medico = require('../models/medico')

// =================================
// Obtener todos los Medicoes
// =================================
app.get('/', ( req, res, next ) => {

  var desde = req.query.desde || 0;
  desde = Number(desde);

  Medico.find({ })
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .populate('hospital')
    .exec(

      ( err, medico ) =>{

      if( err ){
        return res.status(500).json({
          ok: false,
          mensaje: 'Error cargando medico',
          errors: err
        });
      }

      Medico.count({}, (err, conteo) => {

        res.status(200).json({
          ok: true,
          medicos: medico,
          total: conteo
        });

      });

    })

});

// =================================
// Obtener medico
// =================================
app.get('/:id', (req, res) => {

  var id = req.params.id;

  Medico.findById( id )
        .populate('usuario', 'nombre email img')
        .populate('hospital')
        .exec( (err, medico) => {

          if( err ){
            return res.status(500).json({
              ok: false,
              mensaje: 'Error al buscar medico',
              errors: err
            });
          }

          if( !medico ){
            return res.status(400).json({
              ok: false,
              mensaje: 'El medico con el id ' + id + ' no existe',
              errors: { message: 'No existe un medico con ese ID'}
            });
          }

          res.status(200).json({
            ok: true,
            medico: medico
          });

        })

});

// =================================
// Actualizar un nuevo medico
// =================================
//
app.put('/:id', mdAutenticacion.verificaToken, ( req, res ) =>{

  var id = req.params.id;
  var body = req.body;

  Medico.findById( id, ( err, medico ) =>{

    if( err ){
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al buscar medico',
        errors: err
      });
    }

    if( !medico ){
      return res.status(400).json({
        ok: false,
        mensaje: 'El medico con el id ' + id + ' no existe',
        errors: { message: 'No existe un medico con ese ID'}
      });
    }

    medico.nombre = body.nombre;
    medico.usuario = req.usuario._id;
    medico.usuario = body.hospital;

    medico.save( ( err, medicoGuardado ) => {

      if( err ){
        return res.status(400).json({
          ok: false,
          mensaje: 'Error al actualizar medico',
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        medico: medicoGuardado
      });

    });

  });

});

// =================================
// Crear un nuevo medico
// =================================
//
// Crear el post
app.post('/', mdAutenticacion.verificaToken, ( req, res ) => {

  // leer el body
  var body = req.body;

  // creacion de un nuevo objeto tipo Usuario
  var medico = new Medico({
    // inicializar todas los campos
    nombre: body.nombre,
    usuario: req.usuario._id,
    hospital: body.hospital
  });

  // guardar usuario
  medico.save( ( err, medicoGuardado ) => {

    // si hay error mandar status
    if( err ){
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al crear medico',
        errors: err
      });
    }

    // si no hay error guardar el medico
    res.status(201).json({
      ok: true,
      medico: medicoGuardado,
    });

  });

});

// =================================
// Borrar un medico por el id
// =================================
//

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

  var id = req.params.id;

  Medico.findByIdAndRemove(id, ( err, medicoBorrado) => {

    // si hay error mandar status
    if( err ){
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al borrar medico',
        errors: err
      });
    }

    // no existe un medico con ese id
    if( !medicoBorrado ){
      return res.status(400).json({
        ok: false,
        mensaje: 'No existe un medico con ese id',
        errors: { message: 'No existe un medico con ese id'}
      });
    }

    // si no hay error guardar el usuario
    res.status(200).json({
      ok: true,
      medico: medicoBorrado
    });

  });

});

module.exports = app;
