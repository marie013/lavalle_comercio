// ABM por parte del admi
const axios = require('axios');
const { error } = require('console');
const fs = require('fs');
const handlebars = require('hbs');

handlebars.registerHelper('ifCond', function (v1, v2, options) {
    return (v1 === v2) ? options.fn(this) : options.inverse(this);
});


const formAgregarProducto = (req, res) => {
    res.render("./agregarProducto", {});
}

const agregarProducto = (req, res) => {
    const idComercio = req.cookies.id_comercio;

    axios.post(`http://localhost:3333/producto/registrar/${idComercio}`, req.body, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
        .then(response => {
            console.log("Producto agregado:", req.body);
            res.render("./menu", {});
        })
        .catch(error => {
            console.error("Error al enviar producto al servidor:", error);
            res.status(500).send("Error al agregar producto");
        });
};
const listarProductos = (req, res) => {
    const urlCategorias = 'http://localhost:3333/categorias';
    const urlUsuarios = 'http://localhost:3333/usuario';
    const urlProductos = 'http://localhost:3333/producto';
    const urlComercios = 'http://localhost:3333/comercio';
    // Realizar todas las solicitudes en paralelo
    Promise.all([
        axios.get(urlCategorias), axios.get(urlUsuarios), axios.get(urlProductos), axios.get(urlComercios),
    ])
        .then(([resCategorias, resUsuarios, resProductos, resComercios]) => {
            const categorias = resCategorias.data.categoriasRegistradas;
            const usuarios = resUsuarios.data.usuariosRegistrados;
            const productos = resProductos.data.productosRegistrados;
            const comercios = resComercios.data.comerciosRegistrados;

            // Crear mapas para acceso rápido por ID
            const categoriasMap = {};
            categorias.forEach(categoria => {
                categoriasMap[categoria.idCategoria] = categoria.nombre;
            });
            const usuariosMap = {};
            usuarios.forEach(usuario => {
                usuariosMap[usuario.id_usuario] = {
                    nombre: usuario.nombre,
                    telefono: usuario.telefono,
                };
            });
            const comerciosMap = {};
            comercios.forEach(comercio => {
                const usuario = usuariosMap[comercio.fk_idUsuario] || { nombre: 'No asignado' };
                comerciosMap[comercio.idComercio] = {
                    nombre: comercio.nombre,
                    usuarioPropietario: usuario,
                };
            });
            const productosConDetalles = productos.map(producto => {
                const categoriaNombre = categoriasMap[producto.categoria] || 'Sin categoría';
                const usuario = usuariosMap[producto.idUsuario] || { nombre: 'No asignado', telefono: 'No disponible' };

                // Verificar si el fk de producto coincide con algún idComercio
                const comercio = comerciosMap[producto.fk_id_comercio];
                const comercioNombre = comercio ? comercio.nombre : 'Comercio no asignado';
                const comercioId = comercio ? producto.fk_id_comercio : 'No asignado';

                return {
                    ...producto,
                    nombreCategoria: categoriaNombre,
                    nombreUsuario: usuario.nombre,
                    idComercio: comercioId,
                    nombreComercio: comercioNombre,
                    idProducto: producto.id_producto,
                };
            });
            res.render("productos/listarProductos", { productos: productosConDetalles });
        })
        .catch(error => {
            console.error('Error al obtener datos:', error);
        });
};

// eliminar producto  
const eliminarProducto = (req, res) => {
    console.log(req.params);
    const idProducto = req.params.id_producto;
    console.log(idProducto)
    axios.delete(`http://localhost:3333/producto/${idProducto}`)
        .then(() => {
            res.redirect('/listarProductos');
        }).catch((error) => {
            console.error("error al eliminar producto", error.response ? error.response.data : error.message);
            res.status(500).render('productos/listarProductos', {
                error: "No se pudo eliminar el producto. Intenta nuevamente.",
            });
        })
}

const formEditarProducto = (req, res) => {
    console.log("Request params:", req.params);
    const idProdAModificar = req.params.idProducto;

    const urlProductos = `http://localhost:3333/producto/${idProdAModificar}`;
    const urlCategorias = 'http://localhost:3333/categorias';

    Promise.all([axios.get(urlCategorias), axios.get(urlProductos)])
        .then(([categoriasResponse, productoResponse]) => {
            const categorias = categoriasResponse.data.categoriasRegistradas;
            const producto = productoResponse.data;

            res.render("productos/editarProductos", { producto, categorias });
        })
        .catch(error => {
            console.error("Error al realizar la consulta:", error);
            res.status(500).send("Error al obtener el producto");
        });
}

const modificarProducto = (req, res) => {
    const idProducto = req.params.idProducto;
    // console.log("el id de la cat a modificar es:", idCategoria);
    console.log(req.body);
    const { nombre_producto, precio, detalles, categoria, disponibilidad, oferta, descuento } = req.body;
    // console.log ("nombre= ", nombre); 

    const productoModificado = {
        nombre: nombre_producto,
        precio: precio,
        detalles: detalles,
        categoria: categoria,
        disponibilidad: disponibilidad,
        oferta: oferta,
        descuento: descuento,
    }

    // console.log(nombre);
    axios.put(`http://localhost:3333/producto/editar/${idProducto}`, productoModificado)
        .then(response => {
            if (response.status === 200) {
                res.redirect("/listarproductos");
            } else {
                res.status(500).send("Error al actualizar");
            }
        })
        .catch(error => {
            console.error('Error al actualizar:', error);
            res.status(500).send('Error al actualizar');
        });
}

module.exports = {
    formAgregarProducto,
    agregarProducto,
    listarProductos,
    eliminarProducto,
    formEditarProducto,
    modificarProducto,
}; 