var express = require('express');
var Hospital = require('../models/hospital');
var bodyParser = require('body-parser');

var middlewareAutencitacion = require('../middlewares/autenticacion');
var app = express();

const tamanoPagina = 5;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


//============================================
//Crear un nuevo hospital
//============================================

app.post('/', middlewareAutencitacion.verificarToken, (req, res) => {
    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario:req.usuario._id
    })

    hospital.save((error, hospitalGuardado) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error creando el hospital: ',
                errors: error
            });
        }
        res.status(201).json({
            ok: true,
            hospital: hospital
        });
    })
});





//============================================
//Obtener todos los hospitales
//============================================


app.get('/', (req, res) => {

    var paginaSolicitada = Number(req.query.pag) || 0;
    var desde = paginaSolicitada * tamanoPagina;

    Hospital.find({})
    .limit(tamanoPagina)
    .skip(desde)
    .populate('usuario', 'nombre email')
    .exec((error, hospitales) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error interno: ' + error
            });
        }

        if (hospitales) {

            Hospital.count({},(error, conteo)=>{
                res.status(200).json({
                    ok: true,
                    hospitales: hospitales,
                    totalHospitales: conteo
                });
            })
            
        }

    }); 

});



//============================================
//Actualizar un hospital
//============================================

app.put('/:id', middlewareAutencitacion.verificarToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;


    Hospital.findById(id, (error, hospital) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error actualizando el hospital',
                errors: error
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'no existe el hospital que desea actualizar'
            });
        }

        hospital.nombre = body.nombre;
        hospital.img = body.img;
        hospital.usuario = req.usuario._id;

        hospital.save((error, hospitalActualizado) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error actualizando hospital',
                    errors: error
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalActualizado
            });
        })

    });

});


//============================================
//Eliminar un hospital
//============================================


app.delete('/:hospital_Eliminar', middlewareAutencitacion.verificarToken, (req, res) => {

    var idHospital = req.params.hospital_Eliminar;

    Hospital.findByIdAndRemove(idHospital, (error, hospitalEliminado) => {

        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al tratar de eliminar el hospital',
                errors: error
            })
        }

        if (hospitalEliminado) {
            return res.status(200).json({
                ok: true,
                usuario: hospitalEliminado
            })

        } else {
            return res.status(401).json({
                ok: false,
                message: 'No existe el hospital que se quiere eliminar'
            })
        }


    });

})


module.exports = app;