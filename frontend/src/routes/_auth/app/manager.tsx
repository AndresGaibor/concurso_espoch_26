// src/routes/_auth/app/manager.tsx
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/app/manager")({
  component: ManagerLayout,
});

function ManagerLayout() {
  return <Outlet />;
}
