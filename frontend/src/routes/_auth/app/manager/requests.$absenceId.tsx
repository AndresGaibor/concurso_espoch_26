import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/app/manager/requests/$absenceId")({
	component: RequestDetailPage,
});

function RequestDetailPage() {
	const { absenceId } = Route.useParams();
	return <div>Request Detail: {absenceId}</div>;
}
