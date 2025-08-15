import { useEffect } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router";
import { FormikProvider, useFormik } from "formik";
import { Title } from "../../components/shared/Title";
import { useBuses } from "../../hooks/useBuses";
import { Loader, Ticket as TicketIcon, Check } from "lucide-react";

/** Utils */
const toLocalDT = (d: Date) =>
    new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16); // "YYYY-MM-DDTHH:mm" (para <input type="datetime-local">)

const toISO = (s: string) => new Date(s).toISOString();

const API = import.meta.env.VITE_API_URL;
const API_BASE = API.replace(/\/api\/?$/, "");
const resolveImage = (src?: string) => {
    if (!src) return undefined;
    if (/^https?:\/\//i.test(src)) return src;
    return `${API_BASE}${src.startsWith("/") ? "" : "/"}${src}`;
};

/** Tipos mínimos */
type OneBus = {
    id: string;
    numeroBus: string;
    chofer?: string;
    modelo?: string;
    anio?: number;
    imageUrl?: string;
};

type TripInfo = {
    sitioSalida: string;
    horarioSalidaISO: string; // ISO completo
    horarioLlegadaISO: string; // ISO completo
    precio?: number;
};

export const BuyTicketPage = () => {
    const { busId } = useParams();
    const navigate = useNavigate();
    const location = useLocation() as { state?: { trip?: TripInfo } };

    // Bus seleccionado
    const { oneBusQuery } = useBuses(busId);
    const bus = oneBusQuery.data?.data as OneBus | undefined;

    // Viaje desde DTOs relacionados (si llegan por state); si no, valores por defecto
    const now = new Date();
    const defaultSalida = new Date(now.getTime() + 30 * 60000);
    const defaultLlegada = new Date(now.getTime() + 120 * 60000);

    const trip = location.state?.trip;
    const sitioSalidaRD = trip?.sitioSalida ?? "Por definir";
    const horarioSalidaRD = trip?.horarioSalidaISO
        ? toLocalDT(new Date(trip.horarioSalidaISO))
        : toLocalDT(defaultSalida);
    const horarioLlegadaRD = trip?.horarioLlegadaISO
        ? toLocalDT(new Date(trip.horarioLlegadaISO))
        : toLocalDT(defaultLlegada);
    const precioRD = typeof trip?.precio === "number" ? trip!.precio : 100;

    /** Formik (flujo de compra) */
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            // Autogenerados (solo lectura)
            numeroTicket: bus
                ? `TK-${bus.numeroBus}-${now.toISOString().slice(0, 19).replace(/[:T-]/g, "")}`
                : "",
            fechaEmision: toLocalDT(now),

            // Del viaje (solo lectura aquí)
            sitioSalida: sitioSalidaRD,
            horarioSalida: horarioSalidaRD,
            horarioLlegada: horarioLlegadaRD,

            // Elegibles por el usuario
            numeroAsiento: 1,
            valorBoleto: precioRD,

            _successMsg: "",
            _errorMsg: "",
        },
        validate(values) {
            const errors: Record<string, string> = {};
            if (!values.numeroTicket) errors.numeroTicket = "Sin número de ticket.";
            if (!values.fechaEmision) errors.fechaEmision = "Sin fecha de emisión.";
            if (!values.sitioSalida) errors.sitioSalida = "Sin sitio de salida.";
            if (!values.horarioSalida) errors.horarioSalida = "Sin horario de salida.";
            if (!values.horarioLlegada) errors.horarioLlegada = "Sin horario de llegada.";
            if (values.numeroAsiento < 1 || values.numeroAsiento > 100)
                errors.numeroAsiento = "El asiento debe estar entre 1 y 100.";
            if (values.valorBoleto <= 0)
                errors.valorBoleto = "El precio debe ser mayor a 0.";
            return errors;
        },
        async onSubmit(v, helpers) {
            try {
                helpers.setFieldValue("_successMsg", "");
                helpers.setFieldValue("_errorMsg", "");

                // Payload alineado con TicketCreateDto
                const payload = {
                    numeroTicket: v.numeroTicket,
                    numeroAsiento: Number(v.numeroAsiento),
                    valorBoleto: Number(v.valorBoleto),
                    fechaEmision: toISO(v.fechaEmision),
                    sitioSalida: v.sitioSalida,
                    horarioSalida: toISO(v.horarioSalida),
                    horarioLlegada: toISO(v.horarioLlegada),
                };

                const res = await fetch(`${API}/tickets`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                const json = await res.json();

                if (!res.ok || json.Status === false) {
                    throw new Error(json.Message || "No se pudo completar la compra.");
                }

                helpers.setFieldValue(
                    "_successMsg",
                    `¡Compra confirmada! Ticket ${json.Data?.numeroTicket ?? v.numeroTicket} generado correctamente.`
                );
            } catch (err: any) {
                helpers.setFieldValue("_errorMsg", err?.message ?? "Error desconocido");
            }
        },
    });

    // Si cargó el bus y falta número de ticket, autogenerarlo
    useEffect(() => {
        if (bus && !formik.values.numeroTicket) {
            formik.setFieldValue(
                "numeroTicket",
                `TK-${bus.numeroBus}-${new Date().toISOString().slice(0, 19).replace(/[:T-]/g, "")}`
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bus?.id]);

    if (oneBusQuery.isLoading) {
        return (
            <div className="flex justify-center items-center h-[300px]">
                <Loader className="animate-spin text-cyan-600" size={32} />
            </div>
        );
    }

    if (!bus) {
        return (
            <div className="max-w-3xl mx-auto px-4">
                <Title text="Comprar Ticket" />
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded p-4">
                    No se pudo cargar la información del bus.
                </div>
            </div>
        );
    }

    /* estilos sutiles para las “casillas” */
    const tile =
        "rounded-md border border-gray-200 bg-white p-3 shadow-sm hover:border-cyan-300 transition-colors";
    const labelCls = "block text-sm font-medium text-gray-700 mb-1";
    const inputRO =
        "w-full px-3 py-2 rounded-md border border-gray-100 bg-gray-50 text-gray-700";
    const inputEdit =
        "w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600 bg-white";

    return (
        <div className="max-w-5xl mx-auto px-4">
            <Title text="Comprar Ticket" />

            {/* Header con el bus */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
                <div className="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="relative h-44 bg-gray-100">
                        {bus.imageUrl ? (
                            <img
                                src={resolveImage(bus.imageUrl)}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                Sin imagen
                            </div>
                        )}
                        <div className="absolute left-3 top-3 bg-white/90 rounded-full px-3 py-1 text-xs font-semibold shadow">
                            Bus {bus.numeroBus}
                        </div>
                        {(bus.modelo || bus.anio) && (
                            <div className="absolute right-3 top-3 bg-cyan-600/90 text-white rounded-full px-3 py-1 text-[11px] font-medium shadow">
                                {bus.modelo ?? "Modelo"}{bus.anio ? ` · ${bus.anio}` : ""}
                            </div>
                        )}
                    </div>
                    <div className="p-4">
                        <p className="text-sm text-gray-500">Chofer</p>
                        <p className="text-base font-semibold text-gray-900">
                            {(bus.chofer || "").trim() || "—"}
                        </p>
                    </div>
                </div>

                <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-cyan-800 font-semibold">
                        <TicketIcon size={18} /> Datos de la compra
                    </div>
                    <p className="text-sm text-cyan-800/80 mt-2">
                        El ticket se genera automáticamente. Revisa la información antes de pagar.
                    </p>
                </div>
            </div>

            {/* Formulario */}
            <FormikProvider value={formik}>
                <form
                    onSubmit={formik.handleSubmit}
                    className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6"
                >
                    {/* Mensajes */}
                    {formik.values._errorMsg && (
                        <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3">
                            {formik.values._errorMsg}
                        </div>
                    )}
                    {formik.values._successMsg && (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded p-3 flex items-center gap-2">
                            <Check size={18} /> {formik.values._successMsg}
                        </div>
                    )}

                    {/* Grid única: md=2 cols, xl=4 cols. Asiento expande para llenar filas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                        {/* No. Ticket */}
                        <div className={`${tile} md:col-span-2 xl:col-span-2`}>
                            <label className={labelCls}>Nº Ticket (auto)</label>
                            <input type="text" value={formik.values.numeroTicket} readOnly className={inputRO} />
                        </div>

                        {/* Nº de Asiento (se expande para completar fila) */}
                        <div className={tile}>
                            <label className={labelCls}>Nº de Asiento</label>
                            <input
                                type="number"
                                name="numeroAsiento"
                                value={formik.values.numeroAsiento}
                                onChange={formik.handleChange}
                                min={1}
                                max={100}
                                className={inputEdit}
                                required
                            />
                            {formik.touched.numeroAsiento && formik.errors.numeroAsiento && (
                                <p className="text-xs text-red-500 mt-1">{formik.errors.numeroAsiento}</p>
                            )}
                        </div>

                        {/* Precio */}
                        <div className={tile}>
                            <label className={labelCls}>Precio</label>
                            <input type="number" value={formik.values.valorBoleto} readOnly className={inputRO} />
                        </div>

                        {/* Sitio de salida */}
                        <div className={tile}>
                            <label className={labelCls}>Sitio de salida</label>
                            <input type="text" value={formik.values.sitioSalida} readOnly className={inputRO} />
                        </div>

                        {/* Fecha de Emisión */}
                        <div className={tile}>
                            <label className={labelCls}>Fecha de Emisión</label>
                            <input
                                type="datetime-local"
                                value={formik.values.fechaEmision}
                                readOnly
                                className={inputRO}
                            />
                        </div>

                        {/* Horario de salida */}
                        <div className={tile}>
                            <label className={labelCls}>Horario de salida</label>
                            <input
                                type="datetime-local"
                                value={formik.values.horarioSalida}
                                readOnly
                                className={inputRO}
                            />
                        </div>

                        {/* Horario de llegada */}
                        <div className={tile}>
                            <label className={labelCls}>Horario de llegada</label>
                            <input
                                type="datetime-local"
                                value={formik.values.horarioLlegada}
                                readOnly
                                className={inputRO}
                            />
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="flex justify-center gap-4 pt-2">
                        <button
                            type="submit"
                            className="bg-cyan-700 hover:bg-cyan-800 text-white font-semibold py-2 px-5 rounded-lg transition"
                        >
                            Comprar ahora
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
        </div>
    );
};
