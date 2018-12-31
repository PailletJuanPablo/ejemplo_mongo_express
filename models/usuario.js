'use strict'

// Importamos mongoose para utilizarlo
var mongoose = require('mongoose')

// Creamos un objeto del tipo Schema para configurar modelos
var Schema = mongoose.Schema

// Creamos el modelo
var UserSchema = Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    role: String,
    image: String
})

// Lo exportamos
module.exports = mongoose.model('User', UserSchema)