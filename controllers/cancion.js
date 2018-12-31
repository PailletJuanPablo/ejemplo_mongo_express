// Controlador para manejar los artistas

"use strict";

var path = require("path");
var fs = require("fs");

//Importamos los modelos Mongoose para poder acceder a sus metodos

var Artist = require("../models/artista");
var Album = require("../models/album");
var Song = require("../models/cancion");

//Importamos modulo de paginacion (Mongoose Paginate)
var mongoosePaginate = require("mongoose-pagination");

let getSong = (req, res) => {
  var songId = req.params.id;

  Song.findById(songId)
    // COn populate devolvemos el artista del album
    .populate({ path: "album" })
    // Con exec ejecutamos la query
    .exec((err, song) => {
      if (err) {
        res.status(404).send("Err del server");
      } else {
        if (!song) {
          res.status(404).send("No existe el album");
        } else {
          res.status(200).send(song);
        }
      }
    });
};

// metodo para guardar un album

let saveSong = (req, res) => {
  var song = new Song();
  var params = req.body;

  song.name = params.name;
  song.number = params.number;
  song.duration = params.duration;
  song.file = "null";
  song.album = params.album;

  song.save(song, (err, song) => {
    if (err) {
      res.status(404).send("No se pudo guardar");
    } else {
      res.status(200).send(song);
    }
  });
};

// Metodo para obtener todos los albums

let getSongs = (req, res) => {
  var albumId = req.params.album;
  if (!albumId) {
    // Sacar todos los albumes sin importar artista
    var find = Song.find({}).sort("title");
  } else {
    // Sacar solo los albumes de ese artista
    var find = Song.find({ album: albumId });
  }

  // Le indicamos en que propiedad de se hara el populate
  find.populate({ path: "album" }).exec((err, albums) => {
    if (err) {
      res.status(500).send("Server error");
    } else {
      if (!albums) {
        res.status(404).send("No hay albums");
      } else {
        res.status(200).send(albums);
      }
    }
  });
};

// Metodo para actualizar un album
let updateSong = (req, res) => {
  var songId = req.params.id;
  var updateData = req.body;

  Song.findByIdAndUpdate(songId, updateData, (err, updatedSong) => {
    if (err) {
      res.status(500).send({ message: "Hubo un error actualizando" });
    } else {
      if (!updatedSong) {
        res.status(404).send({ message: "La cancion no existe" });
      } else {
        res.status(200).send({ updatedSong });
      }
    }
  });
};

// Metodo para eliminar un album

let deleteSong = (req, res) => {
  var songId = req.params.id;
  Song.findByIdAndRemove(songId).remove((err, songRemoved) => {
    if (err) {
      res.status(500).send({ message: "Error del servidor" });
    } else {
      if (!songRemoved) {
        res.status(404).send({ message: "No se encontróe el artista" });
      } else {
        res.status(200).send({message:songRemoved})
      }
    }
  });
};

let uploadAudio = (req, res) => {
    var songId = req.params.id;
    var fileName = "No subido..";
  
    if (req.files) {
      var filePath = req.files.image.path;
      var file_split = filePath.split("\\");
      var file_name = file_split[2];
      var ext_split = file_name.split(".");
      var file_ext = ext_split[1];
  
      if (true) {
        Song.findByIdAndUpdate(
            songId,
          { file: file_name },
          (err, songUpdated) => {
            if (!songUpdated) {
              res.status(404).send("No se pudo actualizar");
            } else {
              res.status(200).send({ song: songUpdated });
            }
          }
        );
      } else {
        res.status(404).send("No hay un archivo correcto");
      }
    } else {
      res.status(200).send("No has subido ninugna imagen");
    }
  };
  
  // Obtener archivo de imagen (ruta completa)
  
  let getAudioFile = (req, res) => {
    var audioFile = req.params.audioFile;
    var pathFile = "./uploads/songs/" + audioFile;
    fs.exists(pathFile, exists => {
      if (exists) {
        res.sendFile(path.resolve(pathFile));
      } else {
        res.status(404).send("No existe imagen");
      }
    });
  };




module.exports = {
  getSong,
  saveSong,
  getSongs,
  updateSong,
  deleteSong,
  uploadAudio,
  getAudioFile
};
