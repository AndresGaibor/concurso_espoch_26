import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { authStore } from "#/features/auth/stores/authStore";

export const Route = createFileRoute("/_auth")({
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
	},
	component: () => <Outlet />,
});
