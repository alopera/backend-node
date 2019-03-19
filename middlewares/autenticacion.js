var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;


// ==========================================
//  Verificar token
// ==========================================
exports.verificaToken = function (req, res, next) {

    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        next();


    });

}
// ==========================================
//  Verificar rol admin
// ==========================================
exports.verificarAdminOmismoUsuario = function (req, res, next) {

    var rol = req.usuario.role;
    if (rol === 'ADMIN_ROLE' || req.params.id === req.usuario._id) {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'no tiene permisos para realizar esta acción',
            errors: { message: 'no es usuario Administrador' }
        })
    }

}