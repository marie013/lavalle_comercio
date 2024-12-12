const axios = require('axios');
const fs = require('fs');
const Handlebars = require('hbs');

const menuComercio = (req, res) => {
    res.render('./comercio/menuComercio')
}
const formAgregarComercio = (req, res) => {
    res.render("./comercio/agregarComercio", {});
}
const listarComercios = (req, res) => {
    const urlComercios = 'http://localhost:3333/comercio';
    const urlUsuarios = 'http://localhost:3333/usuario';

    // Realizar ambas solicitudes en paralelo
    Promise.all([axios.get(urlComercios), axios.get(urlUsuarios)])
        .then(([resComercios, resUsuarios]) => {
            const comerciosRegistrados = resComercios.data.comerciosRegistrados;
            const usuariosRegistrados = resUsuarios.data.usuariosRegistrados;

            // Crear un mapa de usuarios para acceso rápido por ID
            const usuariosMap = {};
            usuariosRegistrados.forEach(usuario => {
                usuariosMap[usuario.id_usuario] = {
                    nombre: usuario.nombre,
                    telefono: usuario.telefono,
                };
            });

            // Enriquecer los comercios con los datos de los usuarios
            const comerciosConUsuarios = comerciosRegistrados.map(comercio => {
                const usuario = usuariosMap[comercio.fk_idUsuario];
                return {
                    ...comercio,
                    nombreUsuario: usuario ? usuario.nombre : 'No asignado',
                    telefonoUsuario: usuario ? usuario.telefono : 'No disponible',
                };
            });

            // Renderizar la vista con los datos enriquecidos
            res.render("administrador/listarComercios", { comercios: comerciosConUsuarios });
        })
        .catch(error => {
            console.error('Error al obtener datos:', error);
            res.status(500).send('Error al obtener datos');
        });
};

const listarComercioPorId = (req, res) => {
    const comercioId = req.params.id;
    const urlComercio = `http://localhost:3333/comercio/${comercioId}`;
    const urlUsuarios = "http://localhost:3333/usuario";

    // Realizar solicitudes para obtener datos del comercio y usuarios
    Promise.all([axios.get(urlComercio), axios.get(urlUsuarios)])
        .then(([resComercio, resUsuarios]) => {
            const comercio = resComercio.data;
            const usuariosRegistrados = resUsuarios.data.usuariosRegistrados;

            // Encontrar al usuario propietario del comercio
            const usuarioPropietario = usuariosRegistrados.find(
                (usuario) => usuario.id_usuario === comercio.fk_idUsuario
            );

            // Enriquecer datos del comercio con la información del usuario
            const comercioConUsuario = {
                ...comercio,
                nombreUsuario: usuarioPropietario ? usuarioPropietario.nombre : "No asignado",
                telefonoUsuario: usuarioPropietario ? usuarioPropietario.telefono : "No disponible",
            };

            // Renderizar la vista con los datos del comercio
            res.render("comercio/perfil", { comercio: comercioConUsuario });
        })
        .catch((error) => {
            console.error("Error al obtener datos:", error);
            res.status(500).send("Error al obtener datos del comercio");
        });
};


const agregarComercio = (req, res) => {
    const idUsuario = req.cookies.idUsuario;
    if (!idUsuario) {
        return res.status(400).send("El idUsuario no está definido");
    }
    axios.post(`http://localhost:3333/comercio/registrar/${idUsuario}`, {
        nombre: req.body.nombre,
        cuit: req.body.cuit,
        direccion: req.body.direccion,
        fk_idUsuario: idUsuario
    })
        .then(response => {
            console.log(response.data);
            const id_comercio = response.data.comercioNuevo.idComercio;
            console.log("Comercio registrado con id:", id_comercio);
            // Establecer la cookie id_comercio, expiración de 1 día
            res.cookie("id_comercio", id_comercio, { httpOnly: true });

            // Redirigir a la ruta /menuComercio
            res.redirect("/menuComercio");
        })
        .catch(error => {
            console.error("Error al agregar comercio:", error);
            res.status(500).send("Error al agregar comercio");
        });
};
//form editar com
const formEditarComercio = (req, res) => {
    const idComercio = req.params.idComercio;
    console.log("El ID del comercio a modificar es:", idComercio);

    // Solicitar los datos del comercio desde el servidor
    axios.get(`http://localhost:3333/comercio/${idComercio}`)
        .then(response => {
            console.log(response.data);
            const comercio = response.data;

            res.render("comercio/editarComercio", { comercio: comercio });
        })
        .catch(error => {
            console.error("Error al obtener el comercio:", error);
            res.status(500).send("Error al obtener el comercio");
        });
};

//editar un comercio
const editarComercio = async (req, res) => {
    const idComercio = req.params.idComercio; 
    const { nombre, cuit, direccion } = req.body; 
    const rol = req.cookies.rol; 

    // Crear el objeto con los datos actualizados del comercio
    const comercioModificado = {
        nombre: nombre,
        cuit: cuit,
        direccion: direccion,
    };

    console.log('Datos del comercio a modificar:', comercioModificado);

    // Solicitud PUT al backend
    axios.put(`http://localhost:3333/comercio/editar/${idComercio}`, comercioModificado)
        .then(response => {
            if (response.status === 200) {
                // Redirigir según el rol del usuario
                if (rol === true) {
                    res.redirect("/listarComercios");
                } else { 
                    res.redirect("/perfil");
                }
            } else {
                res.status(500).send("Error al actualizar el comercio");
            }
        })
        .catch(error => {
            console.error('Error al actualizar el comercio:', error);
            res.status(500).send('Error al actualizar el comercio');
        });
};

// mostrar los productos de los comercios donde fk_idUsuario == idUsuario(de la cookie)
const prodComercio = (req, res) => {
    const idUsuario = req.cookies.idUsuario;
    const urlComercios = 'http://localhost:3333/comercio';
    const urlProductos = 'http://localhost:3333/producto';
    const urlCategorias = 'http://localhost:3333/categorias';

    // Obtener comercios, productos y categorías
    Promise.all([axios.get(urlCategorias), axios.get(urlComercios), axios.get(urlProductos)])
        .then(([resCategorias, resComercios, resProductos]) => {
            const categorias = resCategorias.data.categoriasRegistradas || [];
            const comercios = resComercios.data.comerciosRegistrados || [];
            const productos = resProductos.data.productosRegistrados || [];
            // Crear un mapa de categorías para acceso rápido
            const categoriasMap = {};
            categorias.forEach(categoria => {
                categoriasMap[categoria.idCategoria] = categoria.nombre; // Asocia ID de categoría con nombre
            });
            // Filtrar comercios del usuario actual
            const comerciosDelUsuario = comercios.filter(comercio => comercio.fk_idUsuario === idUsuario);

            // Agregar productos con el nombre de la categoría a cada comercio
            const comerciosConProductos = comerciosDelUsuario.map(comercio => {
                const productosDelComercio = productos
                    .filter(producto => producto.fk_id_comercio === comercio.idComercio)
                    .map(producto => {
                        return {
                            ...producto,
                            nombreCategoria: categoriasMap[producto.categoria] || 'Sin categoría' // Añadir nombre de la categoría
                        };
                    });
                return {
                    ...comercio,
                    productos: productosDelComercio // Agregar productos al comercio
                };
            });
            // Renderizar la vista con los datos estructurados
            res.render('comercio/productosComercio', { comercios: comerciosConProductos });
        })
        .catch(error => {
            console.error('Error al obtener datos:', error.message);
            res.status(500).send("Error al obtener los datos.");
        });
};

const eliminarComercio = (req, res) => {
    const idComercio = req.params.idComercio; // Obtener ID desde la ruta
    console.log("ID del comercio a eliminar:", idComercio);

    axios.delete(`http://localhost:3333/comercio/${idComercio}`)
        .then(() => {
            console.log("Comercio eliminado correctamente");
            res.redirect('/listarComercios');
        })
        .catch((error) => {
            console.error("Error al eliminar el comercio:", error.response ? error.response.data : error.message);
            res.status(500).render('administrador/listarComercios', {
                error: "No se pudo eliminar el comercio. Intenta nuevamente.",
            });
        });
};
const eliminarComercioUser = (req, res) => {
    const idComercio = req.params.idComercio; 
    console.log("ID del comercio a eliminar por el usuario:", idComercio);

    axios.delete(`http://localhost:3333/comercio/${idComercio}`)
        .then(() => {
            console.log("Comercio eliminado correctamente por el usuario");
            res.redirect('/perfil'); 
        })
        .catch((error) => {
            console.error("Error al eliminar el comercio por el usuario:", error.response ? error.response.data : error.message);
            res.status(500).render('users/perfil', {
                error: "No se pudo eliminar el comercio. Intenta nuevamente.",
            });
        });
};



module.exports = {
    formAgregarComercio,
    agregarComercio,
    listarComercios,
    eliminarComercio,
    menuComercio,
    listarComercioPorId,
    prodComercio,
    formEditarComercio,
    editarComercio,
    eliminarComercioUser
};
