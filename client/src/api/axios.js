import axios from "axios";

const instance = axios.create({ baseURL: "/api" });

instance.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("messmate_user") || "null");
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("messmate_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default instance;