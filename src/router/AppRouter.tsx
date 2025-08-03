import { Route, Routes } from "react-router"
import { HomePage } from "../presentation/pages/home/HomePage"
import { Navbar } from "../presentation/components/layout/Navbar"
import { CompaniesPage } from "../presentation/pages/companies/CompaniesPage"
import { CreateCompanyPage } from "../presentation/pages/companies/CreateCompanyPage"
import { EditCompanyPage } from "../presentation/pages/companies/EditCompanyPage"
import { DeleteCompanyPage } from "../presentation/pages/companies/DeleteCompanyPage"
import { CreateBusPage } from "../presentation/pages/home/CreateBusPage"
import { EditBusPage } from "../presentation/pages/home/EditBusPage"
import { DeleteBusPage } from "../presentation/pages/home/DeleteBusPage"

export const AppRouter = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Routes>
                <Route element={<Navbar />}>
                    {/* Rutas de Paginas de Empresas */}
                    <Route path="/companies" element={<CompaniesPage />} />
                    <Route path="/companies/create" element={<CreateCompanyPage />}></Route>
                    <Route path="/companies/:companyId/edit" element={<EditCompanyPage />}></Route>
                    <Route path="/companies/:companyId/delete" element={<DeleteCompanyPage />}></Route>

                    {/* Rutas de Páginas de Buses */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/buses/create" element={<CreateBusPage />}></Route>
                    <Route path="/buses/:busId/edit" element={<EditBusPage />}></Route>
                    <Route path="/buses/:busId/delete" element={<DeleteBusPage />}></Route>

                </Route>

            </Routes>
        </div>
    )
}