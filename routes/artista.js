'use strict';
//Importamos express
var express = require('express');
// Importamos modelo de artistas
var ArtistController = require('../controllers/artista');
// Llamamos al metodo Router de Express para poder utilizar rutas
var api = express.Router();
//Importamos middleware de autenticacion
var md_auth = require('../middlewares/authenticated');
//Importamos modulo para utilizar imagenes
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/artists' });

api.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist);
api.get('/artists/:page?', md_auth.ensureAuth, ArtistController.getArtists);

api.post('/artist', md_auth.ensureAuth, ArtistController.saveArtist);
api.post('/artist/:id', md_auth.ensureAuth, ArtistController.updateArtist);
api.post('/delete-artist/:id', md_auth.ensureAuth, ArtistController.deleteArtist);
api.post('/upload-image-artist/:id', [md_auth.ensureAuth,md_upload], ArtistController.uploadImage);
api.get('/get-image-artist/:imageFile', ArtistController.getImageFile);
module.exports = api;

