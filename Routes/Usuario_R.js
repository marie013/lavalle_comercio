const axios = require("axios");
const { response } = require("express");
const fs = require("fs");
const Handlebars = require("hbs");

const inicio = (req, res) => {
  res.render("./index", {});
};
// _____________sobre nosotros----------
const sobreNosotros = (req, res) => {
  res.render("./sobreNosotros", {});
};

const menu = (req, res) => {
  console.log("Datos recibidos del cliente:", req.body);
  axios
    .post("http://localhost:3333/login", {
      email: req.body.email,
      contrasena: req.body.contrasena,
    })
    .then((response) => {
      if (response.status === 200) {
        const idUsuario = response.data.usuarioAutorizado.id_usuario;
        const rol = response.data.usuarioAutorizado.rol;
        console.log("Usuario autenticado con id:", idUsuario, "--rol:  ", rol);

        const nombre = response.data.usuarioAutorizado.nombre;
        const email = response.data.usuarioAutorizado.email;
        const telefono = response.data.usuarioAutorizado.telefono;

        // Establecer cookies
        res.cookie("idUsuario", idUsuario, {
          maxAge: 24 * 60 * 60 * 1000,
          httpOnly: true,
        });
        res.cookie("rol", rol, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
        res.cookie("nombre", nombre);
        res.cookie("email", email);
        res.cookie("telefono", telefono);

        // Renderizar plantilla basada en el rol
        if (rol == "false" || !rol) {
          res.render("./comercio/menuComercio", {});
        } else {
          res.redirect("/listarUsuarios");
        }
      } else {
        res.status(401).send("Credenciales inválidas o falta idUsuario");
      }
    })
    .catch((error) => {
      console.log("Error en autenticación:", error.message);
      res.render("login", {
        error: "Credenciales inválidas, por favor verifica tus datos",
      });
    });
};

//perfil
const perfil = (req, res) => {
  // Leer las cookies
  const idUsuario = req.cookies.idUsuario;
  const rol = req.cookies.rol;
  const nombre = req.cookies.nombre;
  const email = req.cookies.email;
  const telefono = req.cookies.telefono;

  console.log("Cookies recibidas:");
  console.log("ID Usuario:", idUsuario);
  console.log("Rol:", rol);
  console.log("Nombre:", nombre);
  console.log("Email:", email);
  console.log("Teléfono:", telefono);

  axios
    .get(`http://localhost:3333/comercio/owner/${idUsuario}`)
    .then((response) => {
      const comercios = response.data.comercio;

      console.log("Comercios relacionados al usuario:");
      console.log(comercios);

      res.render("users/perfil", {
        nombre,
        email,
        telefono,
        idUsuario,
        comercios, // Pasar la lista de comercios a la vista
      });
    })
    .catch((error) => {
      console.error("Error al obtener usuarios con comercios:", error);
      res.status(500).send("Error al obtener usuarios");
    });
};

// ----------listar usuarios----------
const listarUsuarios = (req, res) => {
  axios
    .get("http://localhost:3333/usuario")
    .then((response) => {
      const usuariosRegistrados = response.data.usuariosRegistrados;
      res.render("administrador/listarUsuarios", {
        usuarios: usuariosRegistrados,
      });
    })
    .catch((error) => {
      console.error("Error al obtener usuarios:", error);
      res.status(500).send("Error al obtener usuarios");
    });
};
// registrar usuario
const formRegistrarUsuario = (req, res) => {
  res.render("./agregarUsuario", {});
};
const registrarUsuario = (req, res) => {
  axios
    .post("http://localhost:3333/usuario/registrar", {
      nombre: req.body.nombre,
      email: req.body.email,
      telefono: req.body.telefono,
      contrasena: req.body.pass,
      rol: false,
    })
    .then((response) => {
      if (response.status === 201) {
        res.redirect("/");
      } else {
        console.log("Error en los datos ingresados");
      }
    })
    .catch((error) => {
      console.error("Error al registrar usuario:", error);
      res.status(500).send("Error al registrar usuario");
    });
};
//menu
const home = (req, res) => {
  res.render("./menu", {});
};
//registrar administrador
const formRegistrarAdministrador = (req, res) => {
  res.render("agregarAdmin", {});
};
const registrarAdministrador = (req, res) => {
  console.log(req.body.nombre);
  axios
    .post("http://localhost:3333/usuario/registrar", {
      nombre: req.body.nombre,
      email: req.body.email,
      telefono: req.body.telefono,
      contrasena: req.body.pass,
      rol: true,
    })
    .then((response) => {
      if (response.status === 201) {
        if (req.cookies.rol == "true") {
          res.redirect("/listarUsuarios");
        } else {
          res.render("./agregarUsuario", {});
        }
      } else {
        console.log("server <-r- backend 'error en los datos ingresados'");
      }
    });
};
// Eliminar usuario/administrador
const eliminarUsuario = (req, res) => {
  const idUsuario = req.params.idUsuario; // Obtener ID desde la ruta
  console.log("ID del usuario a eliminar:", idUsuario);

  axios
    .delete(`http://localhost:3333/usuario/${idUsuario}`)
    .then(() => {
      console.log("Usuario eliminado correctamente");
      res.redirect("/listarUsuarios");
    })
    .catch((error) => {
      console.error(
        "Error al eliminar el usuario:",
        error.response ? error.response.data : error.message
      );
      res.status(500).render("administrador/listarUsuarios", {
        error: "No se pudo eliminar el usuario. Intenta nuevamente.",
      });
    });
};
// modificar usuario

// Ruta para obtener los datos del usuario por id y mostrar el formulario de edición
const formModificarUsuario = (req, res) => {
  const idUsuarioAModificar = req.params.id_usuario;
  console.log("el id a modificar es: ", idUsuarioAModificar);

  // res.cookie("idCambio", idUsuarioAModificar, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });

  // Solicitar los datos del usuario desde el servidor
  axios
    .get(`http://localhost:3333/usuario/${idUsuarioAModificar}`, {
      withCredentials: true,
    })
    .then((response) => {
      console.log(response.data.user);
      const usuario = response.data.user;
      res.render("administrador/editarUsuario", { usuario: usuario });
    })
    .catch((error) => {
      console.error("Error al obtener el usuario:", error);
      res.status(500).send("Error al obtener el usuario");
    });
};

// Función para manejar la modificación del usuario
const modificarUsuario = async (req, res) => {
  const id_usuario = req.params.id;
  const { nombre, email, telefono, rol } = req.body;

  const usuarioModificado = {
    nombre: req.body.nombre,
    email: req.body.email,
    telefono: req.body.telefono,
    rol: rol === "true" ? true : false,
  };
  console.log(usuarioModificado);

  axios
    .put(
      `http://localhost:3333/usuario/editar/${id_usuario}`,
      usuarioModificado
    )
    .then((response) => {
      if (response.status === 200) {
        res.redirect("/listarUsuarios"); // Redirigir a la lista de usuarios después de la actualización
      } else {
        res.status(500).send("Error al actualizar el usuario");
      }
    })
    .catch((error) => {
      console.error("Error al actualizar el usuario:", error);
      res.status(500).send("Error al actualizar el usuario");
    });
};

// cerrar sesion
const logout = (req, res) => {
  res.clearCookie("idUsuario");
  res.clearCookie("rol");
  res.redirect("/");
};

module.exports = {
  inicio,
  menu,
  sobreNosotros,
  formRegistrarAdministrador,
  formModificarUsuario,
  modificarUsuario,
  registrarAdministrador,
  listarUsuarios,
  // obtenerUsuario,
  formRegistrarUsuario,
  registrarUsuario,
  eliminarUsuario,
  logout,
  perfil,
  home,
};
