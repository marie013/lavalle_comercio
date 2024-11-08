const axios = require('axios');
const fs = require('fs');
const Handlebars = require('hbs');

const formAgregarComercio = (req, res) => {
    res.render("./agregarComercio", {});
}

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

module.exports = {
    formAgregarComercio,
    agregarComercio
};
