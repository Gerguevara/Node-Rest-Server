/* =================
 =PORT ENVAROMENT=
================*/
process.env.PORT = process.env.PORT || 3000;


/*============
=enviromente=
============*/
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
/*verifica si existe el process.env.NODE_ENV que se habilita cuando la app esta desplegada
en un servidor, si este no existe se le asigna el valor de "dev*/

/*===================
==Fecha vencimmiento
====================*/
process.env.CADUCIDAD_TOKEN = '48h'
/* se crea una variable para la fecha de caducidad del token ya con valor espesifico y publico*/


/*==========
 TOKEN SEED
===========*/

process.env.SEED_TOKEN  =  process.env.SEED_TOKEN  ||'Este-es-el-secret de desarrollo'


/*===============
==google client==
===============*/

process.env.CLIENT_ID = process.env.CLIENT_ID || '98930848058-gebrv0dv1rhjrfendbcppsupitqnrnvg.apps.googleusercontent.com'



/*============
==Data Base==
============*/
let urlDB;

if (process.env.NODE_ENV==='dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.MONGO_URI
    // variable del envarioment agregada por Heroku
}

process.env.urlDB = urlDB;