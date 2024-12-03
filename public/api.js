import api from "./configApi.js"; // Importa la configuración de Axios

const API = {
  // Usuarios
  registrarUsuario: async (datosUsuario) => {
    const response = await api.post("/usuario/registrar", datosUsuario);
    return response.data;
  },
  loginUsuario: async (credenciales) => {
    const response = await api.post("/login", credenciales);
    return response.data;
  },
  obtenerUsuarioPorId: async (id) => {
    const response = await api.get(`/usuario/${id}`);
    return response.data;
  },
  obtenerTodosUsuarios: async () => {
    const response = await api.get("/usuario");
    return response.data;
  },
  editarUsuario: async (id, datosActualizados) => {
    const response = await api.put(`/usuario/editar/${id}`, datosActualizados);
    return response.data;
  },
  eliminarUsuario: async (id) => {
    const response = await api.delete(`/usuario/${id}`);
    return response.data;
  },

  // Categorías
  registrarCategoria: async (datosCategoria) => {
    const response = await api.post("/categoria/registrar", datosCategoria);
    return response.data;
  },
  eliminarCategoria: async (id) => {
    const response = await api.delete(`/categoria/eliminar/${id}`);
    return response.data;
  },
  editarCategoria: async (id, datosActualizados) => {
    const response = await api.put(
      `/categoria/editar/${id}`,
      datosActualizados
    );
    return response.data;
  },
  obtenerTodasCategorias: async () => {
    const response = await api.get("/categorias");
    return response.data;
  },
  obtenerCategoriaPorId: async (id) => {
    const response = await api.get(`/categoria/${id}`);
    return response.data;
  },

  // Comercios
  registrarComercio: async (idUsuario, datosComercio) => {
    const response = await api.post(
      `/comercio/registrar/${idUsuario}`,
      datosComercio
    );
    return response.data;
  },
  obtenerComercioPorId: async (id) => {
    const response = await api.get(`/comercio/${id}`);
    return response.data;
  },
  obtenerComerciosPorPropietario: async (idPropietario) => {
    const response = await api.get(`/comercio/owner/${idPropietario}`);
    return response.data;
  },
  obtenerTodosComercios: async () => {
    const response = await api.get("/comercio");
    return response.data;
  },
  eliminarComercio: async (id) => {
    const response = await api.delete(`/comercio/${id}`);
    return response.data;
  },

  // Productos
  registrarProducto: async (idComercio, formData) => {
    const response = await api.post(
      `/producto/registrar/${idComercio}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },
  obtenerProductoPorId: async (id) => {
    const response = await api.get(`/producto/${id}`);
    return response.data;
  },
  obtenerTodosProductos: async () => {
    const response = await api.get("/producto");
    return response.data;
  },
  eliminarProducto: async (id) => {
    const response = await api.delete(`/producto/${id}`);
    return response.data;
  },
  editarProducto: async (idProducto, formData) => {
    const response = await api.put(`/producto/editar/${idProducto}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  obtenerProductosPorComercio: async (idComercio) => {
    const response = await api.get(`/producto/comercio/${idComercio}`);
    return response.data;
  },
};

export default API;
