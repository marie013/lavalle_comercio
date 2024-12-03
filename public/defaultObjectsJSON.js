export const defaultProducts = [
  {
    id_producto: "0MpVTzjo",
    nombre_producto: "Smartphone X",
    precio: 599,
    detalles: "Un smartphone potente con cámara de alta resolución.",
    categoria: "Móviles",
    disponibilidad: true,
    imagenes: [
      "https://via.placeholder.com/300",
      "https://via.placeholder.com/300",
      "https://via.placeholder.com/300",
    ],
    oferta: true,
    descuento: 10,
    fk_id_comercio: "wYMlv53M",
  },
  {
    id_producto: "iRV5m7Qs",
    nombre_producto: "Laptop Pro",
    precio: 1299,
    detalles: "Laptop para profesionales con gran rendimiento.",
    categoria: "Roman",
    disponibilidad: true,
    imagenes: [
      "https://via.placeholder.com/300",
      "https://via.placeholder.com/300",
      "https://via.placeholder.com/300",
    ],
    oferta: false,
    descuento: 0,
    fk_id_comercio: "GG2dCHMc",
  },
  {
    id_producto: "Z5oPwoFv",
    nombre_producto: "Auriculares Inalámbricos",
    precio: 199,
    detalles: "Auriculares con cancelación de ruido y gran calidad de sonido.",
    categoria: "Audio",
    disponibilidad: true,
    imagenes: [
      "https://via.placeholder.com/300",
      "https://via.placeholder.com/300",
      "https://via.placeholder.com/300",
    ],
    oferta: true,
    descuento: 15,
    fk_id_comercio: "qzXY1jQG",
  },
  {
    id_producto: "OikN7VVf",
    nombre_producto: "Smartwatch Fitness",
    precio: 299,
    detalles: "Reloj inteligente con múltiples funciones para deportistas.",
    categoria: "Wearables",
    disponibilidad: true,
    imagenes: [
      "https://via.placeholder.com/300",
      "https://via.placeholder.com/300",
      "https://via.placeholder.com/300",
    ],
    oferta: false,
    descuento: 0,
    fk_id_comercio: "wYMlv53M",
  },
  {
    id_producto: "gQEvRjoF",
    nombre_producto: "Tablet Ultra",
    precio: 499,
    detalles: "Tablet ligera y potente para trabajo y entretenimiento.",
    categoria: "Tablets",
    disponibilidad: true,
    imagenes: [
      "https://via.placeholder.com/300",
      "https://via.placeholder.com/300",
      "https://via.placeholder.com/300",
    ],
    oferta: true,
    descuento: 20,
    fk_id_comercio: "GG2dCHMc",
  },
  {
    id_producto: "pKh8DaLz",
    nombre_producto: "Monitor 4K Ultra",
    precio: 799,
    detalles: "Pantalla 4K con alta resolución para profesionales.",
    categoria: "Computadoras",
    disponibilidad: true,
    imagenes: [
      "https://via.placeholder.com/300",
      "https://via.placeholder.com/300",
      "https://via.placeholder.com/300",
    ],
    oferta: false,
    descuento: 0,
    fk_id_comercio: "wYMlv53M",
  },
  {
    id_producto: "QXzRgFk8",
    nombre_producto: "Auriculares Bluetooth Pro",
    precio: 349,
    detalles: "Auriculares bluetooth de alta gama con cancelación de ruido.",
    categoria: "Audio",
    disponibilidad: true,
    imagenes: [
      "https://via.placeholder.com/300",
      "https://via.placeholder.com/300",
      "https://via.placeholder.com/300",
    ],
    oferta: true,
    descuento: 10,
    fk_id_comercio: "qzXY1jQG",
  },
  {
    id_producto: "YEdTq3Fy",
    nombre_producto: "Laptop Gaming",
    precio: 1499,
    detalles: "Laptop de alto rendimiento para videojuegos.",
    categoria: "Computadoras",
    disponibilidad: true,
    imagenes: [
      "https://via.placeholder.com/300",
      "https://via.placeholder.com/300",
      "https://via.placeholder.com/300",
    ],
    oferta: true,
    descuento: 25,
    fk_id_comercio: "GG2dCHMc",
  },
  {
    id_producto: "T1bJuO7M",
    nombre_producto: 'Tablet 10"',
    precio: 359,
    detalles: 'Tablet con pantalla de 10" y rendimiento optimizado.',
    categoria: "Tablets",
    disponibilidad: true,
    imagenes: [
      "https://via.placeholder.com/300",
      "https://via.placeholder.com/300",
      "https://via.placeholder.com/300",
    ],
    oferta: false,
    descuento: 0,
    fk_id_comercio: "wYMlv53M",
  },
];

export const defaultStores = [
  {
    idComercio: "wYMlv53M",
    nombre: "TechStore",
    cuit: "30-12345678-9",
    direccion: "Av. Principal 123, Ciudad",
    fk_idUsuario: "yRoGVbH8",
    productos: ["0MpVTzjo", "OikN7VVf"],
  },
  {
    idComercio: "GG2dCHMc",
    nombre: "PCWorld",
    cuit: "30-87654321-0",
    direccion: "Calle Secundaria 456, Ciudad",
    fk_idUsuario: "tQGON4Fo",
    productos: ["iRV5m7Qs", "gQEvRjoF"],
  },
  {
    idComercio: "qzXY1jQG",
    nombre: "SoundMaster",
    cuit: "30-11223344-5",
    direccion: "Boulevard Musical 789, Ciudad",
    fk_idUsuario: "rX5Syo4o",
    productos: ["Z5oPwoFv", "QXzRgFk8"],
  },
  {
    idComercio: "V5qFm75r",
    nombre: "GadgetStore",
    cuit: "30-99887766-1",
    direccion: "Pasaje Innovación 321, Ciudad",
    fk_idUsuario: "yRoGVbH8",
    productos: [],
  },
  {
    idComercio: "G7R1y3Hh",
    nombre: "WearableHub",
    cuit: "30-33445566-7",
    direccion: "Circuito Tecnológico 654, Ciudad",
    fk_idUsuario: "tQGON4Fo",
    productos: [],
  },
];

export const defaultUsers = [
  {
    id_usuario: "qDAp7hi7",
    nombre: "Juan Pérez",
    email: "juan.perez@example.com",
    telefono: "+541123456789",
    contrasena: "hashed_password1",
    rol: true,
  },
  {
    id_usuario: "yoAeTinY",
    nombre: "María López",
    email: "maria.lopez@example.com",
    telefono: "+541198765432",
    contrasena: "hashed_password2",
    rol: false,
  },
  {
    id_usuario: "rX5Syo4o",
    nombre: "Carlos Gómez",
    email: "carlos.gomez@example.com",
    telefono: "+541123123123",
    contrasena: "hashed_password3",
    rol: false,
  },
  {
    id_usuario: "yRoGVbH8",
    nombre: "Ana Torres",
    email: "ana.torres@example.com",
    telefono: "+541122334455",
    contrasena: "hashed_password4",
    rol: false,
  },
  {
    id_usuario: "tQGON4Fo",
    nombre: "Luis Fernández",
    email: "luis.fernandez@example.com",
    telefono: "+541199887766",
    contrasena: "hashed_password5",
  },
  {
    id_usuario: "tQGON4Fo",
    nombre: "Luis Fernández",
    email: "luis.fernandez@example.com",
    telefono: "+541199887766",
    contrasena: "hashed_password5",
    rol: false,
  },
];