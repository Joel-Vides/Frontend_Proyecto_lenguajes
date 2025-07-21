interface Props {
  title: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export const DashboardCard = ({ title, icon, onClick }: Props) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white m-4 rounded-lg shadow-md p-4 flex flex-row items-center justify-between gap-4"
    >
      <div className="flex flex-row items-center justify-center gap-4">
        <div>{icon && <span>{icon}</span>}</div>
        <div>
          <h2 className="text-lg font-bold mb-2">{title}</h2>
        </div>
      </div>
    </div>
  );
};