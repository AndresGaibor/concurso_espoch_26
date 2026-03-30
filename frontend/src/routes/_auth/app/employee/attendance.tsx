import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/app/employee/attendance")({
	component: AttendancePage,
});

function AttendancePage() {
	return <div>Employee Attendance</div>;
}
