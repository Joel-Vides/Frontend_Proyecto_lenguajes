import axios from "axios"

export const busesApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});