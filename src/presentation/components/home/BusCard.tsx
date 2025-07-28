interface Props {
  imageUrl?: string;
  title: string;
  onClick?: () => void;
}

export const BusCard = ({
  title,
  imageUrl,
  onClick,
}: Props) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white m-1 rounded-lg shadow-md flex flex-col overflow-hidden h-64 w-64"
    >
      {/* 🖼️ Imagen - 40% del alto */}
      <div className="relative w-full h-[40%]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Imagen del bus"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 italic text-sm">
            Sin imagen
          </div>
        )}
      </div>

      {/* 📝 Información - 60% del alto */}
      <div className="h-[60%] px-4 flex items-center justify-center">
        <h2 className="text-lg font-[LexendDeca-Bold] text-gray-900 text-center">{title}</h2>
      </div>
    </div>
  );
};