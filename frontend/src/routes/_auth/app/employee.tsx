// src/routes/_auth/app/employee.tsx
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/app/employee")({
  component: EmployeeLayout,
});

function EmployeeLayout() {
  return <Outlet />;
}
