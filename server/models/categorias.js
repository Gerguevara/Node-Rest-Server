const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;


let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripcion de la categoia es necesaria']
    },
    /* hace referencia al esquema usuario, Usuario es el nombre con que se importo el eschema */
    usuario: { type: Schema.Types.ObjectId,
                ref: 'Usuario' 
            }       
    
})
categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });
module.exports = mongoose.model('Categoria', categoriaSchema );