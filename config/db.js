const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });

const conectarBD = async () => {
    try {
        await mongoose.connect( process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } );

        console.log('DB Conectada');
    } catch (error) {
        console.log('Hubo un error');
        console.log(error);
        //para detener una aplicacion de node
        process.exit(1);

    }
}

module.exports = conectarBD;