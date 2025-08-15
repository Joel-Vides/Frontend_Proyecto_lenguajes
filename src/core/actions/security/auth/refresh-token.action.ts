import { AxiosError } from "axios";
import type { ApiResponse } from "../../../../infrastructure/interfaces/api.response";
import type { ApiErrorResponse } from "../../../../infrastructure/interfaces/api-error.response";
import { authbusesApi } from "../../../api/auth.buses.api";
import type { RefreshTokenModel } from "../../../models/refresh-token.model";
import type { RefreshTokenResponse } from "../../../../infrastructure/interfaces/refresh-token.response";

export const refreshTokenAction = async (refreshTokenModel: RefreshTokenModel): Promise<ApiResponse<RefreshTokenResponse>> => {
    try {

        const { data } = await authbusesApi.post<ApiResponse<RefreshTokenResponse>>(
            '/auth/refresh-token',
            refreshTokenModel
        )

        return data;

    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>

        console.error(apiError);

        if (apiError.response) {

            return {
                status: false,
                message: apiError.response.data.message || "Falló la Actualización del Token"
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