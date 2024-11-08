const axios = require('axios');
const fs = require('fs');
const Handlebars = require('hbs');

const formAgregarProducto = (req, res) => {
    res.render("./agregarProducto", {});
}

const agregarProducto =(req, res)=>{
    console.log("Datos recibidos:", req.body);
    const id_comercio = req.cookies.id_comercio;
    axios.post(`http://localhost:3333/producto/registrar/${id_comercio}`, {
        nombre_producto: req.body.nombre_producto, 
        precio: req.body.precio,
        detalles: req.body.detalle_producto,
        categoria: req.body.categoria,
        disponibilidad: req.body.disponibilidad,
        imgProducto: req.body.imgProducto,
        oferta: req.body.oferta,
        descuento: req.body.descuento,
        fk_id_comercio: id_comercio
    })
    .then(response => {
        console.log("Producto enviado al servidor externo:", response.data);
        res.status(200).send("Producto agregado exitosamente");
    })
    .catch(error => {
        console.error('Error al enviar producto al servidor externo:', error);
        res.status(500).send('Error al agregar producto');
    });
}

module.exports = {
    formAgregarProducto,
    agregarProducto
};