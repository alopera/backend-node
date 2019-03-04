var express = require('express');
var app = express();
const path = require('path');
var fs = require('fs');


//Rutas

app.get('/:tipo/:img', (req, res, next)=>{

    const coleccion = req.params.tipo;
    const imagen = req.params.img;

    const pathImagen = path.resolve(__dirname, `../uploads/${coleccion}/${imagen}`);
    if (fs.existsSync(pathImagen)){
       res.sendFile(pathImagen); 
    }else{
        const pathNoImagen = path.resolve(__dirname, `../assets/no-img.jpg`);
       res.sendFile(pathNoImagen);
    }
    
});

module.exports = app;