import type { AxiosError } from "axios";
import type { ApiResponse } from "../../../../infrastructure/interfaces/api.response";
import type { CompanyResponse } from "../../../../infrastructure/interfaces/companies.response";
import type { PageResponse } from "../../../../infrastructure/interfaces/page.response";
import { busesApi } from "../../../api/persons.api";
import type { ApiErrorResponse } from "../../../../infrastructure/interfaces/api-error.response";

export const getPaginationCompaniesAction = async (
  page = 1,
  pageSize = 10,
  searchTerm?: string
): Promise<ApiResponse<PageResponse<CompanyResponse>>> => {
  try {
    // Construimos los params manualmente
    const params = new URLSearchParams();

    params.append("page", page.toString());
    params.append("pageSize", pageSize.toString());

    if (searchTerm && searchTerm.trim() !== "") {
      params.append("searchTerm", searchTerm.trim());
    }

    const { data } = await busesApi.get<ApiResponse<PageResponse<CompanyResponse>>>(
      `/companies?${params.toString()}`
    );

    return data;
  } catch (error) {
    const apiError = error as AxiosError<ApiErrorResponse>;
    console.error("[Company Fetch Error]", apiError);

    if (apiError.response) {
      throw new Error(apiError.response.data.message);
    } else if (apiError.request) {
      throw new Error("No se pudo establecer conexión con el servidor.");
    } else {
      throw new Error("Error desconocido al obtener empresas.");
    }
  }
};