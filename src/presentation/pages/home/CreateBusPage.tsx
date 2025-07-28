import { FormikProvider, useFormik } from "formik";
import { useBuses } from "../../hooks/useBuses";
import { busInitialValues, busValidationSchema } from "../../../infrastructure/interfaces/validations/bus.validation";
import { Title } from "../../components/shared/Title";
import { Link } from "react-router";

export const CreateBusPage = () => {

    const { createBusMutation } = useBuses();

    const formik = useFormik({
        initialValues: busInitialValues,
        validationSchema: busValidationSchema,
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: async (formValues) => {
            // console.log(formValues);
            createBusMutation.mutate(formValues);
        }
    })

    return (
        <div className="w-full flex flex-col">
            <Title text="Crear País" />

            {createBusMutation.isError && (
                <div className="bg-red-200 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <span>{createBusMutation.error.message}</span>
                </div>
            )}

            <FormikProvider value={formik} >
                <form onSubmit={formik.handleSubmit} className="mt-6 w-full">
                    <div className="mb-4">
                        <label htmlFor="numeroBus" className="block text-gray-700 text-sm font-bold mb-2">
                            Número del Bus
                        </label>
                        <input
                            type="text"
                            id="numeroBus"
                            name="numeroBus"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-cyan-500 leading-tight focus:outline-none"
                            value={formik.values.numeroBus}
                            onChange={formik.handleChange}
                        />
                        {formik.touched.numeroBus && formik.errors.numeroBus && (
                            <div className="text-red-500 text-xs mt-1">
                                {formik.errors.numeroBus}
                            </div>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="chofer" className="block text-gray-700 text-sm font-bold mb-2">
                            Chofer
                        </label>
                        <input
                            type="text"
                            id="chofer"
                            name="chofer"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-cyan-500 leading-tight focus:outline-none"
                            value={formik.values.chofer}
                            onChange={formik.handleChange}
                        />
                        {formik.touched.chofer && formik.errors.chofer && (
                            <div className="text-red-500 text-xs mt-1">
                                {formik.errors.chofer}
                            </div>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="modelo" className="block text-gray-700 text-sm font-bold mb-2">
                            Modelo
                        </label>
                        <input
                            type="text"
                            id="modelo"
                            name="modelo"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-cyan-500 leading-tight focus:outline-none"
                            value={formik.values.modelo}
                            onChange={formik.handleChange}
                        />
                        {formik.touched.modelo && formik.errors.modelo && (
                            <div className="text-red-500 text-xs mt-1">
                                {formik.errors.modelo}
                            </div>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="anio" className="block text-gray-700 text-sm font-bold mb-2">
                            Año
                        </label>
                        <input
                            type="text"
                            id="anio"
                            name="anio"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-cyan-500 leading-tight focus:outline-none"
                            value={formik.values.anio}
                            onChange={formik.handleChange}
                        />
                        {formik.touched.anio && formik.errors.anio && (
                            <div className="text-red-500 text-xs mt-1">
                                {formik.errors.anio}
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
                            to="/"
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
