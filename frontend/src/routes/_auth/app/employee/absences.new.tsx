import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/app/employee/absences/new")({
	component: NewAbsencePage,
});

function NewAbsencePage() {
	return <div>New Absence Request</div>;
}
