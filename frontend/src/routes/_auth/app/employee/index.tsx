import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/app/employee/")({
	component: EmployeeDashboard,
});

function EmployeeDashboard() {
	return <div>Employee Dashboard</div>;
}
