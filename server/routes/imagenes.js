const express = require('express');
const fs = require('fs')
const path = require('path')
const app = express();
const {verificaTokenImg} = require('../middlewares/authenticacion')
// iniciando


app.get('/imagenes/:tipo/:img',verificaTokenImg, (req, res) => {

    let tipo = req.params.tipo
    let img = req.params.img
    
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`)
    const noImgPath = path.resolve(__dirname, '../assets/no-image.jpg')


    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen)
    } else {
        res.sendFile(noImgPath)
    }
});




//exports
module.exports = app;