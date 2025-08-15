import { create } from "zustand";
import type { LoginModel } from "../../../core/models/login.model";
import { loginAction } from "../../../core/actions/security/login.action";
import type { Role } from "../../../infrastructure/enums/role.enum";

export interface jwtPayload {
    "https://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
    jti: string;
    userId: string;
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": Role | Role[];
    exp: number;
    iss: string;
    aud: string;
}

interface AuthStore {
    token?: string;
    refreshToken?: string,
    email?: string;
    roles?: Role[];
    authenticated: boolean;
    errorMessage?: string;
    login: (login: LoginModel) => void;
    logout: () => void;
    setTokens: (token: string, refreshToken: string) => void;
}

const storedToken = localStorage.getItem('token') || undefined;
const storedEmail = localStorage.getItem('email') || undefined;
const storedPayload = getPayload(storedToken);
const storedRoles = getRolesFromPayload(storedPayload);
const storedRefreshToken = localStorage.getItem('refreshToken') || undefined;

export const useAuthStore = create<AuthStore>()((set) => ({
    token: storedToken,
    refreshToken: storedRefreshToken,
    email: storedEmail,
    roles: storedRoles,
    errorMessage: undefined,
    authenticated: isTokenValue(storedToken),
    login: async (login: LoginModel) => {

        set({ errorMessage: "Falló el Inicio de Sesión" })

        const response = await loginAction(login);

        if (response.status && response.data) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("email", response.data.email);
            localStorage.setItem("refreshToken", response.data.refreshToken);
            const payload = getPayload(response.data!.token);
            const roles = getRolesFromPayload(payload);

            set({
                token: response.data.token,
                refreshToken: response.data.refreshToken,
                email: response.data.email,
                authenticated: true,
                roles: roles
            });

            return;
        }

        set({ errorMessage: response.message, authenticated: false })
        return;

    },
    setTokens: (token: string, refreshToken: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);

        const payload = getPayload(token);
        const roles = getRolesFromPayload(payload);

        set({
            token,
            refreshToken,
            roles,
            authenticated: isTokenValue(token)
        })
    },
    logout: async () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("refreshToken");

        set({ token: undefined, email: undefined, refreshToken: undefined, authenticated: false })
    }
}))

function isTokenValue(token?: string): boolean {
    const payload = getPayload(token)
    if (!payload || !payload.exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
}

function getRolesFromPayload(payload: jwtPayload | undefined): Role[] | undefined {
    if (!payload) return undefined;
    const claim = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
    const roles = payload[claim];
    if (!roles) return undefined;
    if (Array.isArray(roles)) return roles as Role[];
    return [roles as Role];
}

function getPayload(token?: string): jwtPayload | undefined {
    if (!token) return undefined;
    try {
        return JSON.parse(atob(token.split('.')[1])) as jwtPayload;
    } catch {
        return undefined;
    }
}