// src/routes/_auth/app/manager/requests.$absenceId.tsx
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/app/manager/requests/$absenceId")({
  component: RequestDetailPage,
});

function RequestDetailPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Detalle de Solicitud</h1>
      <nav className="space-y-2">
        <Link to="/_auth/app/manager/requests" className="text-blue-600 hover:underline">← Solicitudes</Link>
      </nav>
    </div>
  );
}
