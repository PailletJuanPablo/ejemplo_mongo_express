"use strict";

// Importamos express y body parser, creamos una var para usarlo

var express = require("express");
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

//Cargamos las rutas

var user_routes = require("./routes/usuario");
var artist_routes = require("./routes/artista");
var song_routes = require("./routes/song");
// Configuramos bodyparser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Configuramos cabeceras HTTP
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization,X-API-KEY,Origin,X-Requested-With,Content-Type,Accept,Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT,DELETE");
  res.header("Allow", "GET, POST, PUT,DELETE");

  next();
});
//rutas base
app.use("/api", user_routes);
app.use("/api", artist_routes);
app.use("/api", song_routes);

module.exports = app;
