import { Loader } from "lucide-react";
import { Title } from "../../components/shared/Title";
import { Link, useParams } from "react-router";
import { useCompanies } from "../../hooks/useCompanies";

export const DeleteCompanyPage = () => {
  const { companyId } = useParams();
  const { oneCompanyQuery, deleteCompanyMutation } = useCompanies(companyId);

  if (oneCompanyQuery.isLoading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Loader className="animate-spin text-cyan-600" size={32} />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center px-4">
      <Title text="Eliminar Empresa" />

      {deleteCompanyMutation.isError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mt-4 w-full max-w-2xl">
          <span>{deleteCompanyMutation.error.message}</span>
        </div>
      )}

      <div className="mt-6 w-full max-w-2xl bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            ¿Estás seguro de que deseas eliminar la empresa?
          </h2>
          <p className="mt-2 text-cyan-600 font-bold">
            {oneCompanyQuery.data?.data.name}
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => deleteCompanyMutation.mutate()}
            type="button"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-5 rounded-lg transition"
          >
            Confirmar eliminación
          </button>

          <Link
            to="/companies"
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-5 rounded-lg transition"
          >
            Regresar
          </Link>
        </div>
      </div>
    </div>
  );
};