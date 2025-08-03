import * as Yup from "yup";
import type { BusModel } from "../../../core/models/bus.models";

export const busInitialValues: BusModel = {
  numeroBus: "",
  chofer: "",
  modelo: "",
  anio: 2023,
  startLocation: {
    latitude: 0,
    longitude: 0,
  },
  endLocation: {
    latitude: 0,
    longitude: 0,
  },
};

export const busValidationSchema: Yup.ObjectSchema<BusModel> = Yup.object({
  numeroBus: Yup.string()
    .required("El Número del Bus es Requerido")
    .min(3, "El Número debe tener al menos 3 caracteres.")
    .max(10, "El Número debe tener menos de 10 caracteres."),

  chofer: Yup.string()
    .required("El Nombre del Chófer es requerido.")
    .min(3, "El Nombre del Chófer debe tener al menos 3 caracteres")
    .max(50, "El nombre debe tener menos de 50 caracteres."),

  modelo: Yup.string()
    .required("El Modelo es requerido.")
    .min(3, "El Modelo debe tener al menos 3 caracteres")
    .max(100, "El Modelo debe tener menos de 100 caracteres."),

  anio: Yup.number()
    .required("El Año es requerido")
    .test("len", "El año debe tener exactamente 4 cifras", value => {
      return !!value && value.toString().length === 4;
    })
    .min(1900, "El año debe ser mayor a 1900")
    .max(2100, "El año debe ser menor o igual a 2100"),

  startLocation: Yup.object().shape({
    latitude: Yup.number().required("La Latitud de inicio es requerida"),
    longitude: Yup.number().required("La Longitud de inicio es requerida"),
  }),

  endLocation: Yup.object().shape({
    latitude: Yup.number().required("La Latitud de destino es requerida"),
    longitude: Yup.number().required("La Longitud de destino es requerida"),
  }),
});