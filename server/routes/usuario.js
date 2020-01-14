//requires
const express = require('express');
//  pasa la contraseña por encriptacion antes de llegar a la base de datos
const bcrypt = require('bcrypt');
const _ = require('underscore');
// para utilizar el metodo pick
const Usuario = require('../models/usuario');

const {verificarToken, verificarRole } = require('../middlewares/authenticacion')
/*importacion por medio de depstrupturacion , significa que extrae directamente la funcion*/

const app = express();



// *****CRUD  ******//

// GET is mostly used to fetch data, it's by default used on browsers
app.get('/usuario', verificarToken, (req, res) => {
// agregando el midleware
    let desde = req.query.desde || 0; //req.query.xx indica que el parametro puede venir o no y si no se pone a 0
    desde = Number(desde);
    // hace un parse para recibir el parametro
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({}, 'nombre email role estado google img')
    // aca entre corchetes recibe el parametro de filtro
    // el segundo parametro declara lo que devolvera limitando asi la informacion
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => { // .excet ejecuta la funcion o el query
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.count({}, (err, conteo) => {
// metrodo para contar en este caso amvuelve el objetro que  recibe a este se le pude poner una condicion {}
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });

            });
        });
    });

// solo usuarios activos 
app.get('/usuario/activos',verificarToken, function(req, res) {
    Usuario.find({estado : true}, 'nombre email role estado')
          .exec((err, usuarios) => { // .excet ejecuta la funcion o el query
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.count({estado : true}, (err, conteo) => {
// metrodo para contar en este caso amvuelve el objetro que  recibe a este se le pude poner una condicion {}
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });

            });
        });
    });



// POST is mostly used to create new data
app.post('/usuario',[verificarToken , verificarRole ], function (req, res) {
    let body = req.body; // gracias al body parser

     /* De esta forma se accede a todos los campos creados por el el modelo*/
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        // encripta el resultado a la base de datos
        role: body.role})

   /*guardando en la base de datos, se utiliza un callback*/          
   usuario.save((err, UsuarioDB)=>{
   /* de existir un error entra en if, este usa un return para acortar codigo
   y utilizar un else */
   
    if (err) {
      return  res.status(400).json(
          {
            ok: false,
            err
          });        
        }

     /** si no entra en el if devuelve el objeto creado */       
    res.json({
        ok: true,
        usuario: UsuarioDB
    });
   });
})
  


// PUT is mostly used to update data
app.put('/usuario/:id', [verificarToken, verificarRole ], function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    /* pick es un metodo del UNDERSCORE*/

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query'  }, (err, usuarioDB) => {
        /* metodo  brindado por mongoose*/
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })
});



// Casi no utilizado, mayormente se usa un PUT */
app.delete('/usuario/fisico/:id', [verificarToken, verificarRole ] , function (req, res) {
    let id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=>{
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });                
            }

            if (!usuarioBorrado) {
                return res.status(400).json({
                    ok: false,
                    err: 'usuario no existe en la base de datos'
                }); 
            }

            res.json({
                ok: true,
                usuario: usuarioBorrado
            });
    })    
})

app.delete('/usuario/:id',[verificarToken, verificarRole ], function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['estado']);
    Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usuarioDB) => {
   // aplicando las misma funcion que el PUT pero quitando el parametro de validator
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })
});




// exports
module.exports = app ;
// al ser una exportacion unica no necesita ser instaciada