import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useEffect, useState } from "react";
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const scrollBy = (offset: number) => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, clientWidth, scrollWidth } = el;

    // 🔁 Scroll infinito: rebote circular
    if (offset > 0 && scrollLeft + clientWidth >= scrollWidth - 5) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else if (offset < 0 && scrollLeft <= 5) {
      el.scrollTo({ left: scrollWidth, behavior: "smooth" });
    } else {
      el.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  // 🔄 Auto-scroll con pausa por hover
  useEffect(() => {
    if (!isHovered) {
      intervalRef.current = window.setInterval(() => {
        scrollBy(300);
      }, 4000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isHovered]);

  // 🎯 Actualiza el índice activo (indicadores)
  const updateActiveIndex = () => {
    const el = scrollRef.current;
    if (!el) return;
    const itemWidth = 300; // ancho estimado de cada tarjeta
    const index = Math.round(el.scrollLeft / itemWidth);
    setActiveIndex(index);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateActiveIndex);
    return () => {
      el.removeEventListener("scroll", updateActiveIndex);
    };
  }, []);

  return (
    <div
      className="relative w-full max-h-[340px] overflow-hidden flex flex-col justify-between"
    >
      {/* ⬅️ Flecha izquierda */}
      <button
        onClick={() => scrollBy(-300)}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 border border-gray-200 hover:border-cyan-500 hover:shadow-md hover:bg-cyan-50 text-gray-600 hover:text-cyan-600 rounded-full p-2 transition-all"
      >
        <ChevronLeft size={24} />
      </button>

      {/* 🎠 Carrusel */}
      <div
        ref={scrollRef}
        className="flex gap-4 px-10 py-4 overflow-x-scroll scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Oculta scrollbar en WebKit */}
        <style >{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {buses.map((bus) => (
          <div key={bus.id} className="flex-shrink-0">
            <BusCard
              title={bus.title}
              imageUrl={bus.imageUrl}
              onClick={() => console.log("Bus seleccionado:", bus.id)}
            />
          </div>
        ))}
      </div>

      {/* ➡️ Flecha derecha */}
      <button
        onClick={() => scrollBy(300)}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 border border-gray-200 hover:border-cyan-500 hover:shadow-md hover:bg-cyan-50 text-gray-600 hover:text-cyan-600 rounded-full p-2 transition-all"
      >
        <ChevronRight size={24} />
      </button>

      {/* 🔘 Indicadores visuales */}
      <div className="mt-1 mb-2 flex justify-center space-x-2">
        {buses.map((_, idx) => (
          <span
            key={idx}
            className={`w-3 h-3 rounded-full transition-all ${
              idx === activeIndex ? "bg-cyan-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};