import { createFileRoute, Navigate } from "@tanstack/react-router";
import { authStore } from "#/features/auth/stores/authStore";

export const Route = createFileRoute("/_auth/app/")({
	component: AppIndex,
});

function AppIndex() {
	const { isAdmin, isManager, isEmployee } = authStore;

	if (isAdmin) {
		return <Navigate to="/app/admin" />;
	}
	if (isManager) {
		return <Navigate to="/app/manager" />;
	}
	if (isEmployee) {
		return <Navigate to="/app/employee" />;
	}

	// Temporalmente permite cualquier usuario autenticado (sin verificar rol)
	// TODO: remover esta línea cuando se implemente la creación automática de usuarios OAuth
	return <Navigate to="/app/admin" />;
}
