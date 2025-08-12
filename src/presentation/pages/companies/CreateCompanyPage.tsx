import { FormikProvider, useFormik } from "formik";
import { useCompanies } from "../../hooks/useCompanies";
import { companyInitialValues, companyValidationSchema } from "../../../infrastructure/interfaces/validations/company.validation";
import { Title } from "../../components/shared/Title";
import { Link } from "react-router";
import { useState } from "react";

export const CreateCompanyPage = () => {
  const { createCompanyMutation } = useCompanies();
  const [preview, setPreview] = useState<string | null>(null);

  const formik = useFormik({
    // Para añadir la Imagen si tocar los initialValues
    initialValues: { ...companyInitialValues, image: null as File | null } as any,
    validationSchema: companyValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values: any) => {
      // si hay archivo: FormData; si no: JSON
      if (values.image instanceof File) {
        const fd = new FormData();
        fd.append("name", values.name);
        fd.append("email", values.email);
        fd.append("phoneNumber", values.phoneNumber);
        fd.append("image", values.image);
        createCompanyMutation.mutate(fd as any);
      } else {
        createCompanyMutation.mutate({
          name: values.name,
          email: values.email,
          phoneNumber: values.phoneNumber,
        } as any);
      }
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0] ?? null;
    formik.setFieldValue("image", file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  return (
    <div className="w-full flex flex-col items-center px-4">
      <Title text="Registrar Nueva Empresa" />

      {createCompanyMutation.isError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mt-4 w-full max-w-2xl">
          <span>{(createCompanyMutation.error as any).message}</span>
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
              className={`w-full px-4 py-2 border ${formik.errors.name && formik.touched.name ? "border-red-400" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition`}
              value={formik.values.name}
              onChange={formik.handleChange}
            />
            {formik.touched.name && (formik.errors as any).name && (
              <p className="text-red-500 text-xs mt-2">{(formik.errors as any).name}</p>
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
              className={`w-full px-4 py-2 border ${formik.errors.email && formik.touched.email ? "border-red-400" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition`}
              value={formik.values.email}
              onChange={formik.handleChange}
            />
            {formik.touched.email && (formik.errors as any).email && (
              <p className="text-red-500 text-xs mt-2">{(formik.errors as any).email}</p>
            )}
          </div>

          {/* Teléfono */}
          <div className="mb-6">
            <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-semibold mb-2">
              Teléfono
            </label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              className={`w-full px-4 py-2 border ${formik.errors.phoneNumber && formik.touched.phoneNumber ? "border-red-400" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition`}
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
            />
            {formik.touched.phoneNumber && (formik.errors as any).phoneNumber && (
              <p className="text-red-500 text-xs mt-2">{(formik.errors as any).phoneNumber}</p>
            )}
          </div>

          {/* Imagen */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Logo / Imagen (opcional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0 file:text-sm file:font-semibold
                        file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
            />
            {preview && (
              <div className="mt-3">
                <img src={preview} className="h-28 rounded-md border object-cover" />
              </div>
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
