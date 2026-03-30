// src/routes/_auth/app/admin/attendances.tsx
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/app/admin/attendances")({
  component: AdminAttendancesPage,
});

function AdminAttendancesPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Asistencias (Admin)</h1>
      <nav className="space-y-2">
        <Link to="/_auth/app/admin/" className="text-blue-600 hover:underline">← Admin</Link>
      </nav>
    </div>
  );
}
