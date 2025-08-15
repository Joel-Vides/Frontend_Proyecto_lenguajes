import { Navigate, Route, Routes } from "react-router"
import { HomePage } from "../presentation/pages/home/HomePage"
import { Navbar } from "../presentation/components/layout/Navbar"
import { CompaniesPage } from "../presentation/pages/companies/CompaniesPage"
import { CreateCompanyPage } from "../presentation/pages/companies/CreateCompanyPage"
import { EditCompanyPage } from "../presentation/pages/companies/EditCompanyPage"
import { DeleteCompanyPage } from "../presentation/pages/companies/DeleteCompanyPage"
import { CreateBusPage } from "../presentation/pages/home/CreateBusPage"
import { EditBusPage } from "../presentation/pages/home/EditBusPage"
import { DeleteBusPage } from "../presentation/pages/home/DeleteBusPage"
import { EditRouteBusPage } from "../presentation/pages/home/EditRouteBusPage"
import { BuyTicketPage } from "../presentation/pages/tickets/BuyTicketPage"
import { PrivateRoute } from "../presentation/components/shared/PrivateRouter"
import { LoginPage } from "../presentation/pages/home/security/LoginPage"
import { useAuthStore } from "../presentation/pages/stores/authStore"

export const AppRouter = () => {
    const { authenticated } = useAuthStore();
    return (
        <div className="min-h-screen bg-gray-100">
            <Routes>
                {/* Rutas Protegidas */}
                <Route element={<PrivateRoute />}>

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
                        <Route path="/buses/:busId/editRoute" element={<EditRouteBusPage />}></Route>
                        <Route path="/buses/:busId/delete" element={<DeleteBusPage />}></Route>

                        {/* Rutas Tickets */}
                        <Route path="/tickets/buy/:busId" element={<BuyTicketPage />} />

                    </Route>

                </Route>

                {/* Rutas Públicas */}
                <Route path="/auth">
                    <Route path="login" element={authenticated ? <Navigate to="/" replace /> : <LoginPage />} />
                </Route>
            </Routes>
        </div>
    )
}