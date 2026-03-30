import type { Session, User } from "@supabase/supabase-js";
import type { RolRow, UsuarioRow } from "../types/auth.types";
import {
	ROL_NOMBRE_ADMIN,
	ROL_NOMBRE_EMPLOYEE,
	ROL_NOMBRE_MANAGER,
} from "../types/auth.types";

export interface AuthStore {
	session: Session | null;
	authUser: User | null;
	usuarioApp: UsuarioRow | null;
	rol: RolRow | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	isAdmin: boolean;
	isManager: boolean;
	isEmployee: boolean;
}

export const authStore: AuthStore = {
	session: null,
	authUser: null,
	usuarioApp: null,
	rol: null,
	isLoading: true,
	isAuthenticated: false,
	isAdmin: false,
	isManager: false,
	isEmployee: false,
};

export function updateAuthStore(partial: Partial<AuthStore>): void {
	Object.assign(authStore, partial);
	if (partial.session !== undefined || partial.authUser !== undefined) {
		authStore.isAuthenticated =
			authStore.session !== null && authStore.authUser !== null;
	}
	if (partial.rol !== undefined) {
		const rolName = authStore.rol?.NombreRol?.toUpperCase() ?? "";
		authStore.isAdmin = rolName === ROL_NOMBRE_ADMIN;
		authStore.isManager = rolName === ROL_NOMBRE_MANAGER;
		authStore.isEmployee = rolName === ROL_NOMBRE_EMPLOYEE;
	}
}

export function resetAuthStore(): void {
	authStore.session = null;
	authStore.authUser = null;
	authStore.usuarioApp = null;
	authStore.rol = null;
	authStore.isLoading = false;
	authStore.isAuthenticated = false;
	authStore.isAdmin = false;
	authStore.isManager = false;
	authStore.isEmployee = false;
}
