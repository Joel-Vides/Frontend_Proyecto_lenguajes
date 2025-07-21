import { Link } from "react-router";

// Interfaz
interface Props {
    //Signo ? es para opcional
    icon?: React.ReactNode;
    text: string;
    active?: boolean;
    to: string;
}

export const NavLink = ({ icon, text, active = false, to }: Props) => {

    return (
        <Link to={to} className={`flex items-center px-3 py-2 text-sm font-LexendDeca-Medium
         ${active ? "bg-cyan-800 text-white" : "text-blue-100 hover:bg-cyan-700"}`}>

            {icon && (
                <span className="mr-2">{icon}</span>
            )}

            {text}
        </Link>
    );

}