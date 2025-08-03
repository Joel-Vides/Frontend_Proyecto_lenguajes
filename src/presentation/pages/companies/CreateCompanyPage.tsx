import { FormikProvider, useFormik } from "formik";
import { useCompanies } from "../../hooks/useCompanies";
import { companyInitialValues, companyValidationSchema } from "../../../infrastructure/interfaces/validations/company.validation";
import { Title } from "../../components/shared/Title";
import { Link } from "react-router";

export const CreateCompanyPage = () => {
  const { createCompanyMutation } = useCompanies();

  const formik = useFormik({
    initialValues: companyInitialValues,
    validationSchema: companyValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (formValues) => {
      createCompanyMutation.mutate(formValues);
    },
  });

  return (
    <div className="w-full flex flex-col items-center px-4">
      <Title text="Registrar Nueva Empresa" />

      {createCompanyMutation.isError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mt-4 w-full max-w-2xl">
          <span>{createCompanyMutation.error.message}</span>
        </div>
      )}

      <FormikProvider value={formik}>
        <form
          onSubmit={formik.handleSubmit}
          className="mt-6 w-full max-w-2xl bg-white rounded-xl shadow-md p-6 border border-gray-200"
        >
          {/* Nombre */}
          <div className="mb-6">
            <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={`w-full px-4 py-2 border ${
                formik.errors.name && formik.touched.name
                  ? "border-red-400"
                  : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition`}
              value={formik.values.name}
              onChange={formik.handleChange}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-xs mt-2">{formik.errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
              Correo Electrónico
            </label>
            <input
              type="text"
              id="email"
              name="email"
              className={`w-full px-4 py-2 border ${
                formik.errors.email && formik.touched.email
                  ? "border-red-400"
                  : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition`}
              value={formik.values.email}
              onChange={formik.handleChange}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-xs mt-2">{formik.errors.email}</p>
            )}
          </div>

          {/* Número */}
          <div className="mb-6">
            <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-semibold mb-2">
              Teléfono
            </label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              className={`w-full px-4 py-2 border ${
                formik.errors.phoneNumber && formik.touched.phoneNumber
                  ? "border-red-400"
                  : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition`}
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
            />
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <p className="text-red-500 text-xs mt-2">{formik.errors.phoneNumber}</p>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              type="submit"
              className="bg-cyan-700 hover:bg-cyan-800 text-white font-semibold py-2 px-5 rounded-lg transition"
            >
              Guardar
            </button>
            <Link
              to="/companies"
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-5 rounded-lg transition"
            >
              Regresar
            </Link>
          </div>
        </form>
      </FormikProvider>
    </div>
  );
};