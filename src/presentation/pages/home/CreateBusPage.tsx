import { FormikProvider, useFormik } from "formik";
import { useBuses } from "../../hooks/useBuses";
import { busInitialValues, busValidationSchema } from "../../../infrastructure/interfaces/validations/bus.validation";
import { Title } from "../../components/shared/Title";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import type { CompanyResponse } from "../../../infrastructure/interfaces/companies.response";

export const CreateBusPage = () => {
  const { createBusMutation } = useBuses();
  const [companies, setEmpresas] = useState<CompanyResponse[]>([]);
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/companies`)
      .then(res => {
        console.log("Empresas recibidas:", res.data);
        setEmpresas(res.data.data.items);
      })
      .catch(err => console.error("Error al cargar empresas", err));
  }, []);

  const formik = useFormik({
    initialValues: busInitialValues,
    validationSchema: busValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      const form = new FormData();

      form.append("numeroBus", values.numeroBus);
      form.append("chofer", values.chofer);
      form.append("modelo", values.modelo);
      form.append("anio", String(values.anio));
      form.append("companyId", values.companyId);

      form.append("StartLocation.Latitude", String(values.startLocation.latitude));
      form.append("StartLocation.Longitude", String(values.startLocation.longitude));
      form.append("EndLocation.Latitude", String(values.endLocation.latitude));
      form.append("EndLocation.Longitude", String(values.endLocation.longitude));

      if (values.image) form.append("image", values.image); // el archivo

      createBusMutation.mutate(form);
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0] ?? null;
    formik.setFieldValue("image", file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview("");
    }
  };

  return (
    <div className="w-full flex flex-col items-center px-4">
      <Title text="Registrar Nuevo Bus" />

      {createBusMutation.isError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mt-4 w-full max-w-2xl">
          <span>{createBusMutation.error.message}</span>
        </div>
      )}

      <FormikProvider value={formik}>
        <form
          onSubmit={formik.handleSubmit}
          className="mt-6 w-full max-w-2xl bg-white rounded-xl shadow-md p-6 border border-gray-200"
        >
          {/* Número del Bus */}
          <div className="mb-6">
            <label htmlFor="numeroBus" className="block text-gray-700 text-sm font-semibold mb-2">
              Número del Bus
            </label>
            <input
              type="text"
              id="numeroBus"
              name="numeroBus"
              className={`w-full px-4 py-2 border ${formik.errors.numeroBus && formik.touched.numeroBus ? "border-red-400" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition`}
              value={formik.values.numeroBus}
              onChange={formik.handleChange}
            />
            {formik.touched.numeroBus && formik.errors.numeroBus && (
              <p className="text-red-500 text-xs mt-2">{formik.errors.numeroBus}</p>
            )}
          </div>

          {/* Chofer */}
          <div className="mb-6">
            <label htmlFor="chofer" className="block text-gray-700 text-sm font-semibold mb-2">
              Chofer
            </label>
            <input
              type="text"
              id="chofer"
              name="chofer"
              className={`w-full px-4 py-2 border ${formik.errors.chofer && formik.touched.chofer ? "border-red-400" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition`}
              value={formik.values.chofer}
              onChange={formik.handleChange}
            />
            {formik.touched.chofer && formik.errors.chofer && (
              <p className="text-red-500 text-xs mt-2">{formik.errors.chofer}</p>
            )}
          </div>

          {/* Modelo */}
          <div className="mb-6">
            <label htmlFor="modelo" className="block text-gray-700 text-sm font-semibold mb-2">
              Modelo
            </label>
            <input
              type="text"
              id="modelo"
              name="modelo"
              className={`w-full px-4 py-2 border ${formik.errors.modelo && formik.touched.modelo ? "border-red-400" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition`}
              value={formik.values.modelo}
              onChange={formik.handleChange}
            />
            {formik.touched.modelo && formik.errors.modelo && (
              <p className="text-red-500 text-xs mt-2">{formik.errors.modelo}</p>
            )}
          </div>

          {/* Año */}
          <div className="mb-6">
            <label htmlFor="anio" className="block text-gray-700 text-sm font-semibold mb-2">
              Año
            </label>
            <input
              type="text"
              id="anio"
              name="anio"
              className={`w-full px-4 py-2 border ${formik.errors.anio && formik.touched.anio ? "border-red-400" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition`}
              value={formik.values.anio}
              onChange={formik.handleChange}
            />
            {formik.touched.anio && formik.errors.anio && (
              <p className="text-red-500 text-xs mt-2">{formik.errors.anio}</p>
            )}
          </div>

          {/* Empresa */}
          <div className="mb-6">
            <label htmlFor="companyId" className="block text-gray-700 text-sm font-semibold mb-2">
              Empresa
            </label>
            <select
              id="companyId"
              name="companyId"
              value={formik.values.companyId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-2 border ${formik.errors.companyId && formik.touched.companyId ? "border-red-400" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition`}
              required
            >
              <option value="">Seleccione una empresa</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
            {formik.touched.companyId && formik.errors.companyId && (
              <p className="text-red-500 text-xs mt-2">{formik.errors.companyId}</p>
            )}
          </div>

          {/* Imagen */}
          <div className="mb-6">
            <label htmlFor="image" className="block text-gray-700 text-sm font-semibold mb-2">
              Imagen del Bus
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block"
            />
            {formik.errors.image && formik.touched.image && (
              <p className="text-red-500 text-xs mt-2">{formik.errors.image}</p>
            )}
            {preview && (
              <img src={preview} alt="Preview" className="mt-4 max-h-48 object-contain" />
            )}
          </div>

          {/* Latitud de Inicio */}
          <div className="mb-6">
            <label htmlFor="startLocation.latitude" className="block text-gray-700 text-sm font-semibold mb-2">
              Latitud de Inicio
            </label>
            <input
              type="number"
              id="startLocation.latitude"
              name="startLocation.latitude"
              className={`w-full px-4 py-2 border ${formik.errors.startLocation?.latitude && formik.touched.startLocation?.latitude
                ? "border-red-400"
                : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition`}
              value={formik.values.startLocation.latitude}
              onChange={formik.handleChange}
            />
            {formik.touched.startLocation?.latitude && formik.errors.startLocation?.latitude && (
              <p className="text-red-500 text-xs mt-2">{formik.errors.startLocation.latitude}</p>
            )}
          </div>

          {/* Longitud de Inicio */}
          <div className="mb-6">
            <label htmlFor="startLocation.longitude" className="block text-gray-700 text-sm font-semibold mb-2">
              Longitud de Inicio
            </label>
            <input
              type="number"
              id="startLocation.longitude"
              name="startLocation.longitude"
              className={`w-full px-4 py-2 border ${formik.errors.startLocation?.longitude && formik.touched.startLocation?.longitude
                ? "border-red-400"
                : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition`}
              value={formik.values.startLocation.longitude}
              onChange={formik.handleChange}
            />
            {formik.touched.startLocation?.longitude && formik.errors.startLocation?.longitude && (
              <p className="text-red-500 text-xs mt-2">{formik.errors.startLocation.longitude}</p>
            )}
          </div>

          {/* Latitud de Destino */}
          <div className="mb-6">
            <label htmlFor="endLocation.latitude" className="block text-gray-700 text-sm font-semibold mb-2">
              Latitud de Destino
            </label>
            <input
              type="number"
              id="endLocation.latitude"
              name="endLocation.latitude"
              className={`w-full px-4 py-2 border ${formik.errors.endLocation?.latitude && formik.touched.endLocation?.latitude
                ? "border-red-400"
                : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition`}
              value={formik.values.endLocation.latitude}
              onChange={formik.handleChange}
            />
            {formik.touched.endLocation?.latitude && formik.errors.endLocation?.latitude && (
              <p className="text-red-500 text-xs mt-2">{formik.errors.endLocation.latitude}</p>
            )}
          </div>

          {/* Longitud de Destino */}
          <div className="mb-6">
            <label htmlFor="endLocation.longitude" className="block text-gray-700 text-sm font-semibold mb-2">
              Longitud de Destino
            </label>
            <input
              type="number"
              id="endLocation.longitude"
              name="endLocation.longitude"
              className={`w-full px-4 py-2 border ${formik.errors.endLocation?.longitude && formik.touched.endLocation?.longitude
                ? "border-red-400"
                : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition`}
              value={formik.values.endLocation.longitude}
              onChange={formik.handleChange}
            />
            {formik.touched.endLocation?.longitude && formik.errors.endLocation?.longitude && (
              <p className="text-red-500 text-xs mt-2">{formik.errors.endLocation.longitude}</p>
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
              to="/"
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