import { Link } from "react-router";

interface Props {
  icon?: React.ReactNode;
  text: string;
  active?: boolean;
  to: string;
  className?: string;
}

export const MobileNavLink = ({
  icon,
  text,
  active = false,
  to,
  className = "",
}: Props) => {
  return (
    <Link
      to={to}
      className={`flex items-center px-3 py-2 rounded-md text-sm font-LexendDeca-Medium
        ${active ? "bg-cyan-700 text-white" : "text-blue-100 hover:bg-cyan-500"}
        ${className}`}
    >
      {icon && <span className="mr-3">{icon}</span>}
      {text}
    </Link>
  );
};