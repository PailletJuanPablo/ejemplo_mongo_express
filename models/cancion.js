'use strict'

// Importamos mongoose para utilizarlo
var mongoose = require('mongoose');

//Creamos un objeto del tipo Schema para configurar modelos
var Schema = mongoose.Schema;

//Creamos el modelo de Artista
var SongSchema = Schema({
    number: Number,
    name: String,
    duration: String,
    file: String,
    //Creamos una relacion al objeto Album
    album: {type: Schema.ObjectId, ref: 'Album'}
});

//Lo exportamos
module.exports = mongoose.model('Song', SongSchema);