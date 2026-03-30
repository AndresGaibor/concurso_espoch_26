import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/app/admin/locations")({
	component: LocationsPage,
});

function LocationsPage() {
	return <div>Locations management</div>;
}
