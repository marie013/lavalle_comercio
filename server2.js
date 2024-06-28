// este archivo es para pruebas atte. sofia

const express = require("express");
const path = require('path');
const Handlebars = require('handlebars');
const fs = require('fs');
const Seguridad = require("./seguridad.js");
const { engine } = require('express-handlebars'); // Asegúrate de usar express-handlebars

const app = express();

const Controlador = require('./controlador');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = 3002;

// Configura el motor de vistas Handlebars
app.engine('.hbs', engine({ extname: '.hbs', partialsDir: path.join(__dirname, 'views/partials') }));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

let _url = path.join(__dirname, './views/');
_url = "http://localhost:" + port;

var objeto = { url: _url };
let destino = { url: "" };

// Registra los parciales
Handlebars.registerPartial('navbar', fs.readFileSync('./views/partials/navbar.hbs', 'utf8'));
Handlebars.registerPartial('footer', fs.readFileSync('./views/partials/footer.hbs', 'utf8'));

// Zona de ruteo
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

app.get('/menu', (req, res) => {
    var archivo = fs.readFileSync('./views/menu.hbs', 'utf-8');
    var template = Handlebars.compile(archivo);
    var salida = template(objeto);
    res.send(salida);
});

app.get('/listar', (req, res) => {
    var archivo = fs.readFileSync('./views/listar.hbs', 'utf-8');
    var template = Handlebars.compile(archivo);
    var salida = template(objeto);
    res.send(salida);
});

app.post('/login', (req,res)=>{

    console.log("browser --> server 'post/login'");
    console.log("server --> seguridad 'registrado(req.body)'")

    let registrado = Seguridad.registrado(req.body);
    

    if(registrado==true){
        console.log("server <-r- seguridad 'true'");
        var archivo = fs.readFileSync('./views/menu.hbs','utf-8',(err,data)=>{
            if(err){
                console.log(err);         
            }else{
                //console.log("archivo leído");
            }
        });
        var template = Handlebars.compile(archivo);
        var salida = template(objeto);
        console.log("browser <-r- server 'menu.html'")
        res.send(salida);
    }else{
        console.log("server <-r- seguridad 'false'");
        console.log("browser <-r- server 'Error...!!!.html'")
        res.send("<p>Error...!!!</p>");
    }
})


app.get('/nuevo', (req, res) => {
    console.log("llegó un post/nuevo");
    var archivo = fs.readFileSync('./views/nuevo.hbs', 'utf-8');
    var template = Handlebars.compile(archivo);
    var salida = template(objeto);
    res.send(salida);
});

app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`);
});
