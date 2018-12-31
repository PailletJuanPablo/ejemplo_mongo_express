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

// Metodo para obtener listado de artistas

let getArtist = (req, res) => {
  var artistId = req.params.id;

  Artist.findById(artistId, (err, artist) => {
    if (err) {
      res.status(404).send({ message: "Artista no existe" });
    } else {
      if (artist) {
        //PRUEBA: OBtener todos los albumes del artista;
        let albums = Album.find({artist:artistId}).then((albums)=>{

          res.status(200).send({artist,albums});

        })
      } else {
        res.status(404).send({ message: "Artista no existe" });
      }
    }
  });
};

// Metodo para crear un artista

let saveArtist = (req, res) => {
  var artist = new Artist({somedata:true});

  var params = req.body;
  artist.name = params.name;
  artist.description = params.description;
  artist.image = "null";
  artist.other = params.other;
  artist.save((err, artistStored) => {
    if (err) {
      res.status(500).send({ message: "No fué posible guardar el artista" });
    } else {
      if (!artistStored) {
        res.status(404).send({ message: "No fué posible guardar el artista" });
      } else {
        //Lo guardó correctamente
        res.status(200).send({ artist: artistStored });
      }
    }
  });
};

// Obtener listado de todos los artistas y paginarlos
let getArtists = (req, res) => {
  if (req.params.page) {
    var page = req.params.page;
  } else {
    var page = 1;
  }
  var itemsPerPage = 5;

  Artist.find()
    .sort("name")
    .paginate(page, itemsPerPage, (err, artists, total) => {
      if (err) {
        res.status(500).send({ message: "Error en petición" });
      } else {
        // recibimos los datos
        if (!artists) {
          res.status(404).send({ message: "No hay artistas" });
        } else {
          return res.status(200).send({
            artists,
            total_items: total
          });
        }
      }
    });
};

// Metodo para actualizar un artista
let updateArtist = (req, res) => {
  var artistId = req.params.id;
  var updateData = req.body;

  Artist.findByIdAndUpdate(artistId, updateData, (err, updatedArtist) => {
    if (err) {
      res.status(500).send({ message: "Hubo un error actualizando" });
    } else {
      if (!updatedArtist) {
        res.status(404).send({ message: "El artista no existe" });
      } else {
        res.status(200).send({ updatedArtist });
      }
    }
  });
};

// Metodo para eliminar un artista

let deleteArtist = (req, res) => {
  var artistId = req.params.id;

  Artist.findByIdAndRemove(artistId, (err, artistDeleted) => {
    if (err) {
      res.status(500).send({ message: "Hubo un error eliminando" });
    } else {
      if (!artistDeleted) {
        res.status(404).send({ message: "El artista no existe" });
      } else {
        Album.find({ artist: artistDeleted._id }).remove(
          (err, albumsRemoved) => {
            if (err) {
              res.status(500).send({ message: "Error del servidor" });
            } else {
              if (!albumsRemoved) {
                res.status(404).send({ message: "No se encontróe l artista" });
              } else {
                Song.find({ album: albumsRemoved._id }).remove(
                  (err, songRemoved) => {
                    if (err) {
                      res.status(500).send({ message: "Error del servidor" });
                    } else {
                      if (!songRemoved) {
                        res
                          .status(400)
                          .send({ message: "No se pudo eliminar" });
                      } else {
                        res.status(200).send(artistDeleted);
                      }
                    }
                  }
                );
              }
            }
          }
        );
      }
    }
  });
};

let uploadImage = (req, res) => {
  var artistId = req.params.id;
  var fileName = "No subido..";

  if (req.files) {
    var filePath = req.files.image.path;
    var file_split = filePath.split("\\");
    var file_name = file_split[2];
    var ext_split = file_name.split(".");
    var file_ext = ext_split[1];

    if (file_ext == "png" || file_ext == "jpg" || file_ext == "gif") {
      Artist.findByIdAndUpdate(
        artistId,
        { image: file_name },
        (err, artistUpdated) => {
          if (!artistUpdated) {
            res.status(404).send("No se pudo actualizar");
          } else {
            res.status(200).send({ user: artistUpdated });
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

let getImageFile = (req, res) => {
  var imageFile = req.params.imageFile;
  var pathFile = "./uploads/artists/" + imageFile;
  fs.exists(pathFile, exists => {
    if (exists) {
      res.sendFile(path.resolve(pathFile));
    } else {
      res.status(404).send("No existe imagen");
    }
  });
};

module.exports = {
  getArtist,
  saveArtist,
  getArtists,
  updateArtist,
  deleteArtist,
  uploadImage,
  getImageFile
};
