import { createFileRoute } from "@tanstack/react-router";
import { UsersManagement } from "@/features/usuarios/components/UsersManagement";

export const Route = createFileRoute("/_auth/app/admin/users")({
	component: UsersPage,
});

function UsersPage() {
	return <UsersManagement />;
}
