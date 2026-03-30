import { createFileRoute, redirect } from "@tanstack/react-router";
import { authStore } from "#/features/auth/stores/authStore";

export const Route = createFileRoute("/")({
	beforeLoad: () => {
		// Redirigir a la app si está autenticado, sino a login
		if (authStore.isLoading) {
			return;
		}
		if (authStore.isAuthenticated) {
			throw redirect({ to: "/app" });
		} else {
			throw redirect({ to: "/login" });
		}
	},
	component: HomePage,
});

function HomePage() {
	// Esta página no se muestra, solo redirige
	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="text-center">
				<h1 className="text-2xl font-bold">Redirigiendo...</h1>
				<p className="text-muted-foreground">
					Si no eres redirigido automáticamente,{" "}
					<a href="/login" className="text-primary underline">
						inicia sesión aquí
					</a>
				</p>
			</div>
		</div>
	);
}
