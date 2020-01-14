const express = require('express');
// se necesita el esquema de usuario para utilizar sus propiedades
const Usuario = require('../models/usuario');
/*importaciones necesarias para que funcione le file uploa */
// para borrar los archisvos es necesario utilizar el file system
const Producto = require('../models/producto')

const fs = require('fs')
// necesario para construir las rutas de acceso
const path = require('path')
const fileUpload = require('express-fileupload');
const app = express();
// configuracion file upload
app.use(fileUpload({ useTempFiles: true }));


// iniciando
app.put('/upload/:tipo/:id', function (req, res) {

  // campos necesario para validar tipo y ubicar en carpeta respectiva
  let tipo = req.params.tipo
  let id = req.params.id

  //valida tipo

  const tipos = ['usuarios', 'productos']

  if (tipos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        msj: 'No es un tipo aceptado',
        tipos: tipos.join(', ')
      }
    })
  }


  /*Verifica que si se halla subido algo */
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      err: 'Ninguna imagen enviada'
    })
  }


  /*la terminacion req.files.archivo es el nombre que debe tener el body en este caso es archivo*/
  let archivo = req.files.archivo;


  //*****limita la extensiones permitidas*///  
  let nombreCortado = archivo.name.split('.')
  let extension = nombreCortado[nombreCortado.length - 1];

  const extensiones_permitidas = ['png', 'jpg', 'gif']

  if (extensiones_permitidas.indexOf(extension) < 0) {

    return res.status(400).json({
      ok: false,
      err: {
        msj: 'No es un fromato aceptado',
        extenciones: extensiones_permitidas.join(', ')
      }
    })
  }

  // cambiar el nombre del archivo para que este tenga un nombre unico

  let nombreArchivo = `${id}_${new Date().getMilliseconds()}.${extension}`


  // gurarda el archivo
  //** 1- el tipo define si va a la carpeta de usuarios o a la de productos* */
  archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }


    // aqui la imagen es cargada
    // paso por referencia

    if (tipo == 'usuarios') {
      imagen_Usuario(id, res, nombreArchivo)
    } 
    else if (tipo =='productos') {
      imagen_Producto(id, res, nombreArchivo)
    }
    
    else{
      res.status(400).json({
        ok: false,
        err: {
          msj: 'No es un tipo aceptado',
          tipos: tipos.join(', ')
        }
      })
    }  
  });
});



/*******************
 **Imagen Usuario**
 ********************/
// asigna el id del usuario a la imagen
function imagen_Usuario(id, res, nombreArchivo) {

  Usuario.findById(id, (err, usuarioDB)  => {

    if (err) {
      // aunq se devuelve un error la imagen se guarda por eso se llama este metodo
      borraArchivo(nombreArchivo, 'usuarios');
      return res.status(500).json({
        ok: false,
        err
      })
    }


    if (!usuarioDB) {
      // aunq se devuelve un error la imagen se guarda por eso se llama este metodo
      borraArchivo(nombreArchivo, 'usuarios');
      return res.status(400).json({
        ok: false,
        err: {
          msj: 'Usuario no existe en la base de datos'
        }
      })
    }

    borraArchivo(usuarioDB.img, 'usuarios')

    // asigna la propiedad
    usuarioDB.img = nombreArchivo;

    usuarioDB.save((err,usuarioGuardado)=>{

      if (err) {
        return res.status(500).json({
          ok: false,
          msj: 'problema al guardar usuario'
        })
      }

      res.json({
        ok:true,
        msj: 'usuario guardado correctamente',
        usuario: usuarioGuardado
      })

    })
  })
}

/*******************
 **Imagen producto**
 ********************/ 
function imagen_Producto(id, res, nombreArchivo) {

  Producto.findById(id, (err, productoDB)  => {

    if (err) {
      // aunq se devuelve un error la imagen se guarda por eso se llama este metodo
      borraArchivo(nombreArchivo, 'productos');
      return res.status(500).json({
        ok: false,
        err
      })
    }


    if (!productoDB) {
      // aunq se devuelve un error la imagen se guarda por eso se llama este metodo
      borraArchivo(nombreArchivo, 'productos');
      return res.status(400).json({
        ok: false,
        err: {
          msj: 'Producto no existe en la base de datos'
        }
      })
    }

    borraArchivo(productoDB.img, 'productos')

    // asigna la propiedad
    productoDB.img = nombreArchivo;

    productoDB.save((err,productoGuardado)=>{

      if (err) {
        return res.status(500).json({
          ok: false,
          msj: 'problema al guardar Producto'
        })
      }

      res.json({
        ok:true,
        msj: 'Producto guardado correctamente',
        producto: productoGuardado
      })

    })
  })
}



// borra archivos cuanso se va a sobreescribir la imagen
function borraArchivo( nombreImagen, tipo, ){
 // verifica que la imagen exista por si necesita sobre escribir o borrar
 let pathImagen = path.resolve(__dirname,`../../uploads/${tipo}/${nombreImagen}`)
 // verifica si existe el path asignado  con la funcion existsSync que es sincrona
 if (fs.existsSync(pathImagen)) {
 // si existe lo borra con el metodo unlinkSync que es sincrona
   fs.unlinkSync(pathImagen);
   }

}

//exports
module.exports = app;