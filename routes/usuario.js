var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');
// var SEED = require('../config/config').SEED;

var app = express();

var Usuario = require('../models/usuario')

// =================================
// Obtener todos los usuarios
// =================================
app.get('/', ( req, res, next ) => {

  Usuario.find({ }, 'nombre email img role')

    .exec(

      ( err, usuarios ) =>{

      if( err ){
        return res.status(500).json({
          ok: false,
          mensaje: 'Error cargando usuarios',
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        usuarios: usuarios
      });

    })

});

// =================================
// Actualizar un nuevo usuario
// =================================
//
app.put('/:id', mdAutenticacion.verificaToken, ( req, res ) =>{

  var id = req.params.id;
  var body = req.body;

  Usuario.findById( id, ( err, usuario ) =>{

    if( err ){
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al buscar usuario',
        errors: err
      });
    }

    if( !usuario ){
      return res.status(400).json({
        ok: false,
        mensaje: 'El usuario con el id ' + id + ' no existe',
        errors: { message: 'No existe un usuario con ese ID'}
      });
    }

    usuario.nombre = body.nombre;
    usuario.email = body.email;
    usuario.role = body.role;

    usuario.save( ( err, usuarioGuardado ) => {

      if( err ){
        return res.status(400).json({
          ok: false,
          mensaje: 'Error al actualizar usuario',
          errors: err
        });
      }

      usuarioGuardado.password = ':)';

      res.status(200).json({
        ok: true,
        usuario: usuarioGuardado
      });

    });

  });

});

// =================================
// Crear un nuevo usuario
// =================================
//
// Crear el post
app.post('/', mdAutenticacion.verificaToken, ( req, res ) => {

  // leer el body
  var body = req.body;

  // creacion de un nuevo objeto tipo Usuario
  var usuario = new Usuario({
    // inicializar todas los campos
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    img: body.img,
    role: body.role
  });

  // guardar usuario
  usuario.save( ( err, usuarioGuardado ) => {

    // si hay error mandar status
    if( err ){
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al crear usuario',
        errors: err
      });
    }

    // si no hay error guardar el usuario
    res.status(201).json({
      ok: true,
      usuario: usuarioGuardado,
      usuariotoken: req.usuario
    });

  });

});

// =================================
// Borrar un usuario por el id
// =================================
//

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

  var id = req.params.id;

  Usuario.findByIdAndRemove(id, ( err, usuarioBorrado) => {

    // si hay error mandar status
    if( err ){
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al borrar usuario',
        errors: err
      });
    }

    // no existe un usuario con ese id
    if( !usuarioBorrado ){
      return res.status(400).json({
        ok: false,
        mensaje: 'No existe un usuario con ese id',
        errors: { message: 'No existe un usuario con ese id'}
      });
    }

    // si no hay error guardar el usuario
    res.status(200).json({
      ok: true,
      usuario: usuarioBorrado
    });

  });

});

module.exports = app;
