const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const Enlaces = require('../models/Enlaces'); 

//1024 * 1024 = 1 MB


exports.subirArchivo = async (req, res, next) => {
    const configuracionMulter = {
        limits : { fileSize : req.usuario ? 1024*1024*10 : 1024*1024 },
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname+'/../uploads');
            },
            filename: (req, file, cb) => {
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                cb(null, `${shortid.generate()}${extension}`);
            }
        }) 
    }
    
    const upload = multer(configuracionMulter).single('archivo');

    upload(req, res, async (error) => {
        console.log(req.file);
        if(!error) {
            res.json({ archivo: req.file.filename })
        } else {
            console.log(error);
            return next();
        }
    });
}

exports.eliminarArchivo = async (req, res) => {
    try {
        fs.unlinkSync(__dirname+`/../uploads/${req.archivo}`);
    } catch (error) {
        console.log(error)
    }
}

exports.descargar = async (req, res, next) => {
    
    const { archivo } = req.params;

    const enlace = await Enlaces.findOne({ nombre: archivo });

    const archivoDesc = `${__dirname}/../uploads/${archivo}`;
    res.download(archivoDesc);

    //Eliminar el archivo y la entrada de la bd
    //Si la descargas son iguales a 1 - Borrar la entrada y el archivo
    const { descargas, nombre } = enlace;
    if(descargas === 1) {
        //Mandamos el nombre del archivo por req
        req.archivo = nombre;

        //mandamos al siguente middleware y se elimina de la DB
        await Enlaces.findOneAndRemove({ _id: enlace.id });
        next();
    } else {
        //Si la descargas son > a 1 - Restar 1
        enlace.descargas--;
        await enlace.save();
    }
}