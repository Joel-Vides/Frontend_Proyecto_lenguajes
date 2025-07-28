import { Loader } from "lucide-react";
import { Title } from "../../components/shared/Title";
import { Link, useParams } from "react-router";
import { useCompanies } from "../../hooks/useCompanies";

export const DeleteCompanyPage = () => {
  const { companyId } = useParams();
  const { oneCompanyQuery, deleteCompanyMutation } = useCompanies(companyId);

  if (oneCompanyQuery.isLoading) {
    return <Loader />
  }
console.log(companyId);

  return (
    
    <div className="w-full flex flex-col">
      <Title text="Borrar Empresa" />

      {deleteCompanyMutation.isError && (
        <div className="bg-red-200 border border-red-400 text-red-700 px-4 py-3 rounded">
          <span>{deleteCompanyMutation.error.message}</span>
        </div>
      )}

      <div className="mt-6 w-full text-center mb-4">
        <label className="block text-gray-700 text-sm font-bold mt-2">
          ¿Desea Borrar la Empresa: {oneCompanyQuery.data?.data.name}?
        </label>
      </div>

      <div className="flex items-center content-center justify-center gap-2">
        <button
          onClick={() => deleteCompanyMutation.mutate()}
          type="button"
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
        >
          Confirmar
        </button>

        <Link
          to="/companies"
          className="bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-2 px-4 rounded focus:outline-none"
        >
          Regresar
        </Link>
      </div>

    </div>
  )
}
