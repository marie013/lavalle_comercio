const Clases = require('./clases.js')
const Modelo = require('./modelo.js')



function nuevo(data){
    console.log("--nuevo(data)-->[controlador]")
    console.log(data);
    let miMercaderia = new Clases.Mercaderia(data.nombre, parseInt(data.cantidad), data.impuestos)
    Modelo.guardar(miMercaderia);
}

function obtener(){
    return Modelo.obtener();
}
function nuevoComercio(data){
    console.log("--nuevoComercio(data)-->[controlador]")
    console.log(data);
    let miComercio = new Clases.Comercio(data.nombre, parseInt(data.cuit), data.direccion)
    Modelo.guardarComercio(miComercio);
}

function obtenerComercio(){
    return Modelo.obtenerComercio();
}

module.exports = {nuevo, obtener, nuevoComercio, obtenerComercio}