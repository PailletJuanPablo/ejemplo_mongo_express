'use strict'

// Importamos mongoose para utilizarlo
var mongoose = require('mongoose');

//Creamos un objeto del tipo Schema para configurar modelos
var Schema = mongoose.Schema;

//Creamos el modelo de Album
var AlbumSchema = Schema({
    title: String,
    description: String,
    year: Number,
    image: String,
    //Creamos una relacion al objeto Artist
    artist: {type: Schema.ObjectId, ref: 'Artist'}
});

//Lo exportamos
module.exports = mongoose.model('Album', AlbumSchema);