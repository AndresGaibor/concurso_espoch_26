import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/app/manager/")({
	component: ManagerDashboard,
});

function ManagerDashboard() {
	return <div>Manager Dashboard</div>;
}
