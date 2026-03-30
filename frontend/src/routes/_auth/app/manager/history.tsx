import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/app/manager/history")({
	component: ManagerHistoryPage,
});

function ManagerHistoryPage() {
	return <div>Manager History</div>;
}
