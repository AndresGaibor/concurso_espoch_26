import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/app/admin/")({
	component: AdminDashboard,
});

function AdminDashboard() {
	return <div>Admin Dashboard</div>;
}
