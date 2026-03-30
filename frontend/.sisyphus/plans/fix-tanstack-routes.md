# Plan: Arreglar conflicto de rutas en TanStack Router

## TL;DR

> **Problema**: La carpeta `src/routes/_auth/` está vacía pero `routeTree.gen.ts` intenta importar `./routes/_auth/index`, causando error de Vite. Además hay conflicto de rutas entre `index.tsx` y `_auth/index.tsx` por la raíz `/`.

> **Solución**: Eliminar la carpeta vacía `_auth/`, eliminar `index.tsx` (ya que `_auth.tsx` con su beforeLoad es el layout protegido), y mover el contenido del dashboard a `_auth.tsx` como `component`.

---

## Contexto

### Estado Actual de Rutas
```
src/routes/
├── __root.tsx      → layout raíz con Header
├── _auth.tsx       → layout pathless con auth (antes era index de /)
├── _auth/          → CARPETA VACÍA (¡el problema!)
├── index.tsx       → página principal (CONFLICTO con _auth)
├── about.tsx       → /about
└── login.tsx       → /login
```

### Error Actual
```
[vite:import-analysis] Failed to resolve import "./routes/_auth/index"
from "src/routeTree.gen.ts"
```

### Conflicto de Rutas
- `src/routes/index.tsx` → `createFileRoute("/")` → mapea a `/`
- `src/routes/_auth/index.tsx` → esperado por routeTree para `/` bajo auth

---

## Objetivos

1. **Resolver el error de importación** eliminando la carpeta vacía `_auth/`
2. **Eliminar conflicto de rutas** entre `index.tsx` y el dashboard auth
3. **Mantener la funcionalidad**: autenticación + dashboard protegido
4. **Estructura limpia** siguiendo convenciones de TanStack Router

---

## Scope

### IN
- Modificar `src/routes/_auth.tsx` para incluir el dashboard inline
- Eliminar `src/routes/index.tsx` (reemplazado por el dashboard en _auth)
- Eliminar carpeta vacía `src/routes/_auth/`
- Regenerar `routeTree.gen.ts`

### OUT
- No cambiar `__root.tsx`
- No cambiar `about.tsx`
- No cambiar `login.tsx`

---

## Plan de Ejecución

### Wave 1: Limpieza y Redistribución

- [ ] 1. **Eliminar carpeta vacía `_auth/`**
  - `rm -rf src/routes/_auth/`
  - Verificar que se eliminó

- [ ] 2. **Modificar `_auth.tsx`** para incluir el dashboard
  - Agregar el contenido del dashboard como `component` en `_auth.tsx`
  - Mantener el `beforeLoad` de autenticación

- [ ] 3. **Eliminar `index.tsx`**
  - Ya no es necesario porque `_auth.tsx` maneja `/`
  - El contenido del index original se mueve a `_auth.tsx`

- [ ] 4. **Regenerar `routeTree.gen.ts`**
  - Reiniciar el servidor de desarrollo (`bun run dev`)
  - El plugin de TanStack regenerará el archivo automáticamente

---

## Estructura Resultante

```
src/routes/
├── __root.tsx      → layout raíz con Header
├── _auth.tsx        → layout pathless + dashboard en /
├── about.tsx        → /about
└── login.tsx       → /login
```

---

## Contenido de `_auth.tsx` Resultante

El archivo debe tener:
1. `beforeLoad` - verificación de autenticación (ya existe)
2. `component` - sidebar + outlet + contenido del dashboard

```tsx
// src/routes/_auth.tsx
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppSidebar } from "#/components/layout/AppSidebar";
import { SidebarProvider } from "#/components/ui/sidebar";
import { supabase } from "#/lib/supabase";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/login" });
  },
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </SidebarProvider>
  );
}

// Dashboard inline para /
export const Dashboard = () => (
  <h1>Dashboard</h1>
);
```

**NOTA**: Si el dashboard necesita ser una ruta separada (para añadir más páginas protegidas debajo), entonces en lugar de mover el contenido inline, se debe crear `_auth/route.tsx` (layout) y `_auth/index.tsx` (dashboard).

---

## Criterios de Éxito

- [ ] `bun run dev` inicia sin errores
- [ ] `http://localhost:3000/` muestra el dashboard (si logueado) o redirige a login
- [ ] `http://localhost:3000/about` muestra la página About
- [ ] `http://localhost:3000/login` muestra la página de login
- [ ] `routeTree.gen.ts` se genera correctamente con 4 rutas: `__root__`, `/_auth`, `/about`, `/login`

---

## Verificación

```bash
# 1. Verificar que la carpeta _auth ya no existe
ls src/routes/_auth/  # Debe dar error o estar vacía según estructura final

# 2. Iniciar el servidor
bun run dev

# 3. Verificar en navegador
# - / → Dashboard (protegido) o redirect a /login
# - /about → Página About
# - /login → Página Login

# 4. Verificar routeTree.gen.ts tiene las rutas correctas
cat src/routeTree.gen.ts | grep "path:"
```

---

## Decisión Pendiente

**¿El dashboard debe ser:**
1. **Una ruta completa** (`/`) con sidebar, o
2. **Un componente inline** en `_auth.tsx` que se muestra vía `<Outlet />`?

Si el dashboard tendrá más sub-rutas (ej: `/dashboard/posts`, `/dashboard/settings`), entonces我们需要 mantener `_auth/` como carpeta con `route.tsx` (layout) e `index.tsx` (dashboard).
