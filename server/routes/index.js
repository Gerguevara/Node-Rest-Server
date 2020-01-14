const express = require('express');
// para indexar las rutas
const app = express();
//inicializa express
app.use(require('./login'))
app.use(require('./usuario'))
app.use(require('./categorias'))
app.use(require('./producto'))
app.use(require('./uploads'))
app.use(require('./imagenes'))


/* este archivo es utilizado para organizar las rutas y es una dependencia de expres*/
module.exports = app