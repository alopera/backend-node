var express = require('express');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');
var Usuario = require('../models/usuario');
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var middlewareAutencitacion = require('../middlewares/autenticacion');
var app = express();
app.use(fileUpload());



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.put('/:tipo/:id', function (req, res) {

    var tipo = req.params.tipo;
    var id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'no seleccionó archivos para subir'
        });
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    var imagen = req.files.imagen;

    var nombreArchivoPartido = imagen.name.split('.');
    var extensionArchivo = nombreArchivoPartido[nombreArchivoPartido.length - 1];

    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'la extensión del archivo no es válida',
            errors: { mensage: 'las extensiones válidas son : png, jpg, gif, jpeg' }
        });
    }

    // Cambio de nombre de archivo

    var nombreArchivoFinal = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    // mover el archivo a un path del server
    var path = `./uploads/${tipo}/${nombreArchivoFinal}`

    imagen.mv(path, function (err) {
        if (err)
            return res.status(500).send(err);

        guardarImagenPortipo(nombreArchivoFinal, res, tipo, id);
    });
});


function guardarImagenPortipo(nombreArchivo, res, tipo, id) {

    switch (tipo) {
        case 'medicos':
            Medico.findById(id, (err, medico) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error Actualizando la imagen en el medico',
                        errors: { mensage: 'Error Actualizando la imagen en el medico' }
                    });
                }
                
                // si ya existe una imagen la elimina
                const pathAnterior = './uploads/medicos/' + medico.img;
                if (fs.existsSync(pathAnterior)) {
                    fs.unlinkSync(pathAnterior);
                }

                medico.img = nombreArchivo;
                medico.save((err, medicoActualizado) => {
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'La imagen del médico fue actualizada correctamente',
                        imagen: medico.img
                    });
                })


            });
            break;
        case 'usuarios':


            Usuario.findById(id, (err, usuario) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error Actualizando la imagen del usuario',
                        errors: { mensage: 'Error Actualizando la imagen del usuario' }
                    });
                }

                // si ya existe una imagen la elimina
                const pathAnterior = './uploads/usuarios/' + usuario.img;
                if (fs.existsSync(pathAnterior)) {
                    fs.unlink(pathAnterior);
                }

                usuario.img = nombreArchivo;
                usuario.save((err, usuarioActualizado) => {
                    return res.status(200).json({
                        ok: false,
                        mensaje: 'La imagen del usuario fue actualizada correctamente',
                        errors: { mensage: 'La imagen del usuario fue actualizada correctamente' }
                    });
                })


            });
            break;
        case 'hospitales':
            Hospital.findById(id, (err, hospital) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error Actualizando la imagen del hospital',
                        errors: { mensage: 'Error Actualizando la imagen del hospital' }
                    });
                }

                // si ya existe una imagen la elimina
                const pathAnterior = './uploads/hospitales/' + hospital.img;
                if (fs.existsSync(pathAnterior)) {
                    fs.unlink(pathAnterior);
                }
                hospital.img = nombreArchivo;
                hospital.save((err, hospitalActualizado) => {
                    return res.status(200).json({
                        ok: false,
                        mensaje: 'La imagen del hospital fue actualizada correctamente',
                        errors: { mensage: 'La imagen del hospital fue actualizada correctamente' }
                    });
                })


            });

            break;

        default:
            break;
    }


}



module.exports = app;


