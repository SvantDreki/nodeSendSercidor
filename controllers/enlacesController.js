const Enlaces = require('../models/Enlaces');
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.nuevoEnlace = async (req, res, next) => {
    //Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()});
    }

    //Crear el objeto enlace
    const { nombreOriginal, nombre } = req.body;
    const enlace = new Enlaces();
    enlace.url = shortid.generate();
    enlace.nombre = nombre;
    enlace.nombreOriginal = nombreOriginal;

    //Si el usuario esta autenticado
    if(req.usuario) {
        const { password, descargas } = req.body;

        //Asignar numero de descargas
        if(descargas) {
            enlace.descargas = descargas;
        }

        //Asignar password
        if(password) {
            const salt = await bcrypt.genSalt(10);
            enlace.password = await bcrypt.hash(password, salt);
        }

        enlace.autor = req.usuario.id;
    }

    //almecenar en la BD
    try {
        await enlace.save();
        return res.json({ msg: `${enlace.url}` });
        next();
    } catch (error) {
        console.log(error);
    }
}

exports.obtenerEnlace = async (req, res, next) => {

    const { url } = req.params;

    //Verificar que el enlace exista
    const enlace = await Enlaces.findOne({ url });
    
    if(!enlace) {
        res.status(404).json({ msg: 'Ese enlace no existe' });
        return next();
    }

    //Si el enlace existe
    res.json({ archivo: enlace.nombre, password: false });

    next();
    
}

//Obtiene todos los enlaces
exports.todosEnlaces = async (req, res) => {
    try {
        const enlaces = await Enlaces.find({}).select('url -_id');
        res.json({enlaces});
    } catch (error) {
        console.log(error)
    }
}

//Retorna si el enlace tiene password o no 
exports.tienePassword = async (req, res, next) => {
    const { url } = req.params;

    //Verificar que el enlace exista
    const enlace = await Enlaces.findOne({ url });
    
    if(!enlace) {
        res.status(404).json({ msg: 'Ese enlace no existe' });
        return next();
    }

    if(enlace.password) {
        return res.json({ password: true, enlace: enlace.url });
    }

    next();
    
}

exports.verificarPassword = async (req, res, next) => {
    const { url } = req.params;
    const { password } = req.body;



    //Consultar por el enlace
    const enlace = await Enlaces.findOne({ url });

    //Verificar password
    if(bcrypt.compareSync(password, enlace.password)) {
        //Permitir al usuario descargar
        next();
    } else {
        return res.status(401).json({ msg: 'Password Incorrecta' });
    }
}