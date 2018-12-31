//Utilizamos ES6
'use strict'

//Cargamos el modulo de MongoDB con mongoose
var mongoose = require('mongoose');

//Cargamos el fichero app creado para utilizarlo en las rutas
var app = require('./app');

//Configuramos el puerto de la Api
var port = process.env.PORT || 3623;

// Especificamos la base hacia donde nos conectaremos
mongoose.connect('mongodb://localhost:27017/curso_mean',  { useNewUrlParser: true },
(err,res)=>{
    if (err) {
        throw err;
    }else{
        console.log("Mongo connection done");

        //Empezamos a escuchar el puert
        app.listen(port,()=>{
            console.log("Server listening on port "+port)
        })
    }
});

