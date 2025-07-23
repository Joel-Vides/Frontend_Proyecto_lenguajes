import type { AxiosError } from "axios";
import type { ApiResponse } from "../../../../infrastructure/interfaces/api.response";
import { busesApi } from "../../../api/persons.api";
import type { ApiErrorResponse } from "../../../../infrastructure/interfaces/api-error.response";
import type { CompanyResponse } from "../../../../infrastructure/interfaces/companies.response";

export const deleteCompanyAction = async (
    companyId: string
): Promise<ApiResponse<CompanyResponse>> => {

    try {

        const { data } = await busesApi
            .delete<ApiResponse<CompanyResponse>>(
                `/companies/${companyId}`
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