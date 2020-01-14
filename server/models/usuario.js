const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const path = require('path')
// unique validator escanea la base de datos y verifica que un campo sea unico en este caso el email

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
};


let Schema = mongoose.Schema;


let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true, // indica que el campo debe ser unico
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
   
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    img: {
        type: String,
        required: false,
        default: `Sin imagen`
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});


usuarioSchema.methods.toJSON = function() {
// edita las propiedades del objeto para que no devuelva password siempre que sevuelva como JSON
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
 
    let pathImagen = path.resolve(__dirname,`/imagenes/usuarios/${userObject.img}`)
    userObject.img = pathImagen
    return userObject;
}


usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });
/*iindica que campos deben ser unicos, de forma mas amigable que por defecto*/

module.exports = mongoose.model('Usuario', usuarioSchema);