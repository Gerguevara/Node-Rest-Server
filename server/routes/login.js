//requires
const express = require('express');
//  esta ruta tambien necesita utilizar express
const bcrypt = require('bcrypt');
// el bcryp posse metodos para hacer la comprobacion del password

// dependencia para verificar el login con google
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const jwt = require('jsonwebtoken');
// dependencia que se utiliza para crear el token
const Usuario = require('../models/usuario');
//utilizado para optener informaciondel usuario alamacendo
const app = express();
//inicializa express

/*===================
===Trabajando la ruta
==================== */

app.post('/login', (req, res) => {
    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {

            return res.json({
                ok: false,
                mensaje: '(usuario )con password invalido'

            })
        }

        /* contrasando el password con un metodo el bcrypt*/
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.json({
                ok: false,
                mensaje: 'usuario con (password )invalido'
                /* esta funcion hace una comparcion de la contrasena enviada y la alamacenada 
                retorna un true o un false si hay matcha, el primer parametro debe ser la enviada
                y el segundo la alamaenada, recorcardar que hace una encriptacion para la comparacion*/
            })
        }

        let token = jwt.sign({
            usuario: usuarioDB
            /*Es es el paylo que es basicamente lo que se envia en el token*/
        }, process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN });
        /*Expires in es 60 segundos por 60 minutos*/



        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })
    })
})




/* verifica el  logeo con google y se apoya de la libreria de google para hacerlo*/
/*=======================
  verificaciones google
 ========================*/

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true

    }

}


/*================
Ruta login google
==================*/

app.post('/google', async (req, res) => {

    let token = req.body.idtoken
    let googleUser
    
        try{
            googleUser = await verify(token)//veryfy() funcion declarada arriba que conbase a promesas verifica el token de google        

        }  
    
        catch(err) {
            // por si el token es invalido
            return res.status(403).json({
                ok: false,
                error: err
            })
    }
    /*verificando si no existe ya el email*/

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (usuarioDB) {

            // porsi si no se a registrado con google pero intenta login con google
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'utilice su autenticacion normal'
                })
            }

            /*si se registro con google he intenta loggin con google
            entonces creo mipropio token o se lo renuevo y envio*/
            else {

                let token = jwt.sign({
                    usuario: usuarioDB
                    /*Es es el paylo que es basicamente lo que se envia en el token*/
                }, process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN });
                /*Expires in es 60 segundos por 60 minutos*/

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                }) 
            }


                    
        }

        // si el usuario no existe en la BD y va a registrarse
        else {
            let usuario = new Usuario();
        // igualando propiedades            
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true
            usuario.password = ':)'
            /* con la modificacion del modelo password no retorna*/


        // guardando en la BD
        
        usuario.save((err, usuarioDB)=>{
            
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

        // crea el nuevo token    
            let token = jwt.sign({
                usuario: usuarioDB
                /*Es es el paylo que es basicamente lo que se envia en el token*/
            }, process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN });
            /*Expires in es 60 segundos por 60 minutos*/

           return res.json({
                ok: true,
                usuario: usuarioDB,
                token
            })
        })
        }

    })

})

/*==========
=Exportando=
============*/
module.exports = app;