// Tipos para el dominio de autenticación
import type { Session, User } from "@supabase/supabase-js";
import type { Database } from "#/types/database";

// Tipos base de la base de datos
export type UsuarioRow = Database["public"]["Tables"]["USUARIOS"]["Row"];
export type RolRow = Database["public"]["Tables"]["ROLES"]["Row"];

// Estado del provider de autenticación
export interface AuthState {
	// Sesión de Supabase
	session: Session | null;
	// Usuario de Supabase Auth
	authUser: User | null;
	// Usuario de la aplicación (USUARIOS)
	usuarioApp: UsuarioRow | null;
	// Rol del usuario (ROLES)
	rol: RolRow | null;
}

// Helpers derivados
export type IsAuthenticated = AuthState["session"] extends Session
	? true
	: false;
export type IsAdmin = AuthState["rol"] extends { NombreRol: string }
	? AuthState["rol"]["NombreRol"] extends "ADMIN"
		? true
		: false
	: false;

// Resultado de operaciones de auth
export interface SignInResult {
	error: AuthError | null;
	success: boolean;
}

export interface AuthError {
	message: string;
	status?: number;
}

// Constantes de roles (valores esperados en la BD)
export const ROL_NOMBRE_ADMIN = "ADMIN" as const;
export const ROL_NOMBRE_USUARIO = "USUARIO" as const;

// Proveedores de OAuth soportados
export const OAUTH_PROVIDER_AZURE = "azure" as const;
export type OAuthProvider = typeof OAUTH_PROVIDER_AZURE | "google" | "github";

// URLs de redirect
export const getAzureRedirectUrl = (): string => {
	return `${window.location.origin}/auth/callback`;
};
