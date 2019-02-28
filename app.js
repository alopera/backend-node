// Requires : importación de librerias 

var express = require('express');
var mongoose = require('mongoose');



//Inicializar variables

var app = express();

// Importar rutas

var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');


//Conexión a la base de datos

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (error, res) =>{
    if (error) {
        throw err;
    } else {
        console.log('base de datos: \x1b[32m%s\x1b[0m', 'online');      
    }
});

// Rutas


app.use('/', appRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);




// Escuchar peticiones

app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});