import { AxiosError } from "axios";
import type { ApiResponse } from "../../../../infrastructure/interfaces/api.response";
import type { OneBusResponse } from "../../../../infrastructure/interfaces/one-bus.response";
import { busesApi } from "../../../api/persons.api";
import type { ApiErrorResponse } from "../../../../infrastructure/interfaces/api-error.response";

export const getOneBusAction = async (busId: string):
    Promise<ApiResponse<OneBusResponse>> => {

    try {

        const { data } = await busesApi
        .get<ApiResponse<OneBusResponse>>(`/buses/${busId}`);

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