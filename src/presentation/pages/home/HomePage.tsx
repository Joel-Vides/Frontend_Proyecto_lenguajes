import { BusFront, Plus, Ticket, Route } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { BusMap } from "./BusMap";
import { useBuses } from "../../hooks/useBuses";
import { Title } from "../../components/shared/Title";
import { DashboardCard } from "../../components/home/DashBoardCard";

export const HomePage = () => {
  const navigate = useNavigate();
  const {
    busesPaginationQuery,
    refreshBuses,
    searchTerm,
    setSearchTerm,
    page,
    pageSize,
    setPage,
    setPageSize,
  } = useBuses();

  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);

  useEffect(() => {
    refreshBuses();
  }, []);

  const busData = busesPaginationQuery.data?.data.items || [];
  const totalBuses = busesPaginationQuery.data?.data.totalItems || 0;
  const totalPages = Math.max(1, Math.ceil(totalBuses / pageSize));
  const selectedBus = busData.find((bus) => bus.id === selectedBusId);

  // Base del backend
  const API_BASE = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "");
  const resolveImage = (src?: string) => {
    if (!src) return undefined;
    if (/^https?:\/\//i.test(src)) return src;
    const needsSlash = src.startsWith("/") ? "" : "/";
    return `${API_BASE}${needsSlash}${src}`;
  };

  // Parser simple
  const toNum = (v: unknown) => {
    if (v === null || v === undefined || v === "") return NaN;
    const n = Number(v);
    return Number.isFinite(n) ? n : NaN;
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] bg-gray-100 px-6 py-6 gap-6">

      {/* Panel izquierdo */}
      <section className="lg:w-1/2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 overflow-y-auto flex flex-col">
        <Title text="Buses disponibles" />

        <div className="mt-4 mb-6 flex flex-wrap gap-4 items-center border-b pb-4">
          <input
            type="text"
            placeholder="Buscar bus."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow min-w-[200px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600"
          />
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600"
          >
            {[5, 10, 25, 50].map((size) => (
              <option key={size} value={size}>
                Mostrar {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          {busData.length === 0 ? (
            <p className="text-gray-500 italic">No hay buses disponibles</p>
          ) : (
            <div className="grid gap-4">
              {busData.map((bus) => (
                <DashboardCard
                  key={bus.id}
                  title={`Bus ${bus.numeroBus}`}
                  icon={<BusFront size={48} />}
                  imageUrl={resolveImage(bus.imageUrl)}
                  onClick={() => setSelectedBusId(bus.id)}
                  onEdit={() => navigate(`/buses/${bus.id}/edit`)}
                  onDelete={() => navigate(`/buses/${bus.id}/delete`)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-cyan-700 text-white rounded-md disabled:opacity-50 hover:bg-cyan-800 transition"
          >
            ← Anterior
          </button>
          <span className="text-gray-700 font-medium">Página {page} de {totalPages}</span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-cyan-700 text-white rounded-md disabled:opacity-50 hover:bg-cyan-800 transition"
          >
            Siguiente →
          </button>
        </div>
      </section>

      {/* Panel derecho */}
      <section className="lg:w-1/2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 overflow-y-auto">
        <Title text="Información del Bus" />
        {selectedBus ? (
          <>
            <div className="mt-4 space-y-3 text-gray-800">

              {/* Header y Botón Editar Ruta */}
              <div className="flex items-center justify-between border-b pb-2">
                <h2 className="text-2xl font-bold">Bus {selectedBus.numeroBus}</h2>

                <button
                  type="button"
                  onClick={() => navigate(`/buses/${selectedBus.id}/editRoute`)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-cyan-700 text-white hover:bg-cyan-800 transition"
                  title="Editar ruta del bus"
                >
                  <Route size={18} />
                  <span className="hidden sm:inline">Editar ruta</span>
                </button>
              </div>

              <p><strong>Chofer:</strong> {selectedBus.chofer}</p>
              <p><strong>Modelo:</strong> {selectedBus.modelo}</p>
              <p><strong>Año:</strong> {selectedBus.anio}</p>
            </div>

            <div className="mt-6">
              <BusMap
                start={{
                  latitude: toNum(selectedBus.startLocation?.latitude),
                  longitude: toNum(selectedBus.startLocation?.longitude),
                }}
                end={{
                  latitude: toNum(selectedBus.endLocation?.latitude),
                  longitude: toNum(selectedBus.endLocation?.longitude),
                }}
              />
            </div>
          </>
        ) : (
          <p className="text-gray-500 italic mt-4">Selecciona un bus para ver sus detalles</p>
        )}
      </section>

      {/* Botón flotante: Añadir Bus */}
      <button
        onClick={() => navigate("/buses/create")}
        className="fixed bottom-6 left-6 bg-cyan-800 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl hover:bg-cyan-900 transition-all flex items-center justify-center group"
      >
        <Plus size={24} />
        <span className="absolute left-16 bg-cyan-800 text-white px-3 py-1 rounded-md text-sm font-medium opacity-0 group-hover:opacity-100 transition duration-300 whitespace-nowrap shadow">
          Añadir Bus
        </span>
      </button>

      {/* Botón flotante: Comprar Ticket */}
      <button
        onClick={() => navigate("/tickets/create")}
        className="fixed bottom-6 right-6 bg-cyan-800 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl hover:bg-cyan-900 transition-all flex items-center justify-center group"
      >
        <Ticket size={24} />
        <span className="absolute right-16 bg-cyan-800 text-white px-3 py-1 rounded-md text-sm font-medium opacity-0 group-hover:opacity-100 transition duration-300 whitespace-nowrap shadow">
          Comprar Ticket
        </span>
      </button>
    </div>
  );
};
