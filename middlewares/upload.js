const multer = require('multer');
const path = require('path');

// Configurar almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Carpeta donde se guardarán los archivos
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Renombrar archivo con un identificador único
    }
});

// Configurar Multer
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Tamaño máximo de 5 MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('El archivo debe ser una imagen (JPEG, JPG, PNG, GIF).'));
    }
});

module.exports = upload;
