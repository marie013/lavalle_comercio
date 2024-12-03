import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true, //por ahora no se necesita enviar credenciales por header o cookie
});

export default api;
