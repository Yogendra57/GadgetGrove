import axios from "axios";

const api = axios.create({
  baseURL: "https://gadgetgrove-h2af.onrender.com/api", 
});

export default api;