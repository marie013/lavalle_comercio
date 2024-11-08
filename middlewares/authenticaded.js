const admin = (req, res, next) => {
    // console.log(req.cookies);
    // Verificación
    const idUsuario = req.cookies.idUsuario;
    const rol = req.cookies.rol;

    if (!idUsuario || !rol) {
        console.log("No se encontraron cookies.");
        return res.status(403).send('Falta información de autenticación.');
    }

    // console.log("ID de Usuario en cookie:", req.cookies.idUsuario);
    // console.log("Rol de Usuario en cookie:", req.cookies.rol);

    // Verifica si la cookie 'rol' está configurada como 'true'
    if (req.cookies.rol === "true") {
        next();
    } else {
        res.status(403).send('Acceso denegado: Solo administradores.');
    }
};
const logueado = (req, res, next) => {
    // console.log("ID de Usuario en cookie:", req.cookies.idUsuario);
    // console.log("Rol de Usuario en cookie:", req.cookies.rol);
    // Verifica si la cookie 'idUsuario' existe, lo que indica que el usuario está autenticado
    if (req.cookies && req.cookies.idUsuario) {
        return next();
    } else {
        res.redirect('/');
    }
};
module.exports = {
    logueado,
    admin

};
