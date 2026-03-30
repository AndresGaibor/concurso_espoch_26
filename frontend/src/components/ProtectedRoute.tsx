// src/components/ProtectedRoute.tsx
import { Navigate } from "@tanstack/react-router";
import { useAuth } from "#/features/auth/hooks/useAuth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
