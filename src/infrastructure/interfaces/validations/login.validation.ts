import * as Yup from "yup";
import type { LoginModel } from "../../../core/models/login.model";

export const loginInitialValues: LoginModel = {
    email: "",
    password: ""
}

export const loginValidationSchema: Yup.ObjectSchema<LoginModel> = Yup.object({
    email: Yup.string().required('El Correo Electrónico es Requerido').
    email('El Correo Electrónico debe ser Válido'),
    password: Yup.string().required('La Contraseña es Requerida')
})