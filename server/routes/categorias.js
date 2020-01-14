const express = require('express');
let { verificarToken, verificarRole } = require('../middlewares/authenticacion')
let app = express();
let Categoria = require('../models/categorias')



// devuelve todas las categorias
app.get('/categoria', verificarToken, (req, res) => {

    Categoria.find({})
    //ayuda a ordenar todo el resultado segun el parametro
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });

        })
});

//devuelve una catroria
app.get('/categorias/:id', verificarToken, (req, res) => {

    let id = req.params.id
    Categoria.findByIdAndUpdate(id, {})
        .exec((err, categoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!categoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        msg: 'id de categoria no encontrado'
                    }
                });
            }

            res.json({
                ok: true,
                categoria: categoriaDB
            });

        })


});


//crear categoria 
app.post('/categoria', verificarToken, (req, res) => {
    // regresa la nueva categoria
    // req.usuario._id
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id // por alguna razon es _id
    });


    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });


    });


});


//crear categoria
app.put('/categoria/:id', verificarToken, (req, res) => {

    let id = req.params.id;

    let body = req.body

    let descCategoria = {
        descripcion: body.descripcion
    }

    // parametros: id, objeto a actualizar
    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidator: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB || categoriaDB === null) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// solo un usuaria administrador puede borrar una categoria
app.delete(('/categoria/:id'), [verificarToken, verificarRole], (req, res) => {

    let id = req.params.id

    Categoria.findByIdAndDelete(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB || categoriaDB === null) {
            return res.status(400).json({
                ok: false,
                message: 'No es un id valido'
            });
        }

        res.json({
            ok: true,
            Mensaje: 'La categoria fue eliminada'
        });
    });
});



module.exports = app