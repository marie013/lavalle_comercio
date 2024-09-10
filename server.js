
const express = require("express");
const path = require('path')
const Handlebars = require('handlebars');
const fs = require('fs');
const Seguridad = require("./seguridad.js");

const app = express();

const Controlador = require('./controlador');
const { default: axios } = require("axios");


app.use(express.json());
app.use(express.urlencoded({extended : false}))

const port = 3001;

app.use("/", express.static(path.join(__dirname, "/views")));

// Especifica la ubicación de tus archivos .hbs
app.set("views", path.join(__dirname, "views")); // Ruta a la carpeta "views"

let _url = path.join(__dirname,'./views/');


_url = "http://localhost:"+port;

//var objeto = {url : _url+"/login"};
var objeto = {url : _url};
let destino = {url:""}
//------------- zona de ruteo ------------------
app.get('/', (req,res)=>{

     var archivo = fs.readFileSync('./views/index.hbs','utf-8',(err,data)=>{
        if(err){
            console.log(err);         
        }else{
            console.log("archivo leído");
        }
    });
    var template = Handlebars.compile(archivo);
    var salida = template(objeto);
    res.send(salida);
})
//para visualizar
app.get('/navbar', (req,res)=>{

     var archivo = fs.readFileSync('./views/navbar.hbs','utf-8',(err,data)=>{
        if(err){
            console.log(err);         
        }else{
            console.log("archivo leído");
        }
    });
    var template = Handlebars.compile(archivo);
    var salida = template(objeto);
    res.send(salida);
})
app.get('/footer', (req,res)=>{

     var archivo = fs.readFileSync('./views/footer.hbs','utf-8',(err,data)=>{
        if(err){
            console.log(err);         
        }else{
            console.log("archivo leído");
        }
    });
    var template = Handlebars.compile(archivo);
    var salida = template(objeto);
    res.send(salida);
})

app.get('/menus', (req, res) => {
    var archivo = fs.readFileSync('./views/menu.hbs', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log("archivo leído");
        }
    });
    var template = Handlebars.compile(archivo);
    var salida = template(objeto);
    res.send(salida);
});
app.get('/sobrenosotros', (req, res) => {
    var archivo = fs.readFileSync('./views/sobreNosotros.hbs', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log("archivo leído");
        }
    });
    var template = Handlebars.compile(archivo);
    var salida = template(objeto);
    res.send(salida);
});


app.post('/menu', (req, res) => {
    console.log("browser --> server '/login'");
    console.log("server --> backend '/login'");
    console.log("Datos recibidos del cliente:", req.body);
    
    axios.post('http://localhost:3333/login', {
        email: req.body.email,
        contraseña: req.body.contraseña
    })
    .then(response => {
        if (response.status === 200) {
            console.log("server <-r- backend 'usuario autenticado'");

            var archivo = fs.readFileSync('./views/menu.hbs', 'utf-8', (err, data) => {
                if (err) {
                    console.log(err);
                    res.status(500).send('Error al leer la plantilla');
                }
            });

            var template = Handlebars.compile(archivo);
            var salida = template(objeto);
            console.log("browser <-r- server 'menu.html'");
            res.send(salida);
        } else {
            console.log("server <-r- backend 'credenciales inválidas'");
            res.send("<p>Error: Credenciales inválidas</p>");
        }
    })
    .catch(error => {
        console.error('Error en el login:', error);
        res.status(500).send('Error en el login');
    });
});


app.get('/nuevo', (req,res)=>{
    console.log("llegó un post/nuevo");
    
    var archivo = fs.readFileSync('./views/nuevo.hbs','utf-8',(err,data)=>{
        if(err){
            console.log(err);         
        }else{
            console.log("archivo leído");
        }
    });
    var template = Handlebars.compile(archivo);
    var salida = template(objeto);
    res.send(salida);
})

app.post('/agregar',(req, res)=>{
    console.log("llegó post/agregar");
    console.log(req.body);
    console.log(req.body.afiliado);
    if(req.body.afiliado == undefined){
        req.body.afiliado = false;
    }else{
        req.body.afiliado = true;
    }
    console.log(req.body);
    console.log(req.body.afiliado);
    
    var archivo = fs.readFileSync('./views/menu.hbs','utf-8',(err,data)=>{
        if(err){
            console.log(err);         
        }else{
            console.log("archivo leído");
        }
    });
    var template = Handlebars.compile(archivo);
    var salida = template(objeto);
    res.send(salida);   
})
app.get('/listarUsuarios', (req, res) => {
    axios.get('http://localhost:3333/usuario/all')
        .then(response => {
            const usuariosRegistrados = response.data.usuariosRegistrados;
            console.log("Usuarios recibidos", usuariosRegistrados);
            var archivo = fs.readFileSync('./views/listarUsuarios.hbs', 'utf-8', (err, data) => {
                if (err) {
                    console.log(err);
                    res.status(500).send('Error al leer la plantilla');
                } else {
                    console.log("archivo leído");
                }
            }); 
            var template = Handlebars.compile(archivo);
            var salida = template({usuarios: usuariosRegistrados});
            console.log("Datos enviados al template: ", {usuarios: usuariosRegistrados});
            res.send(salida);
        })
        .catch(error => {
            console.error('Error al obtener usuarios:', error);
            res.status(500).send('Error al obtener usuarios');
        });
});
app.get('/agregarComercio', (req,res)=>{
    console.log("llegó un post/agregarComercio");
    
    var archivo = fs.readFileSync('./views/agregarComercio.hbs','utf-8',(err,data)=>{
        if(err){
            console.log(err);         
        }else{
            console.log("archivo leído");
        }
    });
    var template = Handlebars.compile(archivo);
    var salida = template(objeto);
    res.send(salida);
})

app.post('/agregarComercio',(req, res)=>{
    console.log("llegó post/agregarComercio");
    console.log(req.body);
    Controlador.nuevoComercio(req.body);
    // console.log(req.body.afiliado);
    // if(req.body.afiliado == undefined){
    //     req.body.afiliado = false;
    // }else{
    //     req.body.afiliado = true;
    // }
    // console.log(req.body);
    // console.log(req.body.afiliado);
    
    var archivo = fs.readFileSync('./views/menu.hbs','utf-8',(err,data)=>{
        if(err){
            console.log(err);         
        }else{
            console.log("archivo leído");
        }
    });
    var template = Handlebars.compile(archivo);
    var salida = template(objeto);
    res.send(salida);   
})



app.listen(port, ()=>{
    console.log('Escuchando en el puerto ${port}')
});