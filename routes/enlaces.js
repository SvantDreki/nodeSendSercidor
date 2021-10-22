const express = require('express');
const router = express.Router();
const enlacesController = require('../controllers/enlacesController');
const archivosController = require('../controllers/archivosController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

router.post('/',
    [
        check('nombre', 'Sube un archivo').not().isEmpty(),
        check('nombreOriginal', 'Sube un archivo').not().isEmpty()
    ],
    auth,
    enlacesController.nuevoEnlace
);

router.get('/', enlacesController.todosEnlaces);

router.get('/:url',
    enlacesController.tienePassword,
    enlacesController.obtenerEnlace
);

router.post('/:url',
    enlacesController.verificarPassword,
    enlacesController.obtenerEnlace
);

module.exports = router;