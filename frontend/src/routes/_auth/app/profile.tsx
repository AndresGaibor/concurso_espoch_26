import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/app/profile")({
	component: ProfilePage,
});

function ProfilePage() {
	return <div>Profile page</div>;
}
