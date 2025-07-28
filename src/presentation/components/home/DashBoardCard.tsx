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
      className="cursor-pointer bg-white m-1 rounded-lg shadow-md flex flex-row items-center justify-between overflow-hidden h-24"
    >
      {/* Lado Izquierdo Icono y Título */}
      <div className="flex flex-row items-center gap-4 px-4 w-1/2">
        {icon && <span className="text-cyan-700">{icon}</span>}
        <h2 className="text-lg font-[LexendDeca-Bold] text-gray-900">{title}</h2>
      </div>

      {/* Lado Derecho Imagen y botones */}
      <div className="relative w-1/2 h-full">
        {imageUrl ? (
          <img
            src={imageUrl}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 italic text-sm">
            Sin imagen
          </div>
        )}

        {/* Botones al borde derecho */}
        <div className="absolute top-0 right-0 h-full w-10 flex flex-col">
          {/* Botón Para Editar */}
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white text-xs flex items-center justify-center"
              title="Editar"
            >
              <Pencil size={16} />
            </button>
          )}
          {/* Botón Para Borrar */}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="flex-1 bg-red-400 hover:bg-red-500 text-white text-xs flex items-center justify-center"
              title="Eliminar"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};