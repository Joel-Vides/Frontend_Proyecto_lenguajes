import { Briefcase, Home, Menu } from "lucide-react";
import { useState } from "react";
import { Outlet, useLocation } from "react-router";
import { NavLink } from "../shared/NavLink";
import { MobileNavLink } from "../shared/MobileNavLink";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <>
      <nav className="bg-cyan-900 text-white shadow-md sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-2xl font-LexendDeca-Bold font-semibold tracking-wide">
                Terminal
              </span>
            </div>

            {/* Navegación escritorio */}
            <div className="hidden md:flex items-center space-x-4">
              <NavLink
                to="/"
                active={isActive("/")}
                text="Inicio"
                icon={
                  <Home
                    size={20}
                    className="transition-transform transform group-hover:scale-125 duration-300"
                  />
                }
                className="group rounded-lg px-3 py-2 hover:bg-cyan-700 transition-all"
              />
              <NavLink
                to="/companies"
                active={isActive("/companies")}
                text="Empresas"
                icon={
                  <Briefcase
                    size={20}
                    className="transition-transform transform group-hover:scale-125 duration-300"
                  />
                }
                className="group rounded-lg px-3 py-2 hover:bg-cyan-700 transition-all"
              />
            </div>

            {/* Botón móvil */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-white hover:text-cyan-300 focus:outline-none rounded-md p-1 transition duration-300"
                aria-label="Menú móvil"
              >
                <Menu size={26} className="hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden bg-cyan-800 px-4 py-2 space-y-2 rounded-xl transition-all duration-300">
            <MobileNavLink
              to="/"
              active={isActive("/")}
              icon={<Home size={20} />}
              text="Inicio"
              className="block px-4 py-2 rounded-lg hover:bg-cyan-700 transition"
            />
            <MobileNavLink
              to="/companies"
              active={isActive("/companies")}
              icon={<Briefcase size={20} />}
              text="Empresas"
              className="block px-4 py-2 rounded-lg hover:bg-cyan-700 transition"
            />
          </div>
        )}
      </nav>

      {/* Contenido principal */}
      <div className="min-h-screen bg-gray-100 mx-auto p-4 mt-4 transition-all duration-300">
        <Outlet />
      </div>
    </>
  );
};