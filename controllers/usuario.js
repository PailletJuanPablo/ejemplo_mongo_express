"use strict";

//Importamos modelo de usuario y bcrypt para encriptar contraseñas
var User = require("../models/usuario");
var bcrypt = require("bcrypt-nodejs");

// Importamos los modulos para manejar ficheros
var fs = require('fs');
var path = require('path');

//Importamos servicio de JWT
var jwt = require("../services/jwt");
//Funciones que se ejecutaran desde las rutas
function pruebas(req, res) {
  res.status(200).send({
    message: "Testing a controller action"
  });
}

// CREAR USUARIO

let saveUser = (req, res) => {
  var user = new User();
  var params = req.body;

  console.log(params);

  // Tomamos los valores desde los params del body
  user.name = params.name;
  user.surname = params.surname;
  (user.email = params.email), (user.role = "ROLE_USER"), (user.image = "null");

  //Verificamos que la constraseña se haya enviado en request
  if (params.password) {
    // Si se recibio encriptamos contraseña y guardamos datos
    bcrypt.hash(params.password, null, null, (err, hash) => {
      user.password = hash;
      if (user.name != null && user.surname != null && user.email != null) {
        //Si los otros campos no estan vacios, guardamos el user
        user.save((err, userStored) => {
          //Guardamos el usuario y verificamos si existe o no un error
          if (err) {
            //Hubo un error
            res
              .status(500)
              .send({ message: "Hubo un error guardando el user" });
          } else {
            if (!userStored) {
              //No se pudo guardar
              res
                .status(404)
                .send({ message: "Hubo un error guardando el user" });
            } else {
              res.status(200).send({ userStored });
            }
          }
        });
      } else {
        res.status(202).send({ message: "Rellena todos los campos" });
      }
    });
  } else {
    res.status(202).send({ message: "Introduce contraseña" });
  }
};

// LOGUEAR USUARIO

let loginUser = (req, res) => {
  //Recibimos los parametros del body con body-parser
  let params = req.body;

  let email = params.email;
  let password = params.password;

  User.findOne({ email: email.toLowerCase() }, (err, user) => {
    // En primer lugar buscamos si existe un usuario con ese email
    if (err) {
      res.status(500).send({ message: "Error en peticion" });
    } else {
      if (!user) {
        res.status(404).send({ message: "El usuario no existe" });
      } else {
        //Si existe, comprobamos la contraseña
        bcrypt.compare(password, user.password, (err, check) => {
          if (check) {
            // Si el check es correcto, se devuelven los datos del user ahora logueado
            if (params.gethash) {
              // Aqui devolvemos un token de JWT
              res.status(200).send({
                token: jwt.createToken(user)
              });
            } else {
              res.status(200).send({ user });
            }
          } else {
            res
              .status(404)
              .send({ message: "El usuario no ha podido loguearse" });
          }
        });
      }
    }
  });
};

// ACTUALIZAR USUARIO

let updateUser = (req, res) => {
  // req.param se refiere al parametro de url
  var userId = req.params.id;
  // req.body al cuerpo de la petición
  var update = req.body;

  User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
    if (err) {
      res.status(500).send({ message: "No se pudo actualizar el user" });
    } else {
      if (!userUpdated) {
        res.status(404).send("No se pudo actualizar");
      } else {
        res.status(200).send({ user: userUpdated });
      }
    }
  });
};
 
// Actualizar imagen del usuario
let uploadImage = (req, res) => {
  // req.param se refiere al parametro de url
  var userId = req.params.id;
  // definimos el archivo y si no se sube le ponemos nombre no subido
  var filename = "no subido..";

  if (req.files) {
    var filePath = req.files.image.path;
    var file_split = filePath.split("\\");
    var file_name = file_split[2];
    var ext_split = file_name.split(".");
    var file_ext = ext_split[1];

    if (file_ext == "png" || file_ext == "jpg" || file_ext == "gif") {
      User.findByIdAndUpdate(
        userId,
        { image: file_name },
        (err, userUpdated) => {
          if (!userUpdated) {
            res.status(404).send("No se pudo actualizar");
          } else {
            res.status(200).send({ user: userUpdated });
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

let getImageFile = (req,res)=> {
  var imageFile = req.params.imageFile;
var pathFile = './uploads/users/'+imageFile;
  fs.exists(pathFile,(exists)=>{
    if (exists){
      res.sendFile(path.resolve(pathFile))
    }else{
      res.status(404).send("No existe imagen")
    }
  })
}

let getUsers = (req,res)=>{
  User.find({},'name surname email',(err,users)=>{
    if (err){
      return err;
    }else{
      res.status(200).send(users)
    }
  })
}

//Exportamos los métodos en un módulo para poder utilizarlos
module.exports = {
  pruebas,
  saveUser,
  loginUser,
  updateUser,
  uploadImage,
  getImageFile,
  getUsers
};
