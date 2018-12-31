// Servicio para manejar JWTS en la app

"use strict";

var jwt = require("jwt-simple");
var moment = require("moment");
var secret = "claveSecreta";
//Creamos una funcion que recibe un usuario para generar el JWT
exports.createToken = user => {
  // Definimos estrucutra del token
  let payload = {
    sub: user._id,
    name: user.name,
    surname: user.name,
    role: user.role,
    email: user.email,
    image: user.image,
    // Fecha de creacion del token
    iat: moment().unix(),
    // Fecha de expiracion del token
    exp: moment()
      .add(30, "days")
      .unix()
  };

  //Devolvemos el token encodificado
  return jwt.encode(payload, secret);
};
