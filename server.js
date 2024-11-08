const express = require("express");
const path = require('path');
const hbs = require('hbs');
const methodOverride = require("method-override");
const fs = require('fs');
const axios = require("axios");

const app = express();
const port = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));
app.use(express.static(path.join(__dirname, 'public')));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const { admin } = require('./middlewares/authenticaded');
const { logueado } = require('./middlewares/authenticaded');
const usuarioRoutes = require('./Routes/Usuario_R');
const comercioRoutes = require('./Routes/Comercio_R');

app.get('/', usuarioRoutes.inicio);


// Rutas relacionadas a usuarios
app.post('/menu', usuarioRoutes.menu);
app.get('/registrarUsuario', logueado, usuarioRoutes.formRegistrarUsuario);
app.post('/registrarUsuario', logueado, usuarioRoutes.registrarUsuario);
app.get('/sobreNosotros', logueado, usuarioRoutes.sobreNosotros );

// administrador
app.get('/listarUsuarios', logueado, admin, usuarioRoutes.listarUsuarios);
app.get('/registrarAdministrador', logueado, admin, usuarioRoutes.formRegistrarAdministrador);
app.post('/registrarAdministrador', logueado, admin, usuarioRoutes.registrarAdministrador);
app.post('/eliminarUsuario', logueado, admin, usuarioRoutes.eliminarUsuario);

// comercio
app.get('/agregarComercio', logueado, comercioRoutes.formAgregarComercio);
app.post('/agregarComercio', logueado, comercioRoutes.agregarComercio);
 
app.get('/logout', usuarioRoutes.logout);

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
