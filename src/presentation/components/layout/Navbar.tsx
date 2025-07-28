import { Briefcase, Bus, Home, Menu, } from "lucide-react";
import { useState } from "react";
import { Outlet, useLocation } from "react-router";
import { NavLink } from "../shared/NavLink";
import { MobileNavLink } from "../shared/MobileNavLink";

export const Navbar = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const location = useLocation();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const isActive = (path: string) => {
        if (path === '/') {
            return location.pathname === '/'
        }

        return location.pathname.startsWith(path);
    }
    return (
        <>
            <nav className="bg-cyan-900 text-white shadow-md">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between h-16">
                        {/* Logo y titulo */}
                        <div className="flex items-center">
                            <span className="font-LexendDeca-Bold text-xl font-bold">
                                Terminal
                            </span>
                        </div>

                        {/* Navegación en escritorio */}
                        <div className="hidden md:flex">
                            <NavLink to="/" active={isActive("/")} text="Inicio" icon={<Home size={18} />} />
                            <NavLink to="/companies" active={isActive("/companies")} text="Empresas" icon={<Briefcase size={18} />} />
                            <NavLink to="/buses" active={isActive("/buses")} text="Buses" icon={<Bus size={18} />} />
                        </div>
                        {/* Botón de menu móvil */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={toggleMenu}
                                className="text-white hover:text-blue-200 focus:outline-none"
                            >
                                <Menu size={24} />
                            </button>

                        </div>

                    </div>
                </div>

                {/* Menu móvil */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <MobileNavLink to="/" active={isActive("/")} icon={<Home size={18} />} text="Inicio" />
                            <MobileNavLink to="/companies" active={isActive("/companies")} icon={<Briefcase size={18} />} text="Empresas" />
                            <MobileNavLink to="/buses" active={isActive("/buses")} icon={<Bus size={18} />} text="Buses" />
                        </div>
                    </div>
                )}

            </nav>

            {/* Principal content */}
            <div className="min-h-screen bg-gray-100 mx-auto p-4 mt-4">
                <Outlet />
            </div>
        </>
    );
}