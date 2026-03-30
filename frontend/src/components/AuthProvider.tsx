import { useEffect } from "react";
import {
	resetAuthStore,
	updateAuthStore,
} from "#/features/auth/stores/authStore";
import type { RolRow, UsuarioRow } from "#/features/auth/types/auth.types";
import { supabase } from "#/lib/supabase";

export function AuthProvider({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		async function cargarUsuarioApp(
			supabaseUserId: string,
			email?: string,
		): Promise<{ usuario: UsuarioRow | null; rol: RolRow | null }> {
			const { data: usuario } = await supabase
				.from("USUARIOS")
				.select("*, ROLES(*)")
				.eq("SupabaseUserId", supabaseUserId)
				.single();

			if (usuario) {
				return { usuario, rol: usuario.ROLES || null };
			}

			if (email) {
				const { data: usuarioEmail } = await supabase
					.from("USUARIOS")
					.select("*, ROLES(*)")
					.eq("CorreoInstitucional", email)
					.is("SupabaseUserId", null)
					.single();

				if (usuarioEmail) {
					const { data: actualizado } = await supabase
						.from("USUARIOS")
						.update({ SupabaseUserId: supabaseUserId })
						.eq("IdUsuario", usuarioEmail.IdUsuario)
						.select("*, ROLES(*)")
						.single();

					if (actualizado) {
						return {
							usuario: actualizado,
							rol: actualizado.ROLES || null,
						};
					}
				}
			}

			return { usuario: null, rol: null };
		}

		supabase.auth.getSession().then(({ data }) => {
			const currentSession = data.session;
			updateAuthStore({
				session: currentSession,
				authUser: currentSession?.user ?? null,
				isLoading: true,
			});

			if (currentSession?.user) {
				cargarUsuarioApp(
					currentSession.user.id,
					currentSession.user.email,
				).then(({ usuario, rol }) => {
					updateAuthStore({
						usuarioApp: usuario,
						rol,
						isLoading: false,
					});
				});
			} else {
				updateAuthStore({ isLoading: false });
			}
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, newSession) => {
			updateAuthStore({
				session: newSession,
				authUser: newSession?.user ?? null,
			});

			if (event === "SIGNED_IN" && newSession?.user) {
				const { usuario, rol } = await cargarUsuarioApp(
					newSession.user.id,
					newSession.user.email,
				);
				updateAuthStore({ usuarioApp: usuario, rol });
			} else if (event === "SIGNED_OUT") {
				resetAuthStore();
			}
		});

		return () => subscription.unsubscribe();
	}, []);

	return <>{children}</>;
}
