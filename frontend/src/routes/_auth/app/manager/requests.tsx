// src/routes/_auth/app/manager/requests.tsx
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/app/manager/requests")({
  component: RequestsPage,
});

function RequestsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Solicitudes</h1>
      <nav className="space-y-2">
        <Link to="/_auth/app/manager/" className="text-blue-600 hover:underline">← Gerente</Link>
      </nav>
    </div>
  );
}
