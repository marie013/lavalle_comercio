import axios from "axios";

const baseUrl = "http://localhost:3333";

const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true, //por ahora no se necesita enviar credenciales por header o cookie
});

export default api;
