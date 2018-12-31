'use strict'

//Creamos una instancia de express
var express = require('express');
//Importamos el controlador de usuario
var UserController = require('../controllers/usuario');

//Utilizamos el modulo router de Express
var api = express.Router();
// Importamos el middleware para manejar authenticacion
var md_auth = require ('../middlewares/authenticated')

//Utilizamos multiparty para poder subir archivos
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users' });

// Rutasd de la App
api.get('/probando-controlador', md_auth.ensureAuth , UserController.pruebas);
api.get('/users',UserController.getUsers);
api.post('/register',UserController.saveUser);
api.post('/login',UserController.loginUser);
api.post('/update-user/:id',md_auth.ensureAuth,UserController.updateUser)
api.post('/upload-image-user/:id', [md_auth.ensureAuth,md_upload], UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFile);
// Lo exportamos para usar en app.js
module.exports = api;


