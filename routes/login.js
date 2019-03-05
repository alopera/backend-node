var express = require('express');
var Usuario = require('../models/usuario');
var bodyParser = require('body-parser');
var bCryptjs = require('bcryptjs');
var jwt = require('jsonwebtoken');
var CONFIG = require('../config/config');
var SEED = CONFIG.SEED;

//GOOGLE

const CLIENT_ID = CONFIG.GOOGLE_CLIENTID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


//=============================================================================================
// AUTENTICACIÓN COMÚN
//=============================================================================================

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
        }, SEED, { expiresIn: 14400 });

        return res.status(200).json({
            ok: true,
            token: token,
            id: usuarioLogueandose._id,
        });
    })
})


//=============================================================================================
// AUTENTICACIÓN CON GOOGLE SIGN IN
//=============================================================================================

app.post('/google', async (req, res) => {
    const googleToken = req.body.token;
    const googleUser = await verify(googleToken).catch(error => {
        return res.status(403).json({
            ok: false,
            mensaje: 'Token no válido',
            errors: error
        });
    });

    Usuario.find({ email: googleUser.email }, (error, usuarioEncontrado) => {
        if (usuarioEncontrado) {
            if (!usuarioEncontrado.googleAuth) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Debe usar la autenticación común'
                });
            } else {
                usuarioEncontrado.password = ':)';
                var token = jwt.sign({
                    usuario: usuarioEncontrado,
                    horaServidorGeneracionToken: new Date()
                }, SEED, { expiresIn: 14400 });

                return res.status(200).json({
                    ok: true,
                    token: token,
                    id: usuarioEncontrado._id,
                });
            }
        }else{
            var nuevoUsuario = new Usuario({
                nombre : googleUser.nombre,
                email : googleUser.email,
                password : googleUser.img,
                password : ':)',
                googleAuth : true,
            });

            nuevoUsuario.save((error, usuarioGuardado) => {
                if (error) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error creando usuario: ',
                        errors: error
                    });
                }
                var token = jwt.sign({
                    usuario: usuarioGuardado,
                    horaServidorGeneracionToken: new Date()
                }, SEED, { expiresIn: 14400 });

                return res.status(200).json({
                    ok: true,
                    token: token,
                    id: usuarioGuardado._id,
                });
        
        
            });
        }
    });





    return res.status(200).json({
        ok: true,
        googleUser: googleUser
    });
});

async function verify(googleToken) {
    const ticket = await client.verifyIdToken({
        idToken: googleToken,
        requiredAudience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    }).catch(error => {
        console.log('error---->', error);
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.nombre,
        email: payload.email,
        img: payload.picture,
        google: true,
    }
}

module.exports = app;