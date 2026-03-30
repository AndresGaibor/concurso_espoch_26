// src/routes/_auth/app/profile.tsx
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/app/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mi Perfil</h1>
      <nav className="space-y-2">
        <Link to="/_auth/app/" className="text-blue-600 hover:underline">← Inicio</Link>
      </nav>
    </div>
  );
}
