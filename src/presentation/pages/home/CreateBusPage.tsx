import { FormikProvider, useFormik } from "formik";
import { useBuses } from "../../hooks/useBuses";
import { busInitialValues, busValidationSchema } from "../../../infrastructure/interfaces/validations/bus.validation";
import { Title } from "../../components/shared/Title";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import type { CompanyResponse } from "../../../infrastructure/interfaces/companies.response";
import { PickRouteMap } from "../../components/home/PickRouteMap";

export const CreateBusPage = () => {
  const { createBusMutation } = useBuses();
  const [companies, setEmpresas] = useState<CompanyResponse[]>([]);
  const [preview, setPreview] = useState<string>("");

  // Envío con coma decimal (no se toca tu backend)
  const toFormNumber = (v: unknown) => {
    if (v === null || v === undefined) return "";
    const n = typeof v === "number" ? v : parseFloat(String(v).replace(",", "."));
    return Number.isFinite(n) ? String(n).replace(".", ",") : "";
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/companies`)
      .then((res) => setEmpresas(res.data.data.items))
      .catch((err) => console.error("Error al cargar empresas", err));
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

      // Coordenadas con coma:
      form.append("StartLocation.Latitude",  toFormNumber(values.startLocation.latitude));
      form.append("StartLocation.Longitude", toFormNumber(values.startLocation.longitude));
      form.append("EndLocation.Latitude",    toFormNumber(values.endLocation.latitude));
      form.append("EndLocation.Longitude",   toFormNumber(values.endLocation.longitude));

      if (values.image) form.append("image", values.image);

      createBusMutation.mutate(form);
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
      setPreview("");
    }
  };

  return (
    <div className="w-full flex flex-col items-center px-4">
      <Title text="Registrar Nuevo Bus" />

      {createBusMutation.isError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mt-4 w-full max-w-2xl">
          <span>{(createBusMutation.error as Error)?.message}</span>
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
              className={`w-full px-4 py-2 border ${
                formik.errors.numeroBus && formik.touched.numeroBus ? "border-red-400" : "border-gray-300"
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
              className={`w-full px-4 py-2 border ${
                formik.errors.chofer && formik.touched.chofer ? "border-red-400" : "border-gray-300"
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
              className={`w-full px-4 py-2 border ${
                formik.errors.modelo && formik.touched.modelo ? "border-red-400" : "border-gray-300"
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
              type="number"
              id="anio"
              name="anio"
              className={`w-full px-4 py-2 border ${
                formik.errors.anio && formik.touched.anio ? "border-red-400" : "border-gray-300"
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
              className={`w-full px-4 py-2 border ${
                formik.errors.companyId && formik.touched.companyId ? "border-red-400" : "border-gray-300"
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
            <input id="image" name="image" type="file" accept="image/*" onChange={handleFileChange} className="block" />
            {formik.errors.image && formik.touched.image && (
              <p className="text-red-500 text-xs mt-2">{formik.errors.image}</p>
            )}
            {preview && <img src={preview} alt="Preview" className="mt-4 max-h-48 object-contain" />}
          </div>

          {/* MAPA: seleccionar coordenadas */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Ruta (selecciona Inicio/Destino en el mapa)
            </label>
            <PickRouteMap
              start={{
                latitude: Number(formik.values.startLocation.latitude) || 14.0818,
                longitude: Number(formik.values.startLocation.longitude) || -87.2068,
              }}
              end={{
                latitude: Number(formik.values.endLocation.latitude) || Number(formik.values.startLocation.latitude) || 14.0818,
                longitude: Number(formik.values.endLocation.longitude) || Number(formik.values.startLocation.longitude) || -87.2068,
              }}
              onChangeStart={(p) => {
                formik.setFieldValue("startLocation.latitude",  +p.latitude.toFixed(6));
                formik.setFieldValue("startLocation.longitude", +p.longitude.toFixed(6));
              }}
              onChangeEnd={(p) => {
                formik.setFieldValue("endLocation.latitude",  +p.latitude.toFixed(6));
                formik.setFieldValue("endLocation.longitude", +p.longitude.toFixed(6));
              }}
            />
          </div>

          {/* Coordenadas en solo lectura (para ver lo elegido) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">Inicio (lat, lon)</label>
              <input
                readOnly
                value={`${formik.values.startLocation.latitude ?? ""}`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
              <input
                readOnly
                value={`${formik.values.startLocation.longitude ?? ""}`}
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">Destino (lat, lon)</label>
              <input
                readOnly
                value={`${formik.values.endLocation.latitude ?? ""}`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
              <input
                readOnly
                value={`${formik.values.endLocation.longitude ?? ""}`}
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
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
