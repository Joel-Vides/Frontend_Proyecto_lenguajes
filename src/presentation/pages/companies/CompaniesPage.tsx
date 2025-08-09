import { Briefcase } from "lucide-react";
import { useEffect, useState } from "react";
import { DashboardCard } from "../../components/home/DashBoardCard";
import { Title } from "../../components/shared/Title";
import { useNavigate } from "react-router";
import { useCompanies } from "../../hooks/useCompanies";
import { BusCarousel } from "../../components/home/BusCarousel";

interface RawBus {
  id: string;
  numeroBus: string;
  modelo?: string;
  companyId: string;
  imageUrl?: string; // Viene del backend
}

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
  const [busesByCompany, setBusesByCompany] = useState<
    Array<{ id: string; title: string; imageUrl?: string }>
  >([]);

  // base del backend (quita /api del VITE_API_URL)
  const API_BASE = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "");
  const resolveImage = (src?: string) => {
    if (!src) return undefined;
    if (/^https?:\/\//i.test(src)) return src;
    const needsSlash = src.startsWith("/") ? "" : "/";
    return `${API_BASE}${needsSlash}${src}`;
  };

  // Cargo las empresas al montar
  useEffect(() => {
    refreshCompanies();
  }, [refreshCompanies]);

  // Cada vez que cambie la empresa seleccionada, hago fetch incluyendo un pageSize > 0
  useEffect(() => {
    if (!selectedCompanyId) {
      setBusesByCompany([]);
      return;
    }

    const url = `${import.meta.env.VITE_API_URL}/buses?companyId=${selectedCompanyId}&pageSize=${pageSize}`;
    fetch(url)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        const json = await res.json();
        const raw: RawBus[] = json.data?.items || [];

        // Ya vienen filtrados, pero por si acaso…
        const filtered = raw.filter((bus) => bus.companyId === selectedCompanyId);

        const mapped = filtered.map((bus) => ({
          id: bus.id,
          title: bus.numeroBus,
          imageUrl: resolveImage(bus.imageUrl), // usar la imagen real
        }));

        setBusesByCompany(mapped);
      })
      .catch((err) => {
        console.error("Error cargando buses por empresa", err);
        setBusesByCompany([]);
      });
  }, [selectedCompanyId, pageSize]);

  const companyData = companiesPaginationQuery.data?.data.items || [];
  const totalCompanies = companiesPaginationQuery.data?.data.totalItems || 0;
  const totalPages = Math.max(1, Math.ceil(totalCompanies / pageSize));
  const selectedCompany = companyData.find((c) => c.id === selectedCompanyId);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] bg-gray-100 px-6 py-6 gap-6">
      {/* Panel izquierdo */}
      <section className="lg:w-1/2 bg-white p-6 rounded-xl shadow-sm overflow-y-auto flex flex-col">
        <Title text="Catálogo de Empresas" />

        {/* Filtrado */}
        <div className="mb-6 flex gap-4 border-b pb-4">
            <input
              type="text"
              placeholder="Buscar empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow px-4 py-2 border rounded-md focus:ring-2 focus:ring-cyan-600"
            />
            <select
              value={pageSize}
              onChange={(e) => setPageSize(+e.target.value)}
              className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-cyan-600"
            >
              {[5, 10, 25, 50].map((sz) => (
                <option key={sz} value={sz}>
                  Mostrar {sz}
                </option>
              ))}
            </select>
        </div>

        {/* Lista de empresas */}
        <div className="flex-1">
          {companyData.length === 0 ? (
            <p className="italic text-gray-500">No hay resultados</p>
          ) : (
            <div className="grid gap-4">
              {companyData.map((company) => (
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
            className="px-4 py-2 bg-cyan-700 text-white rounded-md disabled:opacity-50 hover:bg-cyan-800"
          >
            ← Anterior
          </button>
          <span className="text-gray-700 font-medium">
            Página {page} de {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-cyan-700 text-white rounded-md disabled:opacity-50 hover:bg-cyan-800"
          >
            Siguiente →
          </button>
        </div>

        <button
          onClick={() => navigate("/companies/create")}
          className="fixed bottom-6 left-6 bg-cyan-800 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl hover:bg-cyan-900 transition-all flex items-center justify-center group"
        >
          <Briefcase size={24} />
          <span className="absolute left-16 bg-cyan-800 text-white px-3 py-1 rounded-md text-sm font-medium opacity-0 group-hover:opacity-100 transition duration-300 whitespace-nowrap shadow">
            Añadir Empresa
          </span>
        </button>
      </section>

      {/* Panel derecho */}
      <section className="lg:w-1/2 bg-white p-6 rounded-xl shadow-sm overflow-y-auto">
        <Title text="Ficha de Empresa" />
        {selectedCompany ? (
          <div className="space-y-3">
            <h2 className="text-2xl font-bold border-b pb-2">{selectedCompany.name}</h2>
            <p><strong>Email:</strong> {selectedCompany.email}</p>
            <p><strong>Teléfono:</strong> {selectedCompany.phoneNumber}</p>

            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Buses asociados</h3>
              {busesByCompany.length > 0 ? (
                <BusCarousel buses={busesByCompany} />
              ) : (
                <p className="italic text-gray-500">No hay buses asociados.</p>
              )}
            </div>
          </div>
        ) : (
          <p className="italic text-gray-500">Selecciona una empresa para ver sus detalles</p>
        )}
      </section>
    </div>
  );
};
