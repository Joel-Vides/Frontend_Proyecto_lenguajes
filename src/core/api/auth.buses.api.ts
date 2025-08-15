import axios from "axios"

export const authbusesApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});