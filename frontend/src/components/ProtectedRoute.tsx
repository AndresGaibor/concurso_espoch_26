import { Navigate } from "@tanstack/react-router";
import { useAuth } from "#/features/auth/hooks/useAuth";

// Deprecated: usar TanStack Router guards (_auth.tsx pathless routes) en su lugar
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const { isAuthenticated: user, isLoading: loading } = useAuth();

	if (loading) return <div>Cargando...</div>;
	if (!user) return <Navigate to="/login" replace />;

	return <>{children}</>;
}
