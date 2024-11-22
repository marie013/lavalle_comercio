const axios = require('axios');
const fs = require('fs');
const Handlebars = require('hbs');

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

module.exports = {
    formAgregarProducto,
    agregarProducto
};