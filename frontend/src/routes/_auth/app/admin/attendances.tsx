import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/app/admin/attendances")({
	component: AttendancesPage,
});

function AttendancesPage() {
	return <div>Attendances management</div>;
}
