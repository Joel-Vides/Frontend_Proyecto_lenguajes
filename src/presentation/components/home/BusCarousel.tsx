import { BusCard } from "./BusCard";

interface Bus {
  id: string;
  title: string;
  imageUrl?: string;
}

interface Props {
  buses: Bus[];
}

export const BusCarousel = ({ buses }: Props) => {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex gap-3 px-2 py-2">
        {buses.map((bus) => (
          <BusCard
            key={bus.id}
            title={bus.title}
            imageUrl={bus.imageUrl}
            onClick={() => console.log("Bus seleccionado:", bus.id)}
          />
        ))}
      </div>
    </div>
  );
};