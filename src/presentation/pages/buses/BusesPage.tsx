import { BusCard } from "../../components/home/BusCard"

export const BusesPage = () => {

  const busData = [
    { id: 1, title: "Bus 101", info: "Ruta Copán - La Entrada" },
    { id: 2, title: "Bus 202", info: "Ruta Santa Rosa - San Pedro" },
    { id: 3, title: "Bus 303", info: "Ruta La Entrada - San Pedro Sula" },
    { id: 4, title: "Bus 404", info: "Ruta Ocotepeque - Copán" },
  ];
  return (
    <div>
      <div className="grid gap-4">
        {busData.map((bus) => (
          <BusCard
            key={bus.id}
            title={bus.title}
            onClick={() => console.log()}

          />
        ))}
      </div>


    </div>
  )
}
