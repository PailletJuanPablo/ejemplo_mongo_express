'use strict';
//Importamos express
var express = require('express');
// Importamos modelo de artistas
var SongController = require('../controllers/cancion');
// Llamamos al metodo Router de Express para poder utilizar rutas
var api = express.Router();
//Importamos middleware de autenticacion
var md_auth = require('../middlewares/authenticated');
//Importamos modulo para utilizar imagenes
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/songs',autoFields :true });

api.get('/song/:id', md_auth.ensureAuth, SongController.getSong);
api.get('/songs/:page?', md_auth.ensureAuth, SongController.getSongs);

api.post('/song', md_auth.ensureAuth, SongController.saveSong);
api.post('/song/:id', md_auth.ensureAuth, SongController.updateSong);
api.post('/delete-song/:id', md_auth.ensureAuth, SongController.deleteSong);
api.post('/upload-song/:id', [md_auth.ensureAuth,md_upload], SongController.uploadAudio);
api.get('/get-audio/:audioFile', SongController.getAudioFile);
module.exports = api;

