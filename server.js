const express = require("express");
const path = require('path');
const hbs = require('hbs');
const methodOverride = require("method-override");
const fs = require('fs');
const axios = require("axios");

const app = express();
const port = 3001;
const upload = require('./middlewares/upload');

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
const productoRoutes = require('./Routes/Producto_R')
const categoriaRoutes = require('./Routes/Categoria_R')
app.get('/', usuarioRoutes.inicio);

 
// Rutas relacionadas a usuarios
app.post('/menu', usuarioRoutes.menu);
app.get('/menu', logueado, usuarioRoutes.home);
app.get('/registrarUsuario', logueado, usuarioRoutes.formRegistrarUsuario);
app.post('/registrarUsuario', logueado, usuarioRoutes.registrarUsuario);
app.get('/sobreNosotros', logueado, usuarioRoutes.sobreNosotros );
app.get("/perfil", logueado, usuarioRoutes.perfil);

// administrador
app.get('/listarUsuarios', logueado, admin, usuarioRoutes.listarUsuarios);
app.get('/listarComercios', logueado, admin, comercioRoutes.listarComercios);
app.get('/registrarAdministrador', logueado, admin, usuarioRoutes.formRegistrarAdministrador);
app.post('/registrarAdministrador', logueado, admin, usuarioRoutes.registrarAdministrador);
app.delete('/eliminarUsuario/:idUsuario', logueado, admin, usuarioRoutes.eliminarUsuario);
app.delete('/eliminarComercio/:idComercio', logueado, admin, comercioRoutes.eliminarComercio);
app.get('/editarUsuario/:id_usuario', logueado, admin, usuarioRoutes.formModificarUsuario);
app.post('/usuario/editar/:id', logueado, admin, usuarioRoutes.modificarUsuario);

// categorias(solo accede el administrador)
app.get('/listarCategorias', logueado, admin, categoriaRoutes.listarCategorias);
app.get('/registrarCategoria', logueado, admin, categoriaRoutes.formAgregarCategoria);
app.post('/registrarCategoria', logueado, admin, categoriaRoutes.agregarCategoria);
app.delete('/eliminarCategoria/:idCategoria', logueado, admin, categoriaRoutes.eliminarCategoria);
app.get('/editarCategoria/:idCategoria', logueado, admin, categoriaRoutes.formModificarCategoria);
app.post('/categoria/editar/:idCategoria', logueado, admin, categoriaRoutes.modificarCategoria);

//producto 
app.get('/agregarProducto', logueado, productoRoutes.formAgregarProducto)
app.post('/agregarProducto', logueado, upload.single('imgProducto'), productoRoutes.agregarProducto)
app.get('/listarProductos', logueado, productoRoutes.listarProductos);
app.delete('/eliminarProducto/:id_producto', productoRoutes.eliminarProducto);
app.get('/editarProducto/:idProducto', logueado, admin, productoRoutes.formEditarProducto);
app.post('/producto/editar/:idProducto', logueado, admin, productoRoutes.modificarProducto);

// comercio
app.get('/agregarComercio', logueado, comercioRoutes.formAgregarComercio);
app.post('/agregarComercio', logueado, comercioRoutes.agregarComercio);
 
app.get('/logout', usuarioRoutes.logout);
 
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
