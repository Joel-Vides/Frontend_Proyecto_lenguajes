import { BusFront, Plus, Ticket } from "lucide-react";
import { useState } from "react";
import { DashboardCard } from "../../components/home/DashBoardCard";
import { Title } from "../../components/shared/Title";
import { useNavigate } from "react-router";

export const HomePage = () => {
  const navigate = useNavigate();
  const [selectedBusId, setSelectedBusId] = useState<number | null>(null);

  const busData = [
    { id: 1, title: "Bus 101", info: "Ruta Copán - La Entrada" },
    { id: 2, title: "Bus 202", info: "Ruta Santa Rosa - San Pedro" },
    { id: 3, title: "Bus 303", info: "Ruta La Entrada - San Pedro Sula" },
    { id: 4, title: "Bus 404", info: "Ruta Ocotepeque - Copán" },
  ];

  const selectedBus = busData.find(bus => bus.id === selectedBusId);

  return (
    <div className="flex h-screen">
      {/* Buses Disponibles */}
      <div className="w-1/2 border-r p-4 overflow-y-auto">
        <Title text="Buses Disponibles" />

        <div className="grid gap-4">
          {busData.map((bus) => (
            <DashboardCard
              key={bus.id}
              title={bus.title}
              icon={<BusFront size={48} />}
              onClick={() => setSelectedBusId(bus.id)}
              onEdit={() => navigate(`/buses/${bus.id}/edit`)}
              onDelete={() => navigate(`/buses/${bus.id}/delete`)}
            />
          ))}
        </div>

        {/* Botón flotante para Añadir Buses */}
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

      {/* Información del Bus Seleccionado */}
      <div className="w-1/2 p-4 overflow-y-auto">
        <Title text="Información" />
        {selectedBus ? (
          <div>
            <h2 className="text-2xl font-bold mb-2">{selectedBus.title}</h2>
            <p className="text-gray-700">{selectedBus.info}</p>
          </div>
        ) : (
          <p className="text-gray-500 italic">Selecciona un bus para ver sus detalles</p>
        )}
      </div>

      {/* Botón flotante para Comprar Ticket */}
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