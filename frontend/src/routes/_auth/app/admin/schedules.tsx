// src/routes/_auth/app/admin/schedules.tsx
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/app/admin/schedules")({
  component: SchedulesPage,
});

function SchedulesPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Horarios</h1>
      <nav className="space-y-2">
        <Link to="/_auth/app/admin/" className="text-blue-600 hover:underline">← Admin</Link>
      </nav>
    </div>
  );
}
