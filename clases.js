class Producto{
    constructor(nom_prod, precio, detalle, cat, disp, img, oferta, desc){
    this.nombre_producto = nom_prod;
    this.precio = precio;
    this.detalles = detalle;
    this.categoria = cat;
    this.disponibilidad = disp;
    this.imagenes = img;
    this.oferta = oferta;
    this.descuento = desc;
    }

}
class Comercio{
    constructor(nom, cuit, dir){
        this.nombre = nom;
        this.cuit = cuit;
        this.direccion = dir;
    }
}
class Imagen{
    //definir clase
}
class Categoria{
    //definir clase
}

class Usuario{
    constructor(nombre, usuario, pass, token, perfil){
        this.nombre = nombre;
        this.usuario = usuario;
        this.pass = pass;
        this.token = token;
        this.perfil = perfil;
        this.class = "Usuario";
    }

    static fromJSON(json){
        if(json.class == "Usuario"){
            let nuevoUsuario = new Usuario();
            nuevoUsuario.nombre = json.nombre;
            nuevoUsuario.usuario = json.usuario;
            nuevoUsuario.pass = json.pass;
            nuevoUsuario.token = json.token;
            nuevoUsuario.perfil = json.perfil;
            nuevoUsuario.class = json.class;
            
            return nuevoUsuario;
        }

    }
}

class Perfil {
    constructor(){
        this.cuso = []
    }

    addCasoUso(cu){
        this.cuso.push(cu);
    }

    delCasoUso(cu){
        if(this.cuso.includes(cu)){
            let tmpCuso = this.cuso.filter(x=>x != cu)
            this.cuso = tmpCuso;
        }
    }
}
//faltaria los metodos static fromjson de las clases... 

module.exports = {Usuario, Perfil, Comercio}