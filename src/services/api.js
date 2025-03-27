import axios from "axios";

// URLs de la API
const BASE_API_URL_USER = "https://task-man-backend.vercel.app/api";
// const BASE_API_URL_USER = "http://localhost:1234/api"; //LOCAL ENVIRONMENT

// Obtener token de localStorage
const getAuthToken = () => localStorage.getItem("token");

// Crear la instancia de axios
export const api = axios.create({
    baseURL: BASE_API_URL_USER,
    headers: {
        "Content-Type": "application/json"
    }
});

// Interceptor de solicitudes
api.interceptors.request.use(
    async(config) => {
        const token = getAuthToken();

        console.log("ENTERING interceptor");
        console.log(config.headers);

        if (token) {
            // Aquí podrías agregar más lógica para verificar si el token es válido
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.log("No token found, proceeding without Authorization header.");
        }

        console.log("Returning interceptor configuration");
        return config;
    },
    error => {
        console.log("Error in interceptor", error);
        return Promise.reject(error);
    }
);

// Lógica adicional para manejar el token expirado
export const refreshAuthToken = async () => {
    try {
        // Aquí deberías hacer una llamada a la API para obtener un nuevo token
        // Si la API devuelve un nuevo token, actualízalo en localStorage
        const response = await axios.post(`${BASE_API_URL_USER}/auth/refresh`, {
            refreshToken: getAuthToken()
        });

        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
            return response.data.token;
        } else {
            // Redirigir al login si no se obtiene un nuevo token
            window.location.href = "/login";
        }
    } catch (error) {
        console.log("Error refreshing token", error);
        // Si ocurre un error, redirigir al login
        window.location.href = "/login";
    }
};
