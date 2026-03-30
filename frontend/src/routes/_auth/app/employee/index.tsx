// src/routes/_auth/app/employee/index.tsx
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/app/employee/")({
  component: EmployeeIndexPage,
});

function EmployeeIndexPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Panel del Empleado</h1>
      <nav className="space-y-2">
        <Link to="/_auth/app/employee/attendance" className="block text-blue-600 hover:underline">Registrar Asistencia</Link>
        <Link to="/_auth/app/employee/absences" className="block text-blue-600 hover:underline">Mis Ausencias</Link>
        <Link to="/_auth/app/employee/history" className="block text-blue-600 hover:underline">Mi Historial</Link>
        <Link to="/_auth/app/" className="block text-gray-600 hover:underline mt-4">← Inicio</Link>
      </nav>
    </div>
  );
}
