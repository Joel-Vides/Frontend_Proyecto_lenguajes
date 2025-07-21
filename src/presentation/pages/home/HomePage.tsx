import { Bus } from "lucide-react"
import { useState } from "react"
import { DashboardCard } from "../../components/home/DashBoardCard"
import { Title } from "../../components/shared/Title"

export const HomePage = () => {
  const [selectedBusId, setSelectedBusId] = useState<number | null>(null)

  const busData = [
    { id: 1, title: "Bus 101", info: "Ruta Copán - La Entrada" },
    { id: 2, title: "Bus 202", info: "Ruta Santa Rosa - San Pedro" },
    { id: 3, title: "Bus 303", info: "Ruta La Entrada - San Pedro Sula" },
    { id: 4, title: "Bus 404", info: "Ruta Ocotepeque - Copán" },

  ]

  const selectedBus = busData.find(bus => bus.id === selectedBusId)

  return (

    <div className="flex h-screen">

      {/* Buses Disponibles */}
      <div className="w-1/2 border-r p-4 overflow-y-auto">
        <Title text="Buses Disponibles" />
        {busData.map((bus) => (
          <DashboardCard
            key={bus.id}
            title={bus.title}
            icon={<Bus size={48} />}
            onClick={() => setSelectedBusId(bus.id)}
          />
        ))}
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
      
    </div>
  )
}