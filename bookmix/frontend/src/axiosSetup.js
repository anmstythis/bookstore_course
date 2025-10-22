import axios from "axios";
import { getCurrentUser } from "./utils/userUtils.js";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {

  if (getCurrentUser()?.login) 
    config.headers["X-User-Login"] = getCurrentUser().login; 


  return config;
});

export default api;
