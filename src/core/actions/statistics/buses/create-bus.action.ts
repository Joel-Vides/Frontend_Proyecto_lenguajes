// core/actions/statistics/buses/create-bus.action.ts
import { AxiosError } from "axios";
import type { ApiResponse } from "../../../../infrastructure/interfaces/api.response";
import { busesApi } from "../../../api/persons.api";
import type { ApiErrorResponse } from "../../../../infrastructure/interfaces/api-error.response";
import type { BusResponse } from "../../../../infrastructure/interfaces/buses.response";

export const createBusAction = async (
  form: FormData
): Promise<ApiResponse<BusResponse>> => {
  try {
    const { data } = await busesApi.post<ApiResponse<BusResponse>>(
      "/buses",
      form
      
    );
    return data;
  } catch (error) {
    const apiError = error as AxiosError<ApiErrorResponse>;
    if (apiError.response) throw new Error(apiError.response.data.message);
    if (apiError.request) throw new Error("Error de conexión.");
    throw new Error("Error desconocido.");
  }
};
