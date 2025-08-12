import * as Yup from "yup";
import type { CompanyModel } from "../../../core/models/company.models";

export const companyInitialValues = {
    name: "",
    email: "",
    phoneNumber: "",
    image: null as File | null,
};

export const companyValidationSchema: Yup.ObjectSchema<CompanyModel> =
    Yup.object({
        name: Yup.string()
            .required("El nombre es requerido.")
            .min(3, "El nombre debe tener al menos 3 caracteres.")
            .max(100, "El nombre debe tener menos de 100 caracteres."),
        email: Yup.string()
            .required("El email es requerido.")
            .min(10, "El email debe tener al menos 10 caracteres.")
            .max(100, "El email debe tener menos de 100 caracteres."),
        phoneNumber: Yup.string()
            .required("El nombre es requerido.")
            .min(8, "El Número debe tener al menos 8 caracteres.")
            .max(8, "El Número debe tener menos de 8 caracteres."),
        image: Yup
            .mixed<File>()
            .nullable()
            .required("La imagen del bus es requerida")
            .test("fileSize", "La imagen debe pesar menos de 2 MB", (file) => {
                return !file || file.size <= 2 * 1024 * 1024;
            })
            .test("fileType", "Formato no soportado", (file) => {
                return !file || ["image/jpeg", "image/png", "image/webp"].includes(file.type);
            }),
    })