// src/routes/unauthorized.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/unauthorized")({
  component: UnauthorizedPage,
});

function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">403 - Acceso Denegado</h1>
        <p className="mt-4">No tienes permisos para ver esta página.</p>
        <a href="/login" className="mt-6 inline-block text-blue-600 hover:underline">
          Volver al login
        </a>
      </div>
    </div>
  );
}
