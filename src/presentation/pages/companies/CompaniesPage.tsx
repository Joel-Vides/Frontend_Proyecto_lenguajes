import { Briefcase, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { DashboardCard } from "../../components/home/DashBoardCard"
import { Title } from "../../components/shared/Title"
import { useNavigate } from "react-router"
import { useCompanies } from "../../hooks/useCompanies"

export const CompaniesPage = () => {
  const navigate = useNavigate()

  const {
    companiesPaginationQuery,
    refreshCompanies,
  } = useCompanies()

  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null)

  // Recarga la lista al regresar desde CreateCompanyPage
  useEffect(() => {
    refreshCompanies()
  }, [])

  // Extrae las empresas desde la data
  const companyData = companiesPaginationQuery.data?.data.items || []

  const selectedCompany = companyData.find(company => company.id === selectedCompanyId)

  return (
    <div className="flex h-screen">
      {/* Empresas */}
      <div className="w-1/2 border-r p-4 overflow-y-auto">
        <Title text="Empresas" />
        {companyData.map((company) => (
          <DashboardCard
            key={company.id}
            title={company.name}
            icon={<Briefcase size={48} />}
            onClick={() => setSelectedCompanyId(company.id)}
          />
        ))}

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

      {/* Detalles de las Empresas */}
      <div className="w-1/2 p-4 overflow-y-auto">
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
  )
}