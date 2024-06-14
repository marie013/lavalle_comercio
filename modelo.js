const fs = require('fs')
const Clases = require('./clases.js')

function guardarUsuario(data){
    
    let str_usuarios = fs.readFileSync('./db/usuarios.txt','utf-8')
    let usuarios = []
    if(str_usuarios){
        usuarios = JSON.parse(str_usuarios)
    }
    
    usuarios.push(data)
    fs.writeFileSync('./db/usuarios.txt',JSON.stringify(usuarios))
}

function getUsuarios(){    
 
    let str_usuarios = fs.readFileSync('./db/usuarios.txt','utf-8')
    let usuarios = []
    if(str_usuarios){ 
        usuarios = JSON.parse(str_usuarios);
    }
    let objUsuarios = [];
    usuarios.forEach(x=>objUsuarios.push(Clases.Usuario.fromJSON(x)))

    return objUsuarios;

}

function guardar(data){

    let str_mercaderias = fs.readFileSync('./db.txt','utf-8')
    let mercaderias = []
    if(str_mercaderias){
        mercaderias = JSON.parse(str_mercaderias)
    }
    
    mercaderias.push(data)
    fs.writeFileSync('./db.txt',JSON.stringify(mercaderias))
}

function obtener(){

    let str_mercaderias = fs.readFileSync('./db.txt','utf-8')
    let mercaderias = []
    if(str_mercaderias){
        mercaderias = JSON.parse(str_mercaderias)
    }

    return mercaderias;

}
function guardarComercio(data){
    console.log("guardarComercio(data) --> modelo")
    console.log(data)
    let str_comercios = fs.readFileSync('./comercios.txt','utf-8')
    let comercios = []
    if(str_comercios){
        comercios = JSON.parse(str_comercios)
    }
    
    comercios.push(data)
    fs.writeFileSync('./comercios.txt',JSON.stringify(comercios))
}

function obtenerComercio(){
    console.log("obtenerComercio --> modelo")
    
    let str_comercios = fs.readFileSync('./comercios.txt','utf-8')
    let comercios = []
    if(str_comercios){
        comercios = JSON.parse(str_comercios)
    }

    return comercios;

}

module.exports = {guardar, obtener, guardarUsuario, getUsuarios, guardarComercio, obtenerComercio}