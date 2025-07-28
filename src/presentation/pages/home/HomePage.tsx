import { BusFront, Plus, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { DashboardCard } from "../../components/home/DashBoardCard";
import { Title } from "../../components/shared/Title";
import { useNavigate } from "react-router";
import { useBuses } from "../../hooks/useBuses";

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
  const selectedBus = busData.find(bus => bus.id === selectedBusId);

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Listado y Buscar */}
      <div className="p-4 lg:border-r lg:w-1/2 overflow-y-auto">
        <Title text="Buses disponibles" />

        {/* Filtros para Búsqueda */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar bus..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            {[5, 10, 25, 50].map(size => (
              <option key={size} value={size}>Mostrar {size}</option>
            ))}
          </select>
        </div>

        {/* Tarjetas */}
        {busData.length === 0 ? (
          <p className="text-gray-500 italic">No hay buses disponibles</p>
        ) : (
          <div className="grid gap-4">
            {busData.map(bus => (
              <DashboardCard
                key={bus.id}
                title={`Bus ${bus.numeroBus}`}
                icon={<BusFront size={48} />}
                onClick={() => setSelectedBusId(bus.id)}
                onEdit={() => navigate(`/buses/${bus.id}/edit`)}
                onDelete={() => navigate(`/buses/${bus.id}/delete`)}
              />
            ))}
          </div>
        )}

        {/* Paginación */}
        <div className="flex items-center justify-between mt-6">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-cyan-600 text-white rounded-md disabled:opacity-50 hover:bg-cyan-700 transition"
          >
            ← Anterior
          </button>
          <span className="text-gray-700 font-semibold">
            Página {page} de {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-cyan-600 text-white rounded-md disabled:opacity-50 hover:bg-cyan-700 transition"
          >
            Siguiente →
          </button>
        </div>

        {/* Botón para Crear Buses */}
        <button
          onClick={() => navigate("/buses/create")}
          className="fixed bottom-8 left-8 bg-cyan-800 text-white rounded-full shadow-lg hover:bg-cyan-900 transition-all duration-300 flex items-center gap-2 group px-4 py-4"
        >
          <Plus size={24} />
          <span className="max-w-0 opacity-0 overflow-hidden group-hover:max-w-xs group-hover:opacity-100 transition-all duration-300 text-sm font-semibold whitespace-nowrap">
            Añadir Bus
          </span>
        </button>
      </div>

      {/* Detalles ede los Buses */}
      <div className="p-4 lg:w-1/2 overflow-y-auto">
        <Title text="Información del Bus" />
        {selectedBus ? (
          <div>
            <h2 className="text-2xl font-bold mb-2">Bus {selectedBus.numeroBus}</h2>
            <p className="text-gray-700"><strong>Chofer:</strong> {selectedBus.chofer}</p>
            <p className="text-gray-700"><strong>Modelo:</strong> {selectedBus.modelo}</p>
            <p className="text-gray-700"><strong>Año:</strong> {selectedBus.anio}</p>
          </div>
        ) : (
          <p className="text-gray-500 italic">Selecciona un bus para ver sus detalles</p>
        )}
      </div>

      {/* Botón para los Tickets */}
      <button
        onClick={() => navigate("/tickets/create")}
        className="fixed bottom-8 right-8 bg-cyan-800 text-white rounded-full shadow-lg hover:bg-cyan-900 transition-all duration-300 flex items-center gap-2 group px-4 py-4"
      >
        <Ticket size={24} />
        <span className="max-w-0 opacity-0 overflow-hidden group-hover:max-w-xs group-hover:opacity-100 transition-all duration-300 text-sm font-semibold whitespace-nowrap">
          Comprar Ticket
        </span>
      </button>
    </div>
  );
};