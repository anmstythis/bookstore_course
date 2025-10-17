import axios from "axios";
import { getCurrentUser } from "./utils/userUtils.js";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {

  const user = getCurrentUser();
  console.log('getCurrentUser():', user);

  if (user?.login) {
    config.headers["X-User-Login"] = user.login; 
    console.log(config.headers);
  } else {
    console.log('Нет логина, не добавлен заголовок X-User-Login');
  }

  return config;
});

export default api;
