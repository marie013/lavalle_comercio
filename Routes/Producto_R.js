// ABM por parte del admi
const axios = require('axios');
const { error, Console } = require('console');
const fs = require('fs');
const handlebars = require('hbs');

handlebars.registerHelper('ifCond', function (v1, v2, options) {
    return (v1 === v2) ? options.fn(this) : options.inverse(this);
});


const formAgregarProducto = (req, res) => {
    const urlCategorias = 'http://localhost:3333/categorias';
    const urlComercios = 'http://localhost:3333/comercio';
    const idUsuario = req.cookies.idUsuario; // Obtener ID del usuario desde la cookie
    console.log(idUsuario);

    if (!idUsuario) {
        return res.status(401).send("Usuario no autenticado");
    }
    Promise.all([axios.get(urlCategorias), axios.get(urlComercios)])
        .then(([resCategorias, resComercios]) => {
            const categorias = resCategorias.data.categoriasRegistradas;
            const comercios = resComercios.data.comerciosRegistrados;

            // Filtrar comercios pertenecientes al usuario
            const comerciosUsuario = comercios.filter(comercio => comercio.fk_idUsuario === idUsuario);

            res.render("./agregarProducto", {
                categorias,
                comercios: comerciosUsuario,
            });
        })
        .catch(error => {
            console.error('Error al obtener datos para el formulario:', error);
            res.status(500).send("Error al cargar el formulario");
        });
};


const agregarProducto = (req, res) => {
    // const idComercio = req.cookies.id_comercio;
    console.log(req.body.fk_id_comercio);

    axios.post(`http://localhost:3333/producto/registrar/${fk_id_comercio}`, req.body, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
        .then(response => {
            console.log("Producto agregado:", req.body);
            res.render("./menuComercio", {});
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
                    nombre_producto: producto.nombre_producto
                };
            });
            const rol = req.cookies.rol;
            // Renderizar plantilla basada en el rol
            if (rol == "true") {
                res.render("productos/listarProductos", { productos: productosConDetalles });
            } else {
                res.redirect("/tusProductos"); 
            }
        })
        .catch(error => {
            console.error('Error al obtener datos:', error);
        });
};

// eliminar producto  
const eliminarProducto = (req, res) => {
    console.log(req.params);
    const idProducto = req.params.id_producto;
    const rol = req.cookies.rol;
    console.log(idProducto)
    axios.delete(`http://localhost:3333/producto/${idProducto}`)
        .then(() => {
            // Renderizar plantilla basada en el rol
            if (rol == "false") {
                res.redirect("/tusProductos");
            } else {
                res.redirect("/listarProductos");  
            }
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
            const img = productoResponse.data.imagenes;
            
            console.log("El producto es: ", producto, " y las imagenes: ", img);

            // Aquí aseguras que las imágenes del producto se envían intactas
            const imagenes = producto.imagenes || []; 

            // Renderizas la página de edición pasando las imágenes
            res.render("productos/editarProductos", { producto, categorias, imagenes, img });
        })
        .catch(error => {
            console.error("Error al realizar la consulta:", error);
            res.status(500).send("Error al obtener el producto");
        });
};


const modificarProducto = (req, res) => {
    const idProducto = req.params.idProducto;
    // console.log(" producto",req.body); 

    const { nombre_producto, precio, detalles, categoria, disponibilidad, oferta, descuento } = req.body;

    axios.get(`http://localhost:3333/producto/${idProducto}`)
        .then(productoResponse => {
            const producto = productoResponse.data;

            // const imagenesActuales = producto.imagenes || [];

            // Crear el objeto con la estructura correcta incluyendo las imágenes
            const productoModificado = {
                nombre_producto: nombre_producto,
                precio: precio,
                detalles: detalles,
                categoria: categoria,
                disponibilidad: disponibilidad,
                oferta: oferta,
                descuento: descuento,
                // imagenes: imagenesActuales,  // No modificas las imágenes a menos que se envíen nuevas
            };
            // Realizar la solicitud PUT para actualizar el producto
            axios.put(`http://localhost:3333/producto/editar/${idProducto}`, productoModificado)
                .then(response => {
                    if (response.status === 200) {
                        res.redirect("/listarproductos"); // Redirigir si la actualización es exitosa
                    } else {
                        res.status(500).send("Error al actualizar");
                    }
                })
                .catch(error => {
                    console.error("Error al actualizar:", error);
                    res.status(500).send("Error al actualizar");
                });
        })
        .catch(error => {
            console.error("Error al obtener el producto:", error);
            res.status(500).send("Error al obtener el producto");
        });
};

module.exports = {
    formAgregarProducto,
    agregarProducto,
    listarProductos,
    eliminarProducto,
    formEditarProducto,
    modificarProducto,
}; 