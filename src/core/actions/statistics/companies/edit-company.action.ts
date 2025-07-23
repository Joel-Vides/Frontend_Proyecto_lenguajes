import type { AxiosError } from "axios";
import type { ApiResponse } from "../../../../infrastructure/interfaces/api.response";
import { busesApi } from "../../../api/persons.api";
import type { CompanyModel } from "../../../models/company.models";
import type { ApiErrorResponse } from "../../../../infrastructure/interfaces/api-error.response";

export const editCompanyAction = async (
    company: CompanyModel, companyId: string
): Promise<ApiResponse<CompanyModel>> => {

    try {

        const { data } = await busesApi
            .put<ApiResponse<CompanyModel>>(
                `/companies/${companyId}`,
                company
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