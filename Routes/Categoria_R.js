const axios = require('axios');
const { error } = require('console');
const { response } = require('express');
const fs = require('fs');
const Handlebars = require('hbs');

// listar las categorias
const listarCategorias = (req, res) => {
    axios.get('http://localhost:3333/categorias')
        .then(response => {
            const categorias = response.data.categoriasRegistradas;
            // console.log(categorias);  
            res.render("./categorias/listarCategorias", { categorias });
        })
        .catch(error => {
            console.error('Error al obtener usuarios:', error);
            res.status(500).send('Error al obtener usuarios');
        });
}
// crear una categoria
const formAgregarCategoria = (req, res) => {
    res.render('categorias/agregarCategoria', {});
}
const agregarCategoria = (req, res) => {
    var nombre = req.body.nombre;
    console.log(nombre);
    axios.post("http://localhost:3333/categoria/registrar", {
        nombre
    })
    res.redirect("/registrarCategoria");
};
// modificar 
const formModificarCategoria = (req, res) => {
    
    const idCategoriaAModificar = req.params.idCategoria;
    console.log("el id a modificar es: ", idCategoriaAModificar);

    axios.get(`http://localhost:3333/categoria/${idCategoriaAModificar}`, { withCredentials: true })
        .then(response => {
            const categoria = response.data.categoria;
            const nombre = response.data.categoria.nombre;
            console.log(nombre);
            res.render("categorias/editarCategoria", { categoria: categoria });
        })
        .catch(error => {
            console.log("error al obtener el id");
        })
}

const modificarCategoria = (req, res) => {
    const idCategoria = req.params.idCategoria;
    // console.log("el id de la cat a modificar es:", idCategoria);
    const nombre = req.body;

    console.log(nombre);
    axios.put(`http://localhost:3333/categoria/editar/${idCategoria}`, nombre)
        .then(response => {
            if (response.status === 200) {
                res.redirect("/listarCategorias");
            } else {
                res.status(500).send("Error al actualizar");
            }
        })
        .catch(error => {
            console.error('Error al actualizar:', error);
            res.status(500).send('Error al actualizar');
        });
}

// eliminar
const eliminarCategoria = (req, res) => {
    const idCategoria = req.params.idCategoria;

    axios.delete(`http://localhost:3333/categoria/eliminar/${idCategoria}`)
        .then(()=>{
            // console.log("Categoria eliminada");
            res.redirect('/listarCategorias');
        })
        .catch((error) => {
            console.error("Error al eliminar el usuario:", error.response ? error.response.data : error.message);
            res.status(500).render('administrador/listarUsuarios', {
                error: "No se pudo eliminar el usuario. Intenta nuevamente.",
            });
        });
}

module.exports = {
    formAgregarCategoria,
    agregarCategoria,
    listarCategorias,
    formModificarCategoria,
    modificarCategoria,
    eliminarCategoria
};