import axios from "axios";

const privateAxios = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://weather-api.webmania.ge"
});

privateAxios.interceptors.request.use(
    (config) => {
        const token = window.localStorage.getItem("token");
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

privateAxios.interceptors.response.use(
    (res) => res,
    async (error) => {
        if (error?.response?.status === 401) {
            window.localStorage.removeItem("token");
            window.localStorage.removeItem("userName");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default privateAxios;
