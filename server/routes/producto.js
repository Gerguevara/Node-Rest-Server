const express = require('express')
const {verificarToken} = require('../middlewares/authenticacion')
const app = express();
let Producto = require('../models/producto')


//optener un producto
app.get('/producto/:id', verificarToken, (req, res) => {
    
    let id = req.params.id

    Producto.find({_id : id})
        .populate('categoria', 'descripcion')
        .populate('usuario', 'email')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productoDB
            });

        })
});


// obtener todos los productos
app.get('/producto', verificarToken, (req, res) => {

    let desde = req.query.desde || 0; //req.query.xx indica que el parametro puede venir o no y si no se pone a 0
    desde = Number(desde);
    // hace un parse para recibir el parametro
    let limite = req.query.limite || 5;
    limite = Number(limite);



    Producto.find({disponible:true})
        .skip(desde)
        .limit(limite)
        .sort('descripcion')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productoDB
            });

        })
});



app.get('/producto/buscar/:termino', verificarToken, (req, res) => {

    let termino = req.params.termino;
    // se crea una expresion regular para el termino y se pasa como aprametro de busqueda
    let regex = new RegExp(termino, 'i')

    Producto.find({nombre:regex})
        .sort('descripcion')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productoDB
            });

        })
});


// crear un nuevo producto
app.post('/producto', verificarToken, (req, res) => {
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id 
    });


    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!producto) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });
});


// edita un producto

app.put('/producto/:id', verificarToken, (req, res) => {

    let id = req.params.id;
    let body = req.body

    let descProducto = {
        
        precioUni: body.precioUni,
        disponible: body.disponible
    }

    // parametros: id, objeto a actualizar
    Producto.findByIdAndUpdate(id, descProducto, { new: true, runValidator: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});


module.exports = app ;