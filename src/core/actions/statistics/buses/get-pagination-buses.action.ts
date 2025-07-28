import { AxiosError } from "axios";
import type { ApiResponse } from "../../../../infrastructure/interfaces/api.response";
import type { PageResponse } from "../../../../infrastructure/interfaces/page.response";
import type { BusResponse } from "../../../../infrastructure/interfaces/buses.response";
import { busesApi } from "../../../api/persons.api";
import type { ApiErrorResponse } from "../../../../infrastructure/interfaces/api-error.response";

export const getPaginationBusesAction = async (page = 1, pageSize = 10, searchTerm = ""): Promise<ApiResponse<PageResponse<BusResponse>>> => {
    try {

        const { data } = await busesApi.get<ApiResponse<PageResponse<BusResponse>>>
        (`/buses`, {
            params: {
                page,
                pageSize,
                searchTerm
            }
        });

        return data;
    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;

        console.error(apiError);

        if (apiError.response) {
            throw new Error(apiError.response.data.message);
        } else if (apiError.request) {
            throw new Error("Error de Condición");
        } else {
            throw new Error("Error Desconocido");
        }

    }
}