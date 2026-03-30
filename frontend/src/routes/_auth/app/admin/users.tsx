import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/app/admin/users")({
	component: UsersPage,
});

function UsersPage() {
	return <div>Users management</div>;
}
