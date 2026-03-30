import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/app/admin/schedules")({
	component: SchedulesPage,
});

function SchedulesPage() {
	return <div>Schedules management</div>;
}
