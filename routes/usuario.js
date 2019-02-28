var express = require('express');
var Usuario = require('../models/usuario');
var bodyParser = require('body-parser');
var bCryptjs = require('bcryptjs');

var middlewareAutencitacion = require('../middlewares/autenticacion');
var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


//============================================
//Crear un nuevo usuario
//============================================

app.post('/', (req, res) => {
    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bCryptjs.hashSync(body.password, 10),
        img: body.img,
        rol: body.rol
    })

    usuario.save((error, usuarioGuardado) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error creando usuario: ',
                errors: error
            });
        }

        res.status(201).json({
            ok: true,
            usuarios: usuarioGuardado
        });


    })


});





//============================================
//Obtener todos los usuarios
//============================================


app.get('/', middlewareAutencitacion.verificarToken, (req, res, next) => {

    Usuario.find({}, 'nombre email img rol').exec((error, usuario) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error interno: ' + error
            });
        }

        if (usuario) {
            res.status(200).json({
                ok: true,
                usuarios: usuario,
                infoToken: req.tokenPayLoad
            });
        }

    })

});



//============================================
//Actualizar un usuario
//============================================

app.put('/:id', middlewareAutencitacion.verificarToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;


    Usuario.findById(id, (error, usuario) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error buscando el usuario',
                errors: error
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'no existe el usuario'
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.rol = body.rol;

        usuario.save((error, usuarioActualizado) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error actualizando usuario',
                    errors: error
                });
            }

            res.status(200).json({
                ok: true,
                usuarios: usuarioActualizado
            });
        })

    });

});


//============================================
//Eliminar un Usuario
//============================================


app.delete('/:usuario_eliminar', middlewareAutencitacion.verificarToken, (req, res) => {

    var idUsuario = req.params.usuario_eliminar;

    Usuario.findByIdAndRemove(idUsuario, (error, usuarioEliminado) => {

        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar usuario',
                errors: error
            })
        }

        if (usuarioEliminado) {
            return res.status(200).json({
                ok: true,
                usuario: usuarioEliminado
            })

        } else {
            return res.status(401).json({
                ok: false,
                message: 'No existe el usuario que se quiere eliminar'
            })
        }


    });

})


module.exports = app;