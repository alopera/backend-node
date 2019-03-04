var express = require('express');
var mongoose = require('mongoose');
var Hospital = require('../models/hospital');
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');


var app = express();

app.get('/todo/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda;
    var RegExpHosp = new RegExp(busqueda, 'i');


    Promise.all([
        buscarHospitales(RegExpHosp),
        buscarMedicos(RegExpHosp),
        buscarUsuarios(RegExpHosp)
    ])
        .then(respuestas => {
            return res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });
        })
});

//=======================================================
// Busqueda por colección
//=======================================================

app.get('/coleccion/:tabla/:busqueda', (req, res, next) => {
   
    var tabla = req.params.tabla;
    var terminoBuscado = req.params.busqueda;
    var promesa;

    var regEx = new RegExp(terminoBuscado, 'i');


    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(regEx)

            break;
        case 'medicos':
            promesa = buscarMedicos(regEx)

            break;
        case 'hospitales':
            promesa = buscarHospitales(regEx)
            break;
        default:
        return res.status(400).json({
            ok: true,
            resultado: 'la colección donde está tratando de buscar no existe'
        });
            break;
    }

    promesa.then(( valorEncontrado) => {

        if (valorEncontrado) {
             return res.status(200).json({
                 ok: true,
                 [tabla]: valorEncontrado
             });
        }

        return res.status(200).json({
            ok: true,
            resultado: 'No se encontró ningún valor'
        });
    });
});

function buscarHospitales(regEx) {

    return new Promise((resolve, reject) => {
        Hospital
        .find({ nombre: regEx })
        .populate('usuario')
        .exec((error, hospital) => {
            if (error)
                reject('error buscando el hospital', error);

            if (hospital)
                resolve(hospital);
        });
    }
    );

}

function buscarMedicos(regEx) {

    return new Promise((resolve, reject) => {
        Medico
        .find({ nombre: regEx })
        .populate('hospital', 'nombre')
        .populate('usuario', 'nombre email')
        .exec( (error, medico) => {
            if (error)
                reject('error buscando el medico', error);
            if (medico)
                resolve(medico);
        });
    }
    );

}
function buscarUsuarios(regEx) {

    return new Promise((resolve, reject) => {
        Usuario.find()
            .or([{ 'nombre': regEx }, { 'email': regEx }])
            .exec((error, usuario) => {
                if (error)
                    reject('error buscando', error);
                if (usuario)
                    resolve(usuario);
            });
    }
    );
}

module.exports = app;