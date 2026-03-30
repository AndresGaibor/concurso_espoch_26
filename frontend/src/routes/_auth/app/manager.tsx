import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { authStore } from "#/features/auth/stores/authStore";

export const Route = createFileRoute("/_auth/app/manager")({
	beforeLoad: ({ location }) => {
		if (authStore.isLoading) {
			return;
		}
		if (!authStore.isAuthenticated) {
			throw redirect({
				to: "/login",
				search: { redirect: location.href },
			});
		}
		if (!authStore.isManager) {
			throw redirect({
				to: "/unauthorized",
			});
		}
	},
	component: () => <Outlet />,
});
