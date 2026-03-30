import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { authStore } from "#/features/auth/stores/authStore";

export const Route = createFileRoute("/_auth/admin/_auth/admin")({
	beforeLoad: ({ location }) => {
		if (!authStore.isAuthenticated) {
			throw redirect({
				to: "/login",
				search: { redirect: location.href },
			});
		}
		if (!authStore.isAdmin) {
			throw redirect({
				to: "/",
				search: { redirect: location.href },
			});
		}
		if (authStore.isLoading) {
			throw redirect({ to: "/login" });
		}
	},
	component: () => <Outlet />,
});
