const axios = require('axios');
const fs = require('fs');
const Handlebars = require('hbs');

const inicio = (req, res) => {
    res.render("./index", {});
}
// _____________sobre nosotros----------
const sobreNosotros =(req, res)=>{
    res.render('./sobreNosotros', {});
}

const menu = (req, res) => {
    console.log("Datos recibidos del cliente:", req.body);
    axios.post("http://localhost:3333/login", {
        email: req.body.email,
        contrasena: req.body.contrasena
    })
        .then(response => {
            if (response.status === 200) {
                const idUsuario = response.data.usuarioAutorizado.id_usuario;
                const rol = response.data.usuarioAutorizado.rol;
                console.log("Usuario autenticado con id:", idUsuario, "--rol:  ", rol);

                // Establecer la cookie idUsuario con un tiempo de expiración de 1 día
                res.cookie("idUsuario", idUsuario, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
                res.cookie("rol", rol, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });

                // Renderizar plantilla basada en el rol
                if (rol == "false") {
                    res.render("./menu", {});
                } else {
                    res.render("administrador/menuAdmi", {});
                }
            } else {
                res.status(401).send("Credenciales inválidas o falta idUsuario");
            }
        })
        .catch(error => {
            console.error("Error en el login:", error);
            res.status(500).send("Error en el login");
        });
}
// ----------listar usuarios----------
const listarUsuarios = (req, res) => {
    axios.get('http://localhost:3333/usuario')
        .then(response => {
            const usuariosRegistrados = response.data.usuariosRegistrados;
            res.render("administrador/listarUsuarios", { usuarios: usuariosRegistrados });
        })
        .catch(error => {
            console.error('Error al obtener usuarios:', error);
            res.status(500).send('Error al obtener usuarios');
        });
};
// registrar usuario
const formRegistrarUsuario = (req, res) => {
    res.render("./agregarUsuario", {});
}
const registrarUsuario = (req, res) => {
    axios.post('http://localhost:3333/usuario/registrar', {
        nombre: req.body.nombre,
        email: req.body.email,
        telefono: req.body.telefono,
        contrasena: req.body.pass,
        rol: req.body.rol
    })
        .then(response => {
            if (response.status === 201) {
                res.render("./agregarUsuario", {});
            } else {
                console.log("Error en los datos ingresados");
            }
        })
        .catch(error => {
            console.error('Error al registrar usuario:', error);
            res.status(500).send('Error al registrar usuario');
        });
};
//registrar administrador
const formRegistrarAdministrador = (req, res) => {
    res.render("./agregarAdmi", {});
}
const registrarAdministrador = (req, res) => {
    console.log(req.body.nombre);
    axios.post('http://localhost:3333/usuario/registrar', {
        nombre: req.body.nombre,
        email: req.body.email,
        telefono: req.body.telefono,
        contrasena: req.body.pass,
        rol: req.body.rol
    })
        .then(response => {
            if (response.status === 201) {
                if (req.cookies.rol === true) {
                    res.redirect("/listarUsuarios");
                } else {
                    res.render("./agregarUsuario", {});
                }
            } else {
                console.log("server <-r- backend 'error en los datos ingresados'");
            }
        })
}
// eliminar usuarios
const eliminarUsuario = (req, res) => {
    const idUsuario = req.body.idUsuario;
    axios.delete(`http://localhost:3333/usuario/${idUsuario}`)
        .then(() => {
            res.redirect("/listarUsuarios");
        })
        .catch(error => {
            console.error("Error al eliminar el usuario:", error);
            res.status(500).send("Error al eliminar el usuario");
        });
};
// cerrar sesion
const logount = (req, res) => {
    res.clearCookie("idUsuario");
    res.clearCookie("rol");
    res.redirect("/");
}

module.exports = {
    inicio,
    menu,
    sobreNosotros,
    formRegistrarAdministrador,
    registrarAdministrador,
    listarUsuarios,
    formRegistrarUsuario,
    registrarUsuario,
    eliminarUsuario,
    logount
};
