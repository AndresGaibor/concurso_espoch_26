// src/routes/login.tsx
import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "#/lib/supabase";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  return <div>Login form aquí</div>;
}
