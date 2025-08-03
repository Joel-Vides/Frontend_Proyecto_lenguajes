import { Link } from "react-router";

interface Props {
  icon?: React.ReactNode;
  text: string;
  active?: boolean;
  to: string;
  className?: string;
}

export const NavLink = ({ icon, text, active = false, to, className = "" }: Props) => {
  return (
    <Link
      to={to}
      className={`group flex items-center px-3 py-2 text-sm font-LexendDeca-Medium rounded-md transition-colors 
      ${active ? "bg-cyan-800 text-white" : "text-blue-100 hover:bg-cyan-700"} ${className}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {text}
    </Link>
  );
};