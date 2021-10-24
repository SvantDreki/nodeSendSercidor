const express = require('express');
const conectarBD = require('./config/db');
const cors = require('cors');

//Crear servidor
const app = express();

//Contectar a la base de datos
conectarBD();

//Opciones de cors
const opciones = {
    origin: `${process.env.FRONTEND_URL}`,
    optionsSuccessStatus: 200
}
//Habilitar cors
app.use( cors({ 
    origin: true, 
    optionsSuccessStatus: 200,
    allowedHeaders: 'https://blissful-hopper-3134e9.netlify.app',
    credentials: true

}) );

//Puerto de la app
const port = process.env.PORT || 4000;

//Habilitar leer los valores del body
app.use( express.json() );

//Habilitar carpeta publica
app.use( express.static('uploads') );

// Rutas de la app
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/enlaces', require('./routes/enlaces'));
app.use('/api/archivos', require('./routes/archivos'));

app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
});