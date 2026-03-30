import { createFileRoute } from "@tanstack/react-router";
import { PortalLogin } from "@/features/auth/components/PortalLogin";

export const Route = createFileRoute("/login")({
	component: LoginPage,
});

function LoginPage() {
	return <PortalLogin />;
}
