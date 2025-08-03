import { Briefcase, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { DashboardCard } from "../../components/home/DashBoardCard";
import { Title } from "../../components/shared/Title";
import { useNavigate } from "react-router";
import { useCompanies } from "../../hooks/useCompanies";
import { BusCarousel } from "../../components/home/BusCarousel";

export const CompaniesPage = () => {
  const navigate = useNavigate();

  const {
    companiesPaginationQuery,
    refreshCompanies,
    searchTerm,
    setSearchTerm,
    page,
    pageSize,
    setPage,
    setPageSize,
  } = useCompanies();

  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  useEffect(() => {
    refreshCompanies();
  }, []);

  const companyData = companiesPaginationQuery.data?.data.items || [];
  const totalCompanies = companiesPaginationQuery.data?.data.totalItems || 0;
  const totalPages = Math.max(1, Math.ceil(totalCompanies / pageSize));
  const selectedCompany = companyData.find(company => company.id === selectedCompanyId);

  // Buses Para Probar
  const sampleBuses = [
    {
      id: "bus-1",
      title: "Express Copán",
      imageUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "bus-2",
      title: "Lenca Móvil",
      imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "bus-3",
      title: "Ruta Colonial",
      imageUrl: "https://images.unsplash.com/photo-1558981033-5eea7f26fbd3?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "bus-4",
      title: "Trans Olancho",
      imageUrl: "https://images.unsplash.com/photo-1558980664-f1b5722b6a7d?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "bus-5",
      title: "Honduras Line",
      imageUrl: "https://images.unsplash.com/photo-1571047399553-3e3c3389f2c9?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "bus-6",
      title: "Rapidito El Paraíso",
      imageUrl: "https://images.unsplash.com/photo-1536757058630-0f27440d8a6b?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] bg-gray-100 px-6 py-6 gap-6">
      {/* Panel izquierdo */}
      <section className="lg:w-1/2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 overflow-y-auto flex flex-col">
        <div className="mb-2">
          <Title text="Catálogo de Empresas" />
        </div>

        {/* Filtros */}
        <div className="mb-6 flex flex-wrap gap-4 items-center border-b pb-4">
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Buscar empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />
          </div>
          <div>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600"
            >
              {[5, 10, 25, 50].map(size => (
                <option key={size} value={size}>Mostrar {size}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Lista de empresas */}
        <div className="flex-1">
          {companyData.length === 0 ? (
            <p className="text-gray-500 italic">No hay resultados</p>
          ) : (
            <div className="grid gap-4">
              {companyData.map(company => (
                <DashboardCard
                  key={company.id}
                  title={company.name}
                  icon={<Briefcase size={48} />}
                  onClick={() => setSelectedCompanyId(company.id)}
                  onEdit={() => navigate(`/companies/${company.id}/edit`)}
                  onDelete={() => navigate(`/companies/${company.id}/delete`)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Paginación */}
        <div className="mt-8 flex items-center justify-between">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-cyan-700 text-white rounded-md disabled:opacity-50 hover:bg-cyan-800 transition"
          >
            ← Anterior
          </button>
          <span className="text-gray-700 font-medium">
            Página {page} de {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-cyan-700 text-white rounded-md disabled:opacity-50 hover:bg-cyan-800 transition"
          >
            Siguiente →
          </button>
        </div>
      </section>

      {/* Panel derecho */}
      <section className="lg:w-1/2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 overflow-y-auto">
        <Title text="Ficha de Empresa" />
        {selectedCompany ? (
          <div className="mt-4 space-y-3 text-gray-800">
            <h2 className="text-2xl font-bold border-b pb-2">
              {selectedCompany.name}
            </h2>
            <p><strong>Email:</strong> {selectedCompany.email}</p>
            <p><strong>Teléfono:</strong> {selectedCompany.phoneNumber}</p>

            {/* Carrusel de buses */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Buses asociados</h3>
              <BusCarousel buses={sampleBuses} />
            </div>
          </div>
        ) : (
          <p className="text-gray-500 italic mt-4">
            Selecciona una empresa para ver sus detalles
          </p>
        )}
      </section>

      {/* Botón flotante */}
      <button
        onClick={() => navigate("/companies/create")}
        className="fixed bottom-6 left-6 bg-cyan-800 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl hover:bg-cyan-900 transition-all duration-300 ring-4 ring-cyan-900 flex items-center justify-center group"
      >
        <Plus size={24} />
        <span className="absolute left-16 bg-cyan-800 text-white px-3 py-1 rounded-md text-sm font-medium opacity-0 group-hover:opacity-100 transition duration-300 whitespace-nowrap shadow">
          Añadir Empresa
        </span>
      </button>
    </div>
  );
};