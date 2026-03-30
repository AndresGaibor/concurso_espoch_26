// src/routes/_auth/app/manager/index.tsx
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/app/manager/")({
  component: ManagerIndexPage,
});

function ManagerIndexPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Panel del Gerente</h1>
      <nav className="space-y-2">
        <Link to="/_auth/app/manager/requests" className="block text-blue-600 hover:underline">Solicitudes</Link>
        <Link to="/_auth/app/manager/history" className="block text-blue-600 hover:underline">Historial</Link>
        <Link to="/_auth/app/" className="block text-gray-600 hover:underline mt-4">← Inicio</Link>
      </nav>
    </div>
  );
}
