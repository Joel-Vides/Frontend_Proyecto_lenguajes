interface Props {
  id?: string;
  imageUrl?: string;
  numeroBus?: string;
  title?: string;
  chofer?: string;
  modelo?: string;
  anio?: number | string;
  onClick?: () => void;
}

export const BusCard = ({
  id,
  imageUrl,
  numeroBus,
  title,
  chofer,
  modelo,
  anio,
  onClick,
}: Props) => {
  const label = numeroBus ?? title ?? id ?? "Bus";
  const year =
    anio !== undefined && anio !== null && anio !== "" ? String(anio) : "—";
  const driver = typeof chofer === "string" && chofer.trim().length > 0 ? chofer.trim() : "—";

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer w-[320px] h-[300px] flex-shrink-0 rounded-2xl overflow-hidden shadow-md bg-white/70 backdrop-blur
                 border border-white/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Imagen */}
      <div className="relative h-[50%] bg-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`Imagen del bus ${label}`}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-gray-400 italic text-sm">
            Sin imagen
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-90" />

        {/* Número de Bus */}
        <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold
                        bg-white/85 text-gray-800 shadow-sm">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-600" />
          Bus {label}
        </div>

        {/* Modelo/Año */}
        {(modelo || year !== "—") && (
          <div className="absolute right-3 top-3 rounded-full px-3 py-1 text-[11px] font-medium
                          bg-cyan-600/90 text-white shadow-sm">
            {modelo ?? "Modelo"}
            {year !== "—" ? ` · ${year}` : ""}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="h-[50%] p-4 flex flex-col">
        <div className="flex flex-row">
          <p className="text-sm text-gray-500">Chofer</p>
          <p className="text-base font-semibold text-gray-900 ml-2 absolute bottom-28 left-14">{driver}</p>

        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-gray-200 p-2">
            <p className="text-[11px] uppercase tracking-wide text-gray-500">Modelo</p>
            <p className="text-[13px] text-gray-900 font-medium">{modelo ?? "—"}</p>
          </div>
          <div className="rounded-lg border border-gray-200 p-2">
            <p className="text-[11px] uppercase tracking-wide text-gray-500">Año</p>
            <p className="text-[13px] text-gray-900 font-medium">{year}</p>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-end pt-3">
          <span className="text-[12px] font-medium text-cyan-700 group-hover:translate-x-0.5 transition-transform">
            Ver detalles →
          </span>
        </div>
      </div>
    </div>
  );
};
