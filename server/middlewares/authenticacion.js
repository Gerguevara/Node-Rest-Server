const jwt = require('jsonwebtoken');
/* se utilizara un metodo propio de espe parque lamado veryfy para verificar el token*/


/*==============
verificar token
================*/

let verificarToken = (req, res, next) => {

    let token = req.get('token')
  
    jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {
        /* esta funcion recibe 3 parametros de verificacion 1 el token, 2 el SEED y 3 el callback */

        if (err) {
            return res.status(401).json({
                ok: false,
                err: "token invalido"

            });
        }


        req.usuario = decoded.usuario;
        next();
        /* el next ejecuta la siguiente peticion luego de haber pasado el middleware*/
    })
}



/*==============
verificar Role
================*/


let verificarRole = (req, res, next) => {

    let usuario = req.usuario
    /* toma este parametro de midleware pasado anteriormente para extraer el role y verificar*/


    if (usuario.role === 'ADMIN_ROLE') {

        next();
    }
    else {
        res.json({
            ok: false,
            err: 'El usuario no es administrador'
        })
    }
}

/*=================
verificar toke Img
===================*/



let verificaTokenImg = (req, res, next) => {

    let token = req.query.token

    jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: "token invalido"

            });
        }


        req.usuario = decoded.usuario;
        next();

    })
}




// exports
module.exports = { verificarToken, verificarRole,verificaTokenImg }