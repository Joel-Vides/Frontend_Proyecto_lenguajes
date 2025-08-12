import { Link, useParams } from "react-router";
import { useCompanies } from "../../hooks/useCompanies";
import { FormikProvider, useFormik } from "formik";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { Title } from "../../components/shared/Title";
import { companyInitialValues, companyValidationSchema } from "../../../infrastructure/interfaces/validations/company.validation";

export const EditCompanyPage = () => {
  const { companyId } = useParams();
  const { oneCompanyQuery, editCompanyMutation } = useCompanies(companyId);
  const [preview, setPreview] = useState<string | null>(null);

  // para convertir rutas relativas a absolutas de las imágenes
  const API_BASE = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "");
  const resolveImage = (src?: string): string | null => {
    if (!src) return null;
    if (/^https?:\/\//i.test(src)) return src;
    const needsSlash = src.startsWith("/") ? "" : "/";
    return `${API_BASE}${needsSlash}${src}`;
  };

  const formik = useFormik({
    initialValues: { ...companyInitialValues, image: null as File | null } as any,
    validationSchema: companyValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values: any) => {
      if (values.image instanceof File) {
        const fd = new FormData();
        fd.append("name", values.name);
        fd.append("email", values.email);
        fd.append("phoneNumber", values.phoneNumber);
        fd.append("image", values.image);
        editCompanyMutation.mutate(fd as any);
      } else {
        editCompanyMutation.mutate({
          name: values.name,
          email: values.email,
          phoneNumber: values.phoneNumber,
        } as any);
      }
    },
  });

  useEffect(() => {
    if (oneCompanyQuery.isFetched && oneCompanyQuery.data?.data) {
      const { name, email, phoneNumber, imageUrl } = oneCompanyQuery.data.data as any;
      formik.setValues({ name, email, phoneNumber, image: null });
      setPreview(resolveImage(imageUrl));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oneCompanyQuery.isFetched, oneCompanyQuery.data]);

  if (oneCompanyQuery.isLoading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Loader className="animate-spin text-cyan-600" size={32} />
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0] ?? null;
    formik.setFieldValue("image", file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      // Si se quita la imagen se mantiene la actual del backend
      const current = resolveImage((oneCompanyQuery.data?.data as any)?.imageUrl);
      setPreview(current ?? null);
    }
  };

  return (
    <div className="w-full flex flex-col items-center px-4">
      <Title text="Editar Empresa" />

      {editCompanyMutation.isError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mt-4 w-full max-w-2xl">
          <span>{(editCompanyMutation.error as any).message}</span>
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

          {/* Correo */}
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
              Logo / Imagen
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
