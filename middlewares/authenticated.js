//Middleware para verificar que el usuario este logueado al realizar una request

'use strict';

// Importamos jwy y moment
var jwt = require('jwt-simple');
var moment = require('moment');

// Definimos clave secreta para el hash
var secret = 'claveSecreta';

exports.ensureAuth = (req, res, next) => {
  // Recibimos los datos de la request. Var next es de middlewares
  if (!req.headers.authorization) {
    return res.status(403).send({
      message: 'La petición no tiene la cabecera requerida para autenticacion'
    });
  }

  var token = req.headers.authorization.replace(/['"]+/g, '');

  try {
    // Hasta aqui tenemos el token y lo decodificamos
    var payload = jwt.decode(token, secret);

    if (payload.exp <= moment().unix()) {
      console.log(ex);
      return res.status(401).send({
        message: 'El token ha expirado'
      });
    }
  } catch (ex) {
    return res.status(404).send({
      message: 'Token no válido'
    });
  }
  req.user = payload;

  next();
};
