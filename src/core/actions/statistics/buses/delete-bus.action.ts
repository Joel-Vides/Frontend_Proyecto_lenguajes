import { AxiosError } from "axios";
import type { ApiResponse } from "../../../../infrastructure/interfaces/api.response";
import type { BusResponse } from "../../../../infrastructure/interfaces/buses.response";
import { busesApi } from "../../../api/persons.api";
import type { ApiErrorResponse } from "../../../../infrastructure/interfaces/api-error.response";

export const deleteBusAction = async (
    busId: string
): Promise<ApiResponse<BusResponse>> => {

    try {

        const { data } = await busesApi
            .delete<ApiResponse<BusResponse>>(
                `/buses/${busId}`
            );

        return data;

    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;

        if (apiError.response) {
            throw new Error(apiError.response.data.message)
        } else if (apiError.request) {
            throw new Error("Error de conexión.")
        } else {
            throw new Error("Error desconocido.")
        }
    }

}