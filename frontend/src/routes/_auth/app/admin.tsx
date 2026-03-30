// src/routes/_auth/app/admin.tsx
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/app/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return <Outlet />;
}
