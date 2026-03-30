import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/app/admin/absences")({
	component: AbsencesPage,
});

function AbsencesPage() {
	return <div>Absences management</div>;
}
