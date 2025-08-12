import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { BusCard } from "./BusCard";

interface Bus {
  id: string;
  title?: string;
  imageUrl?: string;
  numeroBus?: string;
  chofer?: string;
  modelo?: string;
  anio?: number | string;
}

interface Props {
  buses: Bus[];
  onSelectBus?: (id: string) => void;
}

export const BusCarousel = ({ buses, onSelectBus }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const scrollBy = (offset: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, clientWidth, scrollWidth } = el;

    if (offset > 0 && scrollLeft + clientWidth >= scrollWidth - 5) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else if (offset < 0 && scrollLeft <= 5) {
      el.scrollTo({ left: scrollWidth, behavior: "smooth" });
    } else {
      el.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (!isHovered) {
      intervalRef.current = window.setInterval(() => scrollBy(340), 4000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isHovered]);

  const updateActiveIndex = () => {
    const el = scrollRef.current;
    if (!el) return;
    const itemWidth = 340;
    const index = Math.round(el.scrollLeft / itemWidth);
    setActiveIndex(index);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateActiveIndex);
    return () => el.removeEventListener("scroll", updateActiveIndex);
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Flecha izquierda (súper sutil) */}
      <button
        onClick={() => scrollBy(-340)}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 rounded-full p-1.5
                   bg-white/40 backdrop-blur supports-[backdrop-filter]:bg-white/30
                   text-gray-600 hover:text-cyan-700 ring-1 ring-black/5 hover:ring-black/10
                   shadow-sm hover:shadow-md opacity-60 hover:opacity-100 transition-all"
        aria-label="Anterior"
      >
        <ChevronLeft size={18} />
      </button>

      <div
        ref={scrollRef}
        className="relative flex gap-4 px-10 py-5 overflow-x-scroll scroll-smooth snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <style>{`div::-webkit-scrollbar{display:none}`}</style>

        {buses.map((bus) => (
          <div key={bus.id} className="snap-start">
            <BusCard
              id={bus.id}
              imageUrl={bus.imageUrl}
              numeroBus={bus.numeroBus ?? bus.title}
              title={bus.title}
              chofer={bus.chofer}
              modelo={bus.modelo}
              anio={bus.anio}
              onClick={() => onSelectBus?.(bus.id)}
            />
          </div>
        ))}
      </div>

      {/* Flecha derecha (súper sutil) */}
      <button
        onClick={() => scrollBy(340)}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 rounded-full p-1.5
                   bg-white/40 backdrop-blur supports-[backdrop-filter]:bg-white/30
                   text-gray-600 hover:text-cyan-700 ring-1 ring-black/5 hover:ring-black/10
                   shadow-sm hover:shadow-md opacity-60 hover:opacity-100 transition-all"
        aria-label="Siguiente"
      >
        <ChevronRight size={18} />
      </button>

      {/* indicadores */}
      <div className="relative mt-2 mb-1 flex justify-center gap-1.5 z-10">
        {buses.map((_, idx) => (
          <span
            key={idx}
            className={`h-2 rounded-full transition-all ${idx === activeIndex ? "w-6 bg-cyan-600" : "w-2 bg-gray-300"
              }`}
          />
        ))}
      </div>
    </div>
  );
};
