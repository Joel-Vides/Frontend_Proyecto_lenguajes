import type { AxiosError } from "axios"
import type { ApiResponse } from "../../../../infrastructure/interfaces/api.response"
import type { CompanyResponse } from "../../../../infrastructure/interfaces/companies.response"
import type { PageResponse } from "../../../../infrastructure/interfaces/page.response"
import { busesApi } from "../../../api/persons.api"
import type { ApiErrorResponse } from "../../../../infrastructure/interfaces/api-error.response"

export const getPaginationCompaniesAction = async (page = 1, pageSize = 10, searchTerm = ""): Promise<ApiResponse<PageResponse<CompanyResponse>>> => {
    try {
        const { data } = await busesApi.get<ApiResponse<PageResponse<CompanyResponse>>>
            (`/companies`, {
                params: {
                    page,
                    pageSize,
                    searchTerm
                }
            })

        return data;
    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;

        console.log(apiError);

        if (apiError.response) {
            throw new Error(apiError.response.data.message);
        } else if (apiError.request) {
            throw new Error("Error de Condición");
        } else {
            throw new Error("Error Desconocido");
        }
    }
}