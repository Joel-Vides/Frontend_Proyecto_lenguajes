import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../../pages/stores/authStore";

export const PrivateRoute = () => {

    const { authenticated } = useAuthStore();

    if (!authenticated) {
        return <Navigate to="/auth/login" replace />
    }

    return (
        <Outlet />
    )
}