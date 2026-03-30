// src/routes/_auth/app/manager/history.tsx
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/app/manager/history")({
  component: ManagerHistoryPage,
});

function ManagerHistoryPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Historial (Gerente)</h1>
      <nav className="space-y-2">
        <Link to="/_auth/app/manager/" className="text-blue-600 hover:underline">← Gerente</Link>
      </nav>
    </div>
  );
}
