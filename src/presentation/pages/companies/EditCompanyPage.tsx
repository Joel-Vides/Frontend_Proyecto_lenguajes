import { Link, useParams } from "react-router";
import { useCompanies } from "../../hooks/useCompanies";
import { FormikProvider, useFormik } from "formik";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Title } from "../../components/shared/Title";
import { companyInitialValues, companyValidationSchema } from "../../../infrastructure/interfaces/validations/company.validation";

export const EditCompanyPage = () => {

  const { companyId } = useParams();

  // console.log(countryId);

  const { oneCompanyQuery, editCompanyMutation } = useCompanies(companyId);

  const formik = useFormik({
    initialValues: companyInitialValues,
    validationSchema: companyValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (formValues) => {
      editCompanyMutation.mutate(formValues);
    }
  });

  useEffect(() => {
    if (oneCompanyQuery.isFetched && oneCompanyQuery.data?.data) {
      const { name, email, phoneNumber } = oneCompanyQuery.data.data;

      formik.setValues({
        name: name,
        email: email,
        phoneNumber: phoneNumber
      });
    }
  }, [oneCompanyQuery.isFetched, oneCompanyQuery.data]);

  if (oneCompanyQuery.isLoading) {
    return <Loader />
  }

  return (
    <div className="w-full flex flex-col">
      <Title text="Editar Empresa" />

      {editCompanyMutation.isError && (
        <div className="bg-red-200 border border-red-400 text-red-700 px-4 py-3 rounded">
          <span>{editCompanyMutation.error.message}</span>
        </div>
      )}

      <FormikProvider value={formik} >
        <form onSubmit={formik.handleSubmit} className="mt-6 w-full">
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-cyan-500 leading-tight focus:outline-none"
              value={formik.values.name}
              onChange={formik.handleChange}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.name}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Correo Electrónico
            </label>
            <input
              type="text"
              id="email"
              name="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-cyan-500 leading-tight focus:outline-none"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.email}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">
              Número
            </label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-cyan-500 leading-tight focus:outline-none"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
            />
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.phoneNumber}
              </div>
            )}
          </div>

          <div className="flex items-center content-center justify-center gap-2">
            <button
              type="submit"
              className="bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-2 px-4 rounded focus:outline-none"
            >
              Guardar
            </button>

            <Link
              to="/companies"
              className="bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-2 px-4 rounded focus:outline-none"
            >
              Regresar
            </Link>
          </div>

        </form>
      </FormikProvider>

    </div>
  )
}
