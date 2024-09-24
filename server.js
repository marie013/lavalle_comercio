const express = require("express");
const path = require('path');
const hbs = require('hbs');
const exphbs = require('express-handlebars');
const fs = require('fs');
const Seguridad = require("./seguridad.js");
const app = express();
const Controlador = require('./controlador');
const { default: axios } = require("axios");
const Handlebars = require('hbs');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = 3001;

app.set('views', [
  path.join(__dirname, 'views')
]);

// Configurar el motor de plantillas
app.set('view engine', 'hbs');

// Registrar parciales
hbs.registerPartials(path.join(__dirname, 'views/partials'));
hbs.registerPartials(path.join(__dirname, 'otrosParciales'));

//para servir archivos estáticos)
app.use(express.static(path.join(__dirname, 'public')));

// Especifica la ubicación de tus archivos .hbs
app.set("views", path.join(__dirname, "views"));

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
        contrasena: req.body.contrasena
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

app.post('/agregarProducto', (req, res) => {
    console.log("Datos recibidos:", req.body);
    
    axios.post('http://localhost:3333/producto/registrar', {
        nombre_producto: req.body.nombre_producto,
        precio: req.body.precio,
        detalle_producto: req.body.detalle_producto,
        categoria: req.body.categoria,
        // imagenes --> `multipart/form-data`
    })
    .then(response => {
        console.log("Producto enviado al servidor externo:", response.data);
        res.status(200).send("Producto agregado exitosamente");
    })
    .catch(error => {
        console.error('Error al enviar producto al servidor externo:', error);
        res.status(500).send('Error al agregar producto');
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

app.get('/prueba', (req,res)=>{
    console.log("llegó un post/prueba");
    
    var archivo = fs.readFileSync('./views/prueba.hbs','utf-8',(err,data)=>{
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

app.get('/agregarProducto', (req, res) => {
    var archivo = fs.readFileSync('./views/agregarProducto.hbs', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error al leer la plantilla');
        } else {
            console.log("archivo de agregarProducto leído");
        }
    });
    var template = Handlebars.compile(archivo);
    var salida = template(objeto);  
    res.send(salida);
});

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
// Registrar usuario.
app.get('/registrarUsuario', (req, res) => {
    var archivo = fs.readFileSync('./views/agregarUsuario.hbs', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log("archivo leído");
        }
    });
    var template = Handlebars.compile(archivo);
    var salida = template(objeto);
    res.send(salida);
})

app.post('/registrarUsuario', (req, res) => {
    console.log(req.body.nombre);
    axios.post('http://localhost:3333/usuario/registrar', {
        nombre: req.body.nombre,
        email: req.body.email,
        telefono: req.body.telefono,
        contrasena: req.body.pass,
        rol: req.body.rol
    })
        .then(response => {
            if (response.status === 201) {
                var archivo = fs.readFileSync('./views/agregarUsuario.hbs', 'utf-8', (err, data) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send('Error al leer la plantilla');
                    }
                });
                var template = Handlebars.compile(archivo);
                var salida = template(objeto);
                console.log("browser <-r- server 'agregarUsuario.hbs'");
                res.send(salida);
            } else {
                console.log("server <-r- backend 'error en los datos ingresados'");
            }
        })
})


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

app.post('/agregarComercio', (req, res) => {
    console.log("Datos recibidos:", req.body);
    
    axios.post('http://localhost:3333/comercio/registrar/:id', {  
        nombre: req.body.nombre,
        cuit: req.body.cuit,
        direccion: req.body.direccion,
        
    })
    .then(response => {
        console.log("Comercio enviado al servidor externo:", response.data);
        res.status(200).send("Comercio agregado exitosamente");
    })
    .catch(error => {
        console.error('Error al enviar comercio al servidor externo:', error);
        res.status(500).send('Error al agregar comercio');
    });
});


app.listen(port, ()=>{
    console.log('Escuchando en el puerto ${port}')
});