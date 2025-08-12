import { useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { FormikProvider, useFormik } from "formik";
import { Loader } from "lucide-react";
import { Title } from "../../components/shared/Title";
import { useBuses } from "../../hooks/useBuses";
import { PickRouteMap } from "../../components/home/PickRouteMap";

// Convirtiendo a Número para las Coordenadas
const toNum = (v: unknown) => {
    if (v === null || v === undefined || v === "") return NaN;
    const s = String(v).trim().replace(",", ".");
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : NaN;
};

// Enviar con Coma Decimal Coordenadas
const toFormNumber = (v: unknown) => {
    if (v === null || v === undefined || v === "") return "";
    const n = typeof v === "number" ? v : toNum(v);
    return Number.isFinite(n) ? String(n).replace(".", ",") : "";
};

export const EditRouteBusPage = () => {
    const { busId } = useParams();
    const navigate = useNavigate();
    const { oneBusQuery, editBusMutation } = useBuses(busId);

    const formik = useFormik({
        // Campos Obligatorios no se Muestran en el formulario
        initialValues: {
            numeroBus: "",
            chofer: "",
            modelo: "",
            anio: 0,
            companyId: "",
            startLocation: { latitude: 14.0818, longitude: -87.2068 },
            endLocation: { latitude: 14.0818, longitude: -87.2068 },
        },
        onSubmit: async (values) => {
            const form = new FormData();
            // Campos Obligatorios no se Muestran en el formulario
            form.append("numeroBus", values.numeroBus);
            form.append("chofer", values.chofer);
            form.append("modelo", values.modelo);
            form.append("anio", String(values.anio));
            form.append("companyId", values.companyId);

            // Coordenadas actualizadas
            form.append("StartLocation.Latitude", toFormNumber(values.startLocation.latitude));
            form.append("StartLocation.Longitude", toFormNumber(values.startLocation.longitude));
            form.append("EndLocation.Latitude", toFormNumber(values.endLocation.latitude));
            form.append("EndLocation.Longitude", toFormNumber(values.endLocation.longitude));

            // @ts-expect-error: la acción admite FormData en runtime
            editBusMutation.mutate(form, {
                onSuccess: () => navigate("/"),
            });
        },
    });

    // Cargar datos actuales del bus
    useEffect(() => {
        const b = oneBusQuery.data?.data;
        if (!b) return;

        formik.setValues({
            numeroBus: b.numeroBus ?? "",
            chofer: b.chofer ?? "",
            modelo: b.modelo ?? "",
            anio: b.anio ?? 0,
            companyId: b.companyId ?? "",
            startLocation: {
                latitude: toNum(b.startLocation?.latitude) || 14.0818,
                longitude: toNum(b.startLocation?.longitude) || -87.2068,
            },
            endLocation: {
                latitude:
                    toNum(b.endLocation?.latitude) ||
                    toNum(b.startLocation?.latitude) ||
                    14.0818,
                longitude:
                    toNum(b.endLocation?.longitude) ||
                    toNum(b.startLocation?.longitude) ||
                    -87.2068,
            },
        });

    }, [oneBusQuery.isFetched, oneBusQuery.data]);

    if (oneBusQuery.isLoading) {
        return (
            <div className="flex justify-center items-center h-[300px]">
                <Loader className="animate-spin text-cyan-600" size={32} />
            </div>
        );
    }

    const bus = oneBusQuery.data?.data;

    return (
        <div className="w-full flex flex-col items-center px-4">
            <Title text="Editar ruta del bus" />

            {!bus ? (
                <div className="mt-6 bg-red-50 text-red-700 border border-red-200 rounded p-4 w-full max-w-3xl">
                    No se pudo cargar la información del bus.
                </div>
            ) : (
                <FormikProvider value={formik}>
                    <form
                        onSubmit={formik.handleSubmit}
                        className="mt-6 w-full max-w-3xl bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-6"
                    >
                        {/* Encabezado con info */}
                        <div className="flex items-center justify-between border-b pb-3">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Bus {bus.numeroBus} · {bus.modelo} · {bus.chofer}
                            </h2>
                            <span className="text-sm text-gray-500">Año {bus.anio}</span>
                        </div>

                        {/* Mapa para editar ruta */}
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">
                                Selecciona Inicio/Destino en el mapa
                            </label>

                            <PickRouteMap
                                start={formik.values.startLocation}
                                end={formik.values.endLocation}
                                onChangeStart={(p) => {
                                    formik.setFieldValue(
                                        "startLocation",
                                        { latitude: +p.latitude.toFixed(6), longitude: +p.longitude.toFixed(6) },
                                        true
                                    );
                                }}
                                onChangeEnd={(p) => {
                                    formik.setFieldValue(
                                        "endLocation",
                                        { latitude: +p.latitude.toFixed(6), longitude: +p.longitude.toFixed(6) },
                                        true
                                    );
                                }}
                            />
                        </div>

                        {/* Coordenadas elegidas */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-700">Inicio</p>
                                <input
                                    readOnly
                                    value={formik.values.startLocation.latitude}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                />
                                <input
                                    readOnly
                                    value={formik.values.startLocation.longitude}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                />
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-700">Destino</p>
                                <input
                                    readOnly
                                    value={formik.values.endLocation.latitude}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                />
                                <input
                                    readOnly
                                    value={formik.values.endLocation.longitude}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                />
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex justify-center gap-4 pt-2">
                            <button
                                type="submit"
                                className="bg-cyan-700 hover:bg-cyan-800 text-white font-semibold py-2 px-5 rounded-lg transition"
                            >
                                Guardar ruta
                            </button>
                            <Link
                                to="/"
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-5 rounded-lg transition"
                            >
                                Cancelar
                            </Link>
                        </div>
                    </form>
                </FormikProvider>
            )}
        </div>
    );
};
