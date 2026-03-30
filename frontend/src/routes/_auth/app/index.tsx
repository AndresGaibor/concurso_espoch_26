// src/routes/_auth/app/index.tsx
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/app/")({
  component: AppIndexPage,
});

function AppIndexPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Página Principal</h1>
      <nav className="space-y-2">
        <Link to="/_auth/app/profile" className="block text-blue-600 hover:underline">Perfil</Link>
        <Link to="/_auth/app/employee" className="block text-blue-600 hover:underline">Empleado</Link>
        <Link to="/_auth/app/manager" className="block text-blue-600 hover:underline">Gerente</Link>
        <Link to="/_auth/app/admin" className="block text-blue-600 hover:underline">Admin</Link>
      </nav>
    </div>
  );
}
