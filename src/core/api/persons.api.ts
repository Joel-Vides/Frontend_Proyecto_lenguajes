import axios from "axios"
import { refreshTokenAction } from "../actions/security/auth/refresh-token.action";
import { useAuthStore } from "../../presentation/pages/stores/authStore";

export const busesApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

// Interceptor para Agregar el Token en cada Petición
busesApi.interceptors.request.use((config) => {

    const token = localStorage.getItem('token');

    if (token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
});

// Bandera para Evitar Multiples Refresh simultáneos
let isRefreshing = false;

type FailedQueueItem = {
    resolve: (token: string) => void;
    reject: (err: unknown) => void;
};

let failedQueue: FailedQueueItem[] = [];

// Procesar la Cola de Peticiones Pendientes de Refresh
function processQueue(error: unknown, token: string | null = null) {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else if (token) {
            prom.resolve(token);
        }
    });

    failedQueue = [];
}

// Si la Respuesta es 401 (Token está Expirado), Intentar Refrescar el Token de Forma Automática
// Si el Refresh es Exitoso, Reintentar las Peticiones Originales con el Nuevo Token
// Si Falla, Realizar el LogOut y Rechazar la Petición
busesApi.interceptors.response.use(response => response, async error => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
            return new Promise(function (resolve, reject) {
                failedQueue.push({ resolve, reject });
            }).then((token) => {
                originalRequest.headers['Authorization'] = 'Bearer ' + token;
                return busesApi(originalRequest);
            }).catch(err => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const refreshToken = localStorage.getItem('refreshToken');
            const token = localStorage.getItem('token');

            if (!refreshToken || !token) throw new Error('No Refresh Token');

            const { status, data } = await refreshTokenAction({ token, refreshToken });
            if (status && data) {
                // Actualizar Tokens en el Store y LocalStorage
                useAuthStore.getState().setTokens(data.token, data.refreshToken)
                processQueue(null, data.token);
                originalRequest.headers['Authorization'] = 'Bearer' + data.token;
                return busesApi(originalRequest);
            } else {
                processQueue(error, null);
                useAuthStore.getState().logout();
                return Promise.reject(error);
            }

        } catch (err) {
            processQueue(err, null);
            useAuthStore.getState().logout();
            return Promise.reject(err);
        } finally {
            isRefreshing = false;
        }
    }
    return Promise.reject(error);
})