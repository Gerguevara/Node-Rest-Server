//config 
require('./config/config');
// base de datos
mongoose = require('mongoose');
//express server
const express = require('express')
const app = express()
// *****bodyParser complemento de expres para tratar datos*****/´

const path = require('path')
/*usado para configurar rutas extrañas, en este caso para el googl signin */
const bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
//complemento de express
app.use(express.static(path.resolve(__dirname,'public')));

// importeng routes from usuario
app.use(require('./routes/index'))


// conecting to  mongodb
mongoose.connect(process.env.urlDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
},
    (err, res) => {
        if (err){ 
            return console.log('Problema al conectarse a la base de datos',err)           
        }
        else {
            console.log('Base de datos ONLINE');
        }       
    });

// simple status alert
app.listen(process.env.PORT, () => {
    console.log(`Working on port ${process.env.PORT}`);
}
)