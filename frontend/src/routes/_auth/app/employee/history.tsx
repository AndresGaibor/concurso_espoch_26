import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/app/employee/history")({
	component: HistoryPage,
});

function HistoryPage() {
	return <div>Employee History</div>;
}
