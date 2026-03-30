// src/routes/_auth/app.tsx
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppLayout } from "#/components/layout/AppLayout";

export const Route = createFileRoute("/_auth/app")({
  component: AppLayoutRoute,
});

function AppLayoutRoute() {
  return <AppLayout />;
}
