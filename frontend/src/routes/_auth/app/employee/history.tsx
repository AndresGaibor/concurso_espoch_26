// src/routes/_auth/app/employee/history.tsx
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/app/employee/history")({
  component: EmployeeHistoryPage,
});

function EmployeeHistoryPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mi Historial</h1>
      <nav className="space-y-2">
        <Link to="/_auth/app/employee/" className="text-blue-600 hover:underline">← Empleado</Link>
      </nav>
    </div>
  );
}
