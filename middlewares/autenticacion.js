var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;



//============================================
//Validar token
//============================================
exports.verificarToken = function(req, res, next){
    var token = req.query.token;
    jwt.verify(token, SEED, (error, decoded) => {
        if (error) {
            return res.status(401).json({
                ok: false,
                mensaje: 'El token no es válido',
                errors: error
            });
        }
        req.usuario = decoded.usuario;
        next();
    })
};

