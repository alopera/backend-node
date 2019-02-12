// Requires : importación de librerias 

var express = require('express');
var mongoose = require('mongoose');



//Inicializar variables

var app = express();


//Conexión a la base de datos

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (error, res) =>{
    if (error) {
        throw err;
    } else {
        console.log('base de datos: \x1b[32m%s\x1b[0m', 'online');      
    }
});



//Rutas

app.get('/', (req, res, next)=>{
    res.status(404).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    });
});


// Escuchar peticiones

app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});