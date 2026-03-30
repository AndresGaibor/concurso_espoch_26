// Ruta: Callback de OAuth (Azure AD)
// Procesa el hash de autenticación y redirige al dashboard
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "#/lib/supabase";

export const Route = createFileRoute("/auth/callback")({
	component: AuthCallback,
});

export function AuthCallback() {
	const [status, setStatus] = useState<"loading" | "success" | "error">(
		"loading",
	);

	useEffect(() => {
		// Verificar sesión después de que Supabase procese el hash
		const verificarSesion = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (session) {
				setStatus("success");
				// Pequeño delay para que el usuario vea el mensaje
				setTimeout(() => {
					window.location.href = "/app";
				}, 500);
			} else {
				setStatus("error");
				setTimeout(() => {
					window.location.href = "/login";
				}, 2000);
			}
		};

		verificarSesion();

		// También escuchar cambios de auth
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			if (session) {
				setStatus("success");
				window.location.href = "/app";
			}
		});

		return () => subscription.unsubscribe();
	}, []);

	return (
		<div className="flex min-h-screen items-center justify-center bg-background">
			{status === "loading" && (
				<div className="text-center">
					<div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
					<p className="text-muted-foreground">Procesando autenticación...</p>
				</div>
			)}
			{status === "success" && (
				<div className="text-center">
					<p className="text-green-600 font-medium">Autenticación exitosa</p>
					<p className="text-muted-foreground text-sm">Redirigiendo...</p>
				</div>
			)}
			{status === "error" && (
				<div className="text-center">
					<p className="text-destructive font-medium">Error de autenticación</p>
					<p className="text-muted-foreground text-sm">
						Redirigiendo al login...
					</p>
				</div>
			)}
		</div>
	);
}
