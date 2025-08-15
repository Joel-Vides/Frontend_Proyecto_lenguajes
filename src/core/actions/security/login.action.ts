import { AxiosError } from "axios";
import type { ApiResponse } from "../../../infrastructure/interfaces/api.response";
import type { LoginModel } from "../../models/login.model";
import type { ApiErrorResponse } from "../../../infrastructure/interfaces/api-error.response";
import type { LoginResponse } from "../../../infrastructure/interfaces/login.response";
import { authbusesApi } from "../../api/auth.buses.api";

export const loginAction = async (login: LoginModel): Promise<ApiResponse<LoginResponse>> => {
    try {

        const { data } = await authbusesApi.post<ApiResponse<LoginResponse>>(
            '/auth/login',
            login
        )

        return data;

    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>

        console.error(apiError);

        if (apiError.response) {

            return {
                status: false,
                message: apiError.response.data.message || "Error al Iniciar Sesión"
            };

        } else if (apiError.request) {

            return {
                status: false,
                message: "Error de Conexión"
            };

        } else {

            return {
                status: false,
                message: "Error Desconocido"
            };

        }

    }
}