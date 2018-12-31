'use strict';
//Importamos express
var express = require('express');
// Importamos modelo de artistas
var AlbumController = require('../controllers/album');
// Llamamos al metodo Router de Express para poder utilizar rutas
var api = express.Router();
//Importamos middleware de autenticacion
var md_auth = require('../middlewares/authenticated');
//Importamos modulo para utilizar imagenes
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/albums' });

api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.get('/albums/:artist?', md_auth.ensureAuth, AlbumController.getAlbums);
api.post('/album/', md_auth.ensureAuth, AlbumController.saveAlbum);
api.post('/update-album/:id',md_auth.ensureAuth,AlbumController.updateAlbum);
api.post('/delete-album/:id',md_auth.ensureAuth,AlbumController.deleteAlbum);
api.post('/upload-image-album/:id', [md_auth.ensureAuth,md_upload], AlbumController.uploadImage);
api.get('/get-image-album/:imageFile', AlbumController.getImageFile);
module.exports = api;