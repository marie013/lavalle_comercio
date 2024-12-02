const axios = require('axios');
const fs = require('fs');
const Handlebars = require('hbs');

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
            res.send(`
            <script>
                console.log('id_comercio almacenado en cookies');
            </script>
        `);
        })
        .catch(error => {
            console.error("Error al agregar comercio:", error);
            res.status(500).send("Error al agregar comercio");
        });
}
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


module.exports = {
    formAgregarComercio,
    agregarComercio, 
    listarComercios , 
    eliminarComercio
};
