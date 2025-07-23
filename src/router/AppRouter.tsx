import { Route, Routes } from "react-router"
import { HomePage } from "../presentation/pages/home/HomePage"
import { Navbar } from "../presentation/components/layout/Navbar"
import { BusesPage } from "../presentation/pages/buses/BusesPage"
import { CompaniesPage } from "../presentation/pages/companies/CompaniesPage"
import { CreateCompanyPage } from "../presentation/pages/companies/CreateCompanyPage"
import { EditCompanyPage } from "../presentation/pages/companies/EditCompanyPage"
import { DeleteCompanyPage } from "../presentation/pages/companies/DeleteCompanyPage"

export const AppRouter = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Routes>
                <Route element={<Navbar/>}>
                {/* Rutas de Paginas de Empresas */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/companies" element={<CompaniesPage />} />
                    <Route path="/companies/create" element={<CreateCompanyPage/>}></Route>
                    <Route path="/companies/:countryId/edit" element={<EditCompanyPage/>}></Route>
                    <Route path="/companies/:countryId/delete" element={<DeleteCompanyPage/>}></Route>

                {/* Rutas de Páginas de Buses */}
                    <Route path="/buses" element={<BusesPage />} />
                </Route>

            </Routes>
        </div>
    )
}