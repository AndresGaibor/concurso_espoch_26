import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/app/manager/requests")({
	component: RequestsPage,
});

function RequestsPage() {
	return <div>Manager Requests</div>;
}
