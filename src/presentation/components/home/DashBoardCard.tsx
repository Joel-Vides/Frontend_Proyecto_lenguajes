import { Pencil, Trash2 } from "lucide-react";

interface Props {
  title: string;
  icon?: React.ReactNode;
  imageUrl?: string;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const DashboardCard = ({
  title,
  icon,
  imageUrl,
  onClick,
  onEdit,
  onDelete,
}: Props) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-lg hover:scale-[1.02] transition-transform  duration-200 overflow-hidden flex flex-row items-stretch h-28"
    >
      {/* Lado Izquierdo: Icono y Título */}
      <div className="flex items-center gap-4 px-5 w-1/2">
        {icon && (
          <div className="text-cyan-700 bg-cyan-100 p-2 rounded-full">
            {icon}
          </div>
        )}
        <h2 className="text-xl font-semibold text-gray-800 leading-tight">
          {title}
        </h2>
      </div>

      {/* Lado Derecho: Imagen y Botones */}
      <div className="relative w-1/2 h-full">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Imagen"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 italic text-sm">
            Sin imagen
          </div>
        )}

        {/* Botones */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="bg-white/80 hover:bg-cyan-600 text-cyan-700 hover:text-white p-1 rounded-full shadow transition-colors"
              title="Editar"
            >
              <Pencil size={18} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="bg-white/80 hover:bg-red-500 text-red-600 hover:text-white p-1 rounded-full shadow transition-colors"
              title="Eliminar"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};