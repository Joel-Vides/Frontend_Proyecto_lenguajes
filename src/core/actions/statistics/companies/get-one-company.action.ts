import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "../../../../infrastructure/interfaces/api-error.response";
import type { ApiResponse } from "../../../../infrastructure/interfaces/api.response";
import type { OneCompanyResponse } from "../../../../infrastructure/interfaces/one-company.response";
import { busesApi } from "../../../api/persons.api";

export const getOneCompanyAction = async (companyId: string):
    Promise<ApiResponse<OneCompanyResponse>> => {

    try {

        const { data } = await busesApi
        .get<ApiResponse<OneCompanyResponse>>(`/companies/${companyId}`);

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