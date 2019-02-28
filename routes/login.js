var express = require('express');
var Usuario = require('../models/usuario');
var bodyParser = require('body-parser');
var bCryptjs = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.post('/', (req, res) => {

    var credenciales = req.body;

    Usuario.findOne({ email: credenciales.usuario }, (error, usuarioLogueandose) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                errors: error
            });
        }

        if (!usuarioLogueandose || !bCryptjs.compareSync(credenciales.password, usuarioLogueandose.password)) {
            return res.status(404).json({
                ok: false,
                message: 'Usuario y/o contraseña inválida'
            });
        }

        usuarioLogueandose.password = ':)';
        var token = jwt.sign({
            usuario: usuarioLogueandose,
            horaServidorGeneracionToken: new Date()
        }, SEED, {expiresIn: 14400} );
        
        return res.status(200).json({
            ok: true,
            token: token,
            id: usuarioLogueandose._id,
        });
    })




})




module.exports = app;