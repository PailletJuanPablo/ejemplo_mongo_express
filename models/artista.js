'use strict'

// Importamos mongoose para utilizarlo
var mongoose = require('mongoose');

//Creamos un objeto del tipo Schema para configurar modelos
var Schema = mongoose.Schema;

//Creamos el modelo de Artista
var ArtistSchema = new Schema({
    name: String,
    description: String,
    image: String,
    any: Object
}, {strict:false});

//Lo exportamos
module.exports = mongoose.model('Artist', ArtistSchema); 