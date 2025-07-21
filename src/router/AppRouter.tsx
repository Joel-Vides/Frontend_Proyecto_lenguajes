import { Route, Routes } from "react-router"
import { HomePage } from "../presentation/pages/home/HomePage"
import { Navbar } from "../presentation/components/layout/Navbar"
import { BusesPage } from "../presentation/pages/buses/BusesPage"
import { CompaniesPage } from "../presentation/pages/companies/CompaniesPage"

export const AppRouter = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Routes>
                <Route element={<Navbar/>}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/companies" element={<CompaniesPage />} />
                    <Route path="/buses" element={<BusesPage />} />
                </Route>

            </Routes>
        </div>
    )
}