// Hook de autenticación con resolución de usuario app y rol

import type { Session, User } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "#/lib/supabase";
import type { RolRow, SignInResult, UsuarioRow } from "../types/auth.types";
import {
	getAzureRedirectUrl,
	OAUTH_PROVIDER_AZURE,
	ROL_NOMBRE_ADMIN,
} from "../types/auth.types";

// Nombre del rol admin en la base de datos
const ADMIN_ROL_NOMBRE = ROL_NOMBRE_ADMIN;

/**
 * Hook principal de autenticación
 * Expone sesión, usuario app, rol y funciones de auth
 */
export function useAuth() {
	const [session, setSession] = useState<Session | null>(null);
	const [authUser, setAuthUser] = useState<User | null>(null);
	const [usuarioApp, setUsuarioApp] = useState<UsuarioRow | null>(null);
	const [rol, setRol] = useState<RolRow | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Helper para cargar usuario app y rol desde la BD
	const cargarUsuarioApp = useCallback(
		async (supabaseUserId: string, email?: string) => {
			// Intentar buscar por SupabaseUserId primero
			const { data: usuario } = await supabase
				.from("USUARIOS")
				.select("*, ROLES(*)")
				.eq("SupabaseUserId", supabaseUserId)
				.single();

			if (usuario) {
				// Encontrado por ID directo
				setUsuarioApp(usuario);
				setRol(usuario.ROLES || null);
				return;
			}

			// Fallback Azure: buscar por email si el proveedor es Azure
			if (email) {
				const { data: usuarioEmail } = await supabase
					.from("USUARIOS")
					.select("*, ROLES(*)")
					.eq("CorreoInstitucional", email)
					.is("SupabaseUserId", null)
					.single();

				if (usuarioEmail) {
					// Enlazar el usuario solo si SupabaseUserId está vacío
					const { data: actualizado } = await supabase
						.from("USUARIOS")
						.update({ SupabaseUserId: supabaseUserId })
						.eq("IdUsuario", usuarioEmail.IdUsuario)
						.select("*, ROLES(*)")
						.single();

					if (actualizado) {
						setUsuarioApp(actualizado);
						setRol(actualizado.ROLES || null);
						return;
					}
				}
			}

			// No se encontró usuario app
			setUsuarioApp(null);
			setRol(null);
		},
		[],
	);

	// Suscripción a cambios de auth
	useEffect(() => {
		// Cargar sesión inicial
		supabase.auth.getSession().then(({ data }) => {
			const currentSession = data.session;
			setSession(currentSession);
			setAuthUser(currentSession?.user ?? null);

			if (currentSession?.user) {
				cargarUsuarioApp(currentSession.user.id, currentSession.user.email);
			}

			setIsLoading(false);
		});

		// Escuchar cambios de auth
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, newSession) => {
			setSession(newSession);
			setAuthUser(newSession?.user ?? null);

			if (event === "SIGNED_IN" && newSession?.user) {
				await cargarUsuarioApp(newSession.user.id, newSession.user.email);
			} else if (event === "SIGNED_OUT") {
				setUsuarioApp(null);
				setRol(null);
			}
		});

		return () => subscription.unsubscribe();
	}, [cargarUsuarioApp]);

	// Iniciar sesión con email/password
	const signInWithPassword = useCallback(
		async (email: string, password: string): Promise<SignInResult> => {
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) {
				return { error: { message: error.message }, success: false };
			}

			return { error: null, success: true };
		},
		[],
	);

	// Iniciar sesión con Microsoft/Azure OAuth
	const signInWithMicrosoft = useCallback(async (): Promise<void> => {
		await supabase.auth.signInWithOAuth({
			provider: OAUTH_PROVIDER_AZURE,
			options: {
				redirectTo: getAzureRedirectUrl(),
				scopes: "email",
			},
		});
	}, []);

	// Cerrar sesión
	const signOut = useCallback(async (): Promise<void> => {
		await supabase.auth.signOut();
	}, []);

	// Helpers derivados
	const isAuthenticated = session !== null && authUser !== null;
	const isAdmin =
		rol !== null && rol.NombreRol.toUpperCase() === ADMIN_ROL_NOMBRE;

	return {
		session,
		authUser,
		usuarioApp,
		rol,
		isAdmin,
		isAuthenticated,
		isLoading,
		signInWithPassword,
		signInWithMicrosoft,
		signOut,
	};
}

// Estado completo para pasar por contexto
export type AuthContext = ReturnType<typeof useAuth>;
