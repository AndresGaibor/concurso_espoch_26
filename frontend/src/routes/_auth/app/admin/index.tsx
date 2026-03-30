// src/routes/_auth/app/admin/index.tsx
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/app/admin/")({
  component: AdminDashboard,
});

function AdminIndexPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
      <nav className="space-y-2">
        <Link
          to="/_auth/app/admin/users"
          className="block text-blue-600 hover:underline"
        >
          Usuarios
        </Link>
        <Link
          to="/_auth/app/admin/locations"
          className="block text-blue-600 hover:underline"
        >
          Ubicaciones
        </Link>
        <Link
          to="/_auth/app/admin/schedules"
          className="block text-blue-600 hover:underline"
        >
          Horarios
        </Link>
        <Link
          to="/_auth/app/admin/attendances"
          className="block text-blue-600 hover:underline"
        >
          Asistencias
        </Link>
        <Link
          to="/_auth/app/admin/absences"
          className="block text-blue-600 hover:underline"
        >
          Ausencias
        </Link>
        <Link
          to="/_auth/app/"
          className="block text-gray-600 hover:underline mt-4"
        >
          ← Volver
        </Link>
      </nav>
    </div>
  );
}
