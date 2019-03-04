var express = require('express');
var Medico = require('../models/medico');
var bodyParser = require('body-parser');

var middlewareAutencitacion = require('../middlewares/autenticacion');
var app = express();
const tamanoPagina = 5;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


//============================================
//Crear un nuevo medico
//============================================

app.post('/', middlewareAutencitacion.verificarToken, (req, res) => {
    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id,
        hospital: body.hospitalId
    })

    medico.save((error, medicoGuardado) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error creando el médico: ',
                errors: error
            });
        }
        res.status(201).json({
            ok: true,
            medico: medicoGuardado
        });
    })
});

//============================================
//Obtener todos los médicos
//============================================


app.get('/', (req, res) => {

    var paginaSolicitada = req.query.pag || 0; 
    var desde = paginaSolicitada * tamanoPagina; 
    
    Medico.find({})
        .skip(desde)
        .limit(tamanoPagina)
        .populate('usuario', 'nombre email')
        .populate('hospital', 'nombre')
        .exec((error, medicos) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error interno: ' + error
                });
            }

            if (medicos) {
              Medico.count({}, (error, conteo) =>{
                res.status(200).json({
                    ok: true,
                    medicos: medicos,
                    totalMedicos: conteo
                });
              });
            }
        });
});

//============================================
//Actualizar un médico
//============================================

app.put('/:id', middlewareAutencitacion.verificarToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;


    Medico.findById(id, (error, medico) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error actualizando el médico',
                errors: error
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'no existe el médico que desea actualizar'
            });
        }

        medico.nombre = body.nombre;
        medico.img = body.img;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospitalId;

        medico.save((error, medicolActualizado) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error actualizando el médico',
                    errors: error
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicolActualizado
            });
        })

    });

});


//============================================
//Eliminar un medico
//============================================


app.delete('/:medico_Eliminar', middlewareAutencitacion.verificarToken, (req, res) => {

    var idMedico = req.params.medico_Eliminar;



    Medico.findByIdAndRemove(idMedico, (error, medicoEliminado) => {

        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al tratar de eliminar el medico',
                errors: error
            })
        }

        if (medicoEliminado) {
            return res.status(200).json({
                ok: true,
                usuario: medicoEliminado
            })

        } else {
            return res.status(401).json({
                ok: false,
                message: 'No existe el medico que quiere eliminar'
            })
        }
    });

})


module.exports = app;