// Requires : importación de librerias 

var express = require('express');
var mongoose = require('mongoose');



//Inicializar variables

var app = express();

// Importar rutas

var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var loginRoutes = require('./routes/login');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenRoutes = require('./routes/imagenes');


//Conexión a la base de datos

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (error, res) =>{
    if (error) {
        throw err;
    } else {
        console.log('base de datos: \x1b[32m%s\x1b[0m', 'online');      
    }
});

//Server index config

// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'))
// app.use('/uploads', serveIndex(__dirname + '/uploads'));


// Rutas
app.use('/', appRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/imagen', imagenRoutes);

// Escuchar peticiones

app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});