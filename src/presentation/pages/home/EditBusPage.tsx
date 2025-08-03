import { Link, useParams, useNavigate } from "react-router";
import { useBuses } from "../../hooks/useBuses";
import { FormikProvider, useFormik } from "formik";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Title } from "../../components/shared/Title";
import {
  busInitialValues,
  busValidationSchema,
} from "../../../infrastructure/interfaces/validations/bus.validation";

export const EditBusPage = () => {
  const { busId } = useParams();
  const navigate = useNavigate(); // 💫 Magia de navegación
  const { oneBusQuery, editBusMutation } = useBuses(busId);

  const formik = useFormik({
    initialValues: busInitialValues,
    validationSchema: busValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (formValues) => {
      editBusMutation.mutate(formValues, {
        onSuccess: () => {
          navigate("/"); // 🏠 Navegando directo al HomePage
        },
      });
    },
  });

  useEffect(() => {
    if (oneBusQuery.isFetched && oneBusQuery.data?.data) {
      const {
        numeroBus = "",
        chofer = "",
        modelo = "",
        anio = 0,
        startLocation = { latitude: 0, longitude: 0 },
        endLocation = { latitude: 0, longitude: 0 },
      } = oneBusQuery.data.data;

      formik.setValues({
        numeroBus,
        chofer,
        modelo,
        anio,
        startLocation,
        endLocation,
      });
    }
  }, [oneBusQuery.isFetched, oneBusQuery.data]);

  if (oneBusQuery.isLoading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Loader className="animate-spin text-cyan-600" size={32} />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center px-4">
      <Title text="Editar Bus" />

      {editBusMutation.isError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mt-4 w-full max-w-2xl">
          <span>{editBusMutation.error.message}</span>
        </div>
      )}

      <FormikProvider value={formik}>
        <form
          onSubmit={formik.handleSubmit}
          className="mt-6 w-full max-w-2xl bg-white rounded-xl shadow-md p-6 border border-gray-200"
        >
          {/* Número de Bus */}
          <div className="mb-6">
            <label htmlFor="numeroBus" className="block text-gray-700 text-sm font-semibold mb-2">Número de Bus</label>
            <input
              type="text"
              id="numeroBus"
              name="numeroBus"
              className={`w-full px-4 py-2 border ${formik.errors.numeroBus && formik.touched.numeroBus ? "border-red-400" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition`}
              value={formik.values.numeroBus}
              onChange={formik.handleChange}
            />
            {formik.touched.numeroBus && formik.errors.numeroBus && (
              <p className="text-red-500 text-xs mt-2">{formik.errors.numeroBus}</p>
            )}
          </div>

          {/* Chofer */}
          <div className="mb-6">
            <label htmlFor="chofer" className="block text-gray-700 text-sm font-semibold mb-2">Chofer</label>
            <input
              type="text"
              id="chofer"
              name="chofer"
              className={`w-full px-4 py-2 border ${formik.errors.chofer && formik.touched.chofer ? "border-red-400" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition`}
              value={formik.values.chofer}
              onChange={formik.handleChange}
            />
            {formik.touched.chofer && formik.errors.chofer && (
              <p className="text-red-500 text-xs mt-2">{formik.errors.chofer}</p>
            )}
          </div>

          {/* Modelo */}
          <div className="mb-6">
            <label htmlFor="modelo" className="block text-gray-700 text-sm font-semibold mb-2">Modelo</label>
            <input
              type="text"
              id="modelo"
              name="modelo"
              className={`w-full px-4 py-2 border ${formik.errors.modelo && formik.touched.modelo ? "border-red-400" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition`}
              value={formik.values.modelo}
              onChange={formik.handleChange}
            />
            {formik.touched.modelo && formik.errors.modelo && (
              <p className="text-red-500 text-xs mt-2">{formik.errors.modelo}</p>
            )}
          </div>

          {/* Año */}
          <div className="mb-6">
            <label htmlFor="anio" className="block text-gray-700 text-sm font-semibold mb-2">Año</label>
            <input
              type="number"
              id="anio"
              name="anio"
              className={`w-full px-4 py-2 border ${formik.errors.anio && formik.touched.anio ? "border-red-400" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition`}
              value={formik.values.anio}
              onChange={formik.handleChange}
            />
            {formik.touched.anio && formik.errors.anio && (
              <p className="text-red-500 text-xs mt-2">{formik.errors.anio}</p>
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