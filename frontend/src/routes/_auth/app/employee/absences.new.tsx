// src/routes/_auth/app/employee/absences.new.tsx
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/app/employee/absences/new")({
  component: NewAbsencePage,
});

function NewAbsencePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Nueva Ausencia</h1>
      <nav className="space-y-2">
        <Link to="/_auth/app/employee/absences" className="text-blue-600 hover:underline">← Mis Ausencias</Link>
      </nav>
    </div>
  );
}
