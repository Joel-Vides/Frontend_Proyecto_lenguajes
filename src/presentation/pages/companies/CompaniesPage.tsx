import { Briefcase, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { DashboardCard } from "../../components/home/DashBoardCard";
import { Title } from "../../components/shared/Title";
import { useNavigate } from "react-router";
import { useCompanies } from "../../hooks/useCompanies";

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

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Controles y listado */}
      <div className="p-4 lg:border-r lg:w-1/2 overflow-y-auto">
        <Title text="Empresas" />

        {/* Filtros */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            {[5, 10, 25, 50].map(size => (
              <option key={size} value={size}>Mostrar {size}</option>
            ))}
          </select>
        </div>

        {/* Listado de tarjetas */}
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

        {/* Paginación */}
        <div className="flex items-center justify-between mt-6">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-cyan-600 text-white rounded-md disabled:opacity-50 hover:bg-cyan-700 transition"
          >
            ← Anterior
          </button>

          <span className="text-gray-700 font-semibold">
            Página {page} de {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-cyan-600 text-white rounded-md disabled:opacity-50 hover:bg-cyan-700 transition"
          >
            Siguiente →
          </button>
        </div>

        {/* Botón flotante para crear */}
        <button
          onClick={() => navigate("/companies/create")}
          className="fixed bottom-8 left-8 bg-cyan-800 text-white rounded-full shadow-lg hover:bg-cyan-900 transition-all duration-300 flex items-center gap-2 group px-4 py-4"
        >
          <Plus size={24} />
          <span className="max-w-0 opacity-0 overflow-hidden group-hover:max-w-xs group-hover:opacity-100 transition-all duration-300 text-sm font-semibold whitespace-nowrap">
            Añadir Empresa
          </span>
        </button>
      </div>

      {/* Panel de detalles */}
      <div className="p-4 lg:w-1/2 overflow-y-auto">
        <Title text="Información" />
        {selectedCompany ? (
          <div>
            <h2 className="text-2xl font-bold mb-2">{selectedCompany.name}</h2>
            <p className="text-gray-700"><strong>Email:</strong> {selectedCompany.email}</p>
            <p className="text-gray-700"><strong>Teléfono:</strong> {selectedCompany.phoneNumber}</p>
          </div>
        ) : (
          <p className="text-gray-500 italic">Selecciona una empresa para ver sus detalles</p>
        )}
      </div>
    </div>
  );
};