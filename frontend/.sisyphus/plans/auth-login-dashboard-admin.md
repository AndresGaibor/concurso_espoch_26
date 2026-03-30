# Auth Login + Dashboard + Admin User Creation

## TL;DR
> **Summary**: Implementar autenticación moderna con Supabase y TanStack Router para login por email/password y Microsoft Azure, dashboard privado y alta de usuarios solo-admin mediante endpoint seguro server-side.
> **Deliverables**:
> - Auth provider + router context tipado
> - Login page con email/password + botón Microsoft
> - Rutas protegidas `_auth` y `_auth.admin`
> - Dashboard placeholder privado
> - Pantalla admin para crear usuarios
> - Endpoint seguro para crear usuarios sin exponer signup público
> **Effort**: Large
> **Parallel**: YES - 2 waves
> **Critical Path**: 1 → 2 → 3/4/6

## Context
### Original Request
- Crear login conectado con Supabase.
- Redirigir a dashboard después de iniciar sesión.
- Proteger dashboard con TanStack Router usando `context` y `beforeLoad`.
- No permitir registro público.
- Agregar pantalla para registrar usuarios accesible solo para admin.
- Agregar login con Azure/Microsoft (Hotmail).

### Interview Summary
- Supabase manejará la sesión; no se usará Zustand para la sesión base.
- El dashboard por ahora será mínimo y solo mostrará “Dashboard”.
- La UI usará shadcn completo con `Form`, `Card`, `Button`, `Input`, `Label`, `react-hook-form` y Zod.
- La estrategia de pruebas será **tests después** con Vitest y Testing Library.
- Se confirmó que `USUARIOS` contiene `SupabaseUserId` e `IdRol`, con FK directa a `ROLES`.

### Metis Review (gaps addressed)
- Se cerró la semántica del rol: el guard admin debe leer `USUARIOS.IdRol -> ROLES.IdRol`.
- Se descartó password reset y signup público para evitar scope creep.
- Se fijó que el patrón de seguridad válido para alta de usuarios es server-side; el cliente no debe crear usuarios de Auth directamente.
- Se añadió guardrail para evitar mezclar el patrón legacy `ProtectedRoute` con guards nativos de TanStack Router.
- Se fijó como default que **no habrá account linking automático** entre email/password y Azure en este alcance.

## Work Objectives
### Core Objective
Entregar una arquitectura de autenticación consistente donde Supabase sea la fuente de verdad de la sesión, TanStack Router aplique guards nativos, el login soporte email/password y Microsoft Azure, el dashboard sea privado y el alta de usuarios sea exclusiva de admins mediante un flujo seguro.

### Deliverables
- `src/features/auth/*` refactorizado para provider, tipos, lookup de usuario app y utilidades auth.
- `src/routes/__root.tsx`, `src/router.tsx`, `src/main.tsx` adaptados a router context.
- `src/routes/_auth.tsx`, `src/routes/_auth.admin.tsx`, `src/routes/_auth.dashboard.tsx`, `src/routes/_auth.admin.users.new.tsx`.
- `src/routes/login.tsx` y `src/routes/auth.callback.tsx`.
- Formularios shadcn para login y alta admin.
- Endpoint server-side para creación segura de usuarios + validación admin.
- Tests de auth, guards, login y gate admin.

### Definition of Done (verifiable conditions with commands)
- `bun run typecheck` termina sin errores.
- `bun run test` termina sin errores.
- `bun run build` termina sin errores.
- `bun run check` termina sin errores.
- Un test automatizado valida que usuario no autenticado es redirigido a `/login`.
- Un test automatizado valida que usuario autenticado llega a `/dashboard`.
- Un test automatizado valida que usuario no-admin recibe denegación en `/admin/users/new`.
- Una verificación automatizada valida que el cliente no usa `supabase.auth.signUp` ni `supabase.auth.admin.*`.

### Must Have
- `createRootRouteWithContext` en la raíz del router.
- `RouterProvider` recibiendo `context={{ auth }}`.
- Ruta pathless `_auth.tsx` para todo lo privado.
- Ruta pathless `_auth.admin.tsx` para el gate de admin.
- Login con email/password y Microsoft Azure (`provider: "azure"`, scope `email`).
- Resolución de usuario app por `USUARIOS.SupabaseUserId`.
- Resolución de rol admin por `USUARIOS.IdRol -> ROLES.IdRol`.
- Pantalla admin que invoque un endpoint seguro server-side para crear usuarios.

### Must NOT Have (guardrails, AI slop patterns, scope boundaries)
- NO usar Zustand para la sesión base.
- NO usar `ProtectedRoute` como mecanismo de seguridad principal.
- NO exponer `service_role` en variables `VITE_*`, cliente ni bundle.
- NO usar `supabase.auth.signUp` ni `supabase.auth.admin.*` desde el frontend.
- NO agregar signup público, forgot password, reset password ni account linking automático.
- NO confiar en checks de admin solo en cliente; el endpoint server-side debe revalidar el rol.

## Verification Strategy
> ZERO HUMAN INTERVENTION — all verification is agent-executed.
- Test decision: tests-after + Vitest + Testing Library
- QA policy: Every task has agent-executed scenarios
- Evidence: `.sisyphus/evidence/task-{N}-{slug}.{ext}`

## Execution Strategy
### Parallel Execution Waves
> Target: 5-8 tasks per wave. <3 per wave (except final) = under-splitting.
> Extract shared dependencies as Wave-1 tasks for max parallelism.

Wave 1: foundation + seguridad server-side
- Task 1 — Fundar dominio auth y resolver usuario app/rol
- Task 2 — Integrar TanStack Router context + guards pathless
- Task 5 — Crear endpoint seguro admin para alta de usuarios

Wave 2: UI y flujos dependientes
- Task 3 — Implementar login page con email/password + Azure + callback
- Task 4 — Implementar dashboard protegido placeholder + logout
- Task 6 — Implementar pantalla admin de alta de usuarios

### Dependency Matrix (full, all tasks)
| Task | Depends On | Notes |
|---|---|---|
| 1 | — | Contrato auth base |
| 2 | 1 | Router necesita contract auth final |
| 3 | 1,2 | Login debe usar provider + redirects |
| 4 | 1,2 | Dashboard depende de guards y auth |
| 5 | — | Puede avanzar en paralelo; valida seguridad admin |
| 6 | 1,2,5 | Form admin depende de auth + gate + endpoint seguro |

### Agent Dispatch Summary (wave → task count → categories)
- Wave 1 → 3 tasks → `deep`, `unspecified-high`
- Wave 2 → 3 tasks → `visual-engineering`, `deep`, `unspecified-high`
- Final Verification → 4 tasks → `oracle`, `unspecified-high`, `deep`

## TODOs
> Implementation + Test = ONE task. Never separate.
> EVERY task MUST have: Agent Profile + Parallelization + QA Scenarios.

- [ ] 1. Fundar dominio auth y resolver usuario app/rol

  **What to do**: Crear la base del dominio `auth` dentro de `src/features/auth/` y convertir el hook actual en una API completa de sesión. El contrato final debe exponer `session`, `authUser`, `usuarioApp`, `rol`, `isAdmin`, `isAuthenticated`, `isLoading`, `signInWithPassword`, `signInWithMicrosoft` y `signOut`. Resolver `usuarioApp` consultando `USUARIOS` por `SupabaseUserId = session.user.id`; si el login es por Azure y no existe match por `SupabaseUserId`, hacer fallback de lectura por email (`CorreoInstitucional = session.user.email`) y, si existe una fila con `SupabaseUserId` nulo, actualizarla una sola vez para enlazar el usuario app con el auth user. El lookup del rol debe leer `IdRol` y `NombreRol` desde `ROLES`. Mantener toda esta lógica dentro de `src/features/auth/` y exponer solo una superficie pública desde `src/features/auth/index.ts`.
  **Must NOT do**: No usar Zustand; no dejar el tipo fuente en `src/lib/database.types.ts`; no mezclar lógica de routing aquí; no hacer linking automático entre identidades distintas si ya existe un `SupabaseUserId` asignado a otra fila.

  **Recommended Agent Profile**:
  - Category: `deep` — Reason: combina estado auth, lookup tipado de Supabase y resolución de rol.
  - Skills: [`brainstorming`] — ya validó el diseño incremental; seguirlo para no sobrediseñar la feature.
  - Omitted: [`feature-arch`] — no disponible como tool cargable aquí; aplicar manualmente el patrón de frontera por feature ya decidido.

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: [2, 3, 4, 6] | Blocked By: []

  **References** (executor has NO interview context — be exhaustive):
  - Pattern: `src/features/auth/hooks/useAuth.ts:6-30` — hook actual simple; reemplazarlo por una API más rica sin cambiar la responsabilidad de la feature.
  - Anti-pattern to remove: `src/components/ProtectedRoute.tsx:5-11` — hoy protege por componente; ya no debe ser la capa principal de seguridad.
  - Supabase client: `src/lib/supabase.ts:1-19` — singleton tipado existente.
  - Type contract: `src/types/database.ts:153-172` — tabla `ROLES`.
  - Type contract: `src/types/database.ts:198-245` — tabla `USUARIOS`, incluyendo `SupabaseUserId`, `IdRol` y FK a `ROLES`.
  - Public types export gap: `src/types/index.ts:1-18` — hoy no expone `USUARIOS`/`ROLES`; ampliar si conviene, pero tomando `src/types/database.ts` como fuente de verdad.
  - External: `https://supabase.com/docs/guides/auth/quickstarts/react` — `getSession()` + `onAuthStateChange()`.
  - External: `https://supabase.com/docs/guides/auth/social-login/auth-azure` — Azure provider `azure` + `scopes: "email"`.

  **Acceptance Criteria** (agent-executable only):
  - [ ] `src/features/auth/` exporta un provider/hook con `session`, `authUser`, `usuarioApp`, `rol`, `isAdmin`, `isAuthenticated`, `isLoading`, `signInWithPassword`, `signInWithMicrosoft`, `signOut`.
  - [ ] El lookup usa `src/types/database.ts`, no `src/lib/database.types.ts`.
  - [ ] Si existe sesión, el provider resuelve `USUARIOS` por `SupabaseUserId`; si no encuentra y el proveedor es Azure, intenta fallback por email y enlaza la fila solo si `SupabaseUserId` está vacío.
  - [ ] Un test automatizado cubre: sesión nula, sesión válida no-admin, sesión válida admin y fallback Azure por email.
  - [ ] `bun run typecheck` pasa al terminar esta tarea.

  **QA Scenarios** (MANDATORY — task incomplete without these):
  ```
  Scenario: Provider resuelve sesión y rol
    Tool: Bash
    Steps: bunx vitest run src/features/auth/**/*.test.tsx --reporter=verbose > .sisyphus/evidence/task-1-auth-foundation.txt 2>&1
    Expected: Tests pasan y el reporte evidencia estados anonymous, authenticated y admin.
    Evidence: .sisyphus/evidence/task-1-auth-foundation.txt

  Scenario: Typecheck del contrato auth
    Tool: Bash
    Steps: bun run typecheck > .sisyphus/evidence/task-1-auth-foundation-typecheck.txt 2>&1
    Expected: Exit code 0 y sin errores de tipos relacionados con `USUARIOS`/`ROLES`.
    Evidence: .sisyphus/evidence/task-1-auth-foundation-typecheck.txt
  ```

  **Commit**: YES | Message: `feat(auth): add session and role provider` | Files: [`src/features/auth/**`, `src/types/**`]

- [ ] 2. Integrar router context y guards pathless

  **What to do**: Migrar el router a `createRootRouteWithContext` y pasar el estado auth vivo por `RouterProvider context={{ auth }}`. Actualizar `src/routes/__root.tsx` para tipar el contexto, `src/router.tsx` para declarar `context.auth`, y `src/main.tsx` para montar el provider auth por encima del router. Crear `src/routes/_auth.tsx` como guard base de autenticación y `src/routes/_auth.admin.tsx` como guard adicional de admin. `_auth.tsx` debe redirigir a `/login?redirect=<location.href>` cuando no haya sesión; `_auth.admin.tsx` debe redirigir a `/dashboard` cuando el usuario autenticado no sea admin. Eliminar el uso real de `ProtectedRoute` del árbol de rutas; si se conserva, debe quedar sin referencias activas.
  **Must NOT do**: No recrear el router en cada cambio de sesión; no usar `<Navigate>` como guard principal; no dejar rutas privadas fuera de `_auth`.

  **Recommended Agent Profile**:
  - Category: `deep` — Reason: toca bootstrap, contexto tipado y jerarquía completa de rutas.
  - Skills: [`brainstorming`] — seguir la arquitectura ya validada y evitar drift.
  - Omitted: [`playwright`] — aquí el foco es estructura de router, no automatización UI.

  **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: [3, 4, 6] | Blocked By: [1]

  **References** (executor has NO interview context — be exhaustive):
  - Root route current state: `src/routes/__root.tsx:1-29` — hoy usa `createRootRoute` sin context tipado.
  - Router current state: `src/router.tsx:1-24` — hoy no define `context`.
  - Main bootstrap current state: `src/main.tsx:1-12` — hoy renderiza `RouterProvider` sin provider auth.
  - Login route placeholder: `src/routes/login.tsx:1-11` — usará `redirect` query string.
  - Legacy guard to retire: `src/components/ProtectedRoute.tsx:1-12`.
  - External: `https://tanstack.com/router/latest/docs/guide/authenticated-routes` — `beforeLoad` + pathless route.
  - External: `https://tanstack.com/router/latest/docs/how-to/setup-auth-providers` — provider por encima de `RouterProvider` + `context`.

  **Acceptance Criteria** (agent-executable only):
  - [ ] `__root.tsx` usa `createRootRouteWithContext` con el tipo auth final.
  - [ ] `router.tsx` declara `context: { auth: undefined! }`.
  - [ ] `main.tsx` monta provider auth por encima del router y pasa `context={{ auth }}`.
  - [ ] Existe `_auth.tsx` que bloquea no autenticados y `_auth.admin.tsx` que bloquea no-admins.
  - [ ] Un test automatizado valida redirects de `/dashboard` y `/admin/users/new` para anónimo, autenticado no-admin y admin.

  **QA Scenarios** (MANDATORY — task incomplete without these):
  ```
  Scenario: Guards de router redirigen correctamente
    Tool: Bash
    Steps: bunx vitest run src/routes/**/*.test.tsx --reporter=verbose > .sisyphus/evidence/task-2-router-guards.txt 2>&1
    Expected: El reporte muestra redirect a `/login` para anónimo y redirect a `/dashboard` para no-admin en la ruta admin.
    Evidence: .sisyphus/evidence/task-2-router-guards.txt

  Scenario: Build del árbol de rutas
    Tool: Bash
    Steps: bun run build > .sisyphus/evidence/task-2-router-guards-build.txt 2>&1
    Expected: Build exitoso y TanStack genera el route tree sin errores.
    Evidence: .sisyphus/evidence/task-2-router-guards-build.txt
  ```

  **Commit**: YES | Message: `feat(auth): wire router context and pathless guards` | Files: [`src/routes/__root.tsx`, `src/routes/_auth.tsx`, `src/routes/_auth.admin.tsx`, `src/router.tsx`, `src/main.tsx`, `src/components/ProtectedRoute.tsx`]

- [ ] 3. Implementar login page con email/password, Azure y callback

  **What to do**: Construir el flujo público de login en `src/routes/login.tsx` usando shadcn + `react-hook-form` + Zod. Reusar `src/features/auth/components/LoginForm.tsx` como componente principal del formulario. La pantalla debe incluir: email, contraseña, submit “Iniciar sesión” y botón secundario “Continuar con Microsoft”. El submit email/password debe llamar `signInWithPassword`; el botón Azure debe llamar `signInWithMicrosoft` con `provider: "azure"`, `scopes: "email"` y `redirectTo: ${window.location.origin}/auth/callback`. Crear `src/routes/auth.callback.tsx` para esperar la sesión y redirigir a `search.redirect` o `/dashboard`. Si el usuario llega autenticado a `/login`, redirigir inmediatamente al destino. Mostrar errores inline, loading por botón y nunca mostrar opción de sign up.
  **Must NOT do**: No usar `alert`; no mostrar botones de registro público; no poner lógica de sesión directamente en la ruta si puede vivir en la feature; no hardcodear URLs distintas de `window.location.origin`.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` — Reason: combina formulario, estados visuales y composición shadcn.
  - Skills: [`brainstorming`] — mantener la UI mínima pero completa.
  - Omitted: [`playwright`] — no hay setup existente de Playwright; la verificación será por tests y build.

  **Parallelization**: Can Parallel: NO | Wave 2 | Blocks: [] | Blocked By: [1, 2]

  **References** (executor has NO interview context — be exhaustive):
  - Route placeholder: `src/routes/login.tsx:1-11` — reemplazar completamente.
  - Empty feature component: `src/features/auth/components/LoginForm.tsx:1-1` — usarlo como componente de formulario real.
  - Form primitives: `src/components/ui/form.tsx:19-167` — patrón completo con `FormField`, `FormItem`, `FormControl`, `FormMessage`.
  - Input primitive: `src/components/ui/input.tsx:5-21`.
  - Button variants: `src/components/ui/button.tsx:7-64`.
  - Card layout: `src/components/ui/card.tsx:5-92`.
  - External: `https://supabase.com/docs/guides/auth/social-login/auth-azure` — Azure OAuth provider.
  - External: `https://supabase.com/docs/guides/auth/social-login` — redirect URLs allowlist.

  **Acceptance Criteria** (agent-executable only):
  - [ ] `/login` muestra formulario email/password y botón Microsoft en una `Card` shadcn.
  - [ ] Submit de email/password llama `signInWithPassword` y navega a `redirect` o `/dashboard` si la auth se resuelve.
  - [ ] Botón Microsoft dispara OAuth Azure con `redirectTo` a `/auth/callback`.
  - [ ] `/auth/callback` resuelve la sesión y redirige a `redirect` o `/dashboard`.
  - [ ] No hay ninguna UI de sign up ni referencias a forgot/reset password.
  - [ ] Tests cubren login render, submit success/error y callback redirect.

  **QA Scenarios** (MANDATORY — task incomplete without these):
  ```
  Scenario: Login form renderiza y maneja submit
    Tool: Bash
    Steps: bunx vitest run src/features/auth/components/**/*.test.tsx src/routes/login*.test.tsx --reporter=verbose > .sisyphus/evidence/task-3-login-ui.txt 2>&1
    Expected: Tests pasan y verifican errores inline, loading y redirección posterior al login.
    Evidence: .sisyphus/evidence/task-3-login-ui.txt

  Scenario: Build valida callback route y formularios
    Tool: Bash
    Steps: bun run build > .sisyphus/evidence/task-3-login-ui-build.txt 2>&1
    Expected: Build exitoso con `auth.callback.tsx` registrado en el route tree.
    Evidence: .sisyphus/evidence/task-3-login-ui-build.txt
  ```

  **Commit**: YES | Message: `feat(auth): add login flows with microsoft oauth` | Files: [`src/routes/login.tsx`, `src/routes/auth.callback.tsx`, `src/features/auth/components/LoginForm.tsx`, `src/features/auth/**`]

- [ ] 4. Implementar dashboard protegido placeholder + logout

  **What to do**: Crear `src/routes/_auth.dashboard.tsx` como pantalla privada mínima. Debe renderizar “Dashboard”, mostrar el email del usuario autenticado si existe y exponer un botón “Cerrar sesión”. El logout debe llamar `auth.signOut()` y luego `router.invalidate()` para re-evaluar guards; el usuario debe terminar en `/login`. No agregar sidebar, widgets ni layout adicional. Si se necesita un contenedor visual, reutilizar `Card` o un wrapper simple, pero mantener la página minimalista.
  **Must NOT do**: No introducir layout de app, sidebar, métricas ni navegación extra; no depender de `ProtectedRoute`; no dejar el logout sin invalidar el router.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` — Reason: pantalla simple, pero con UX y composición consistente.
  - Skills: [`brainstorming`] — conservar YAGNI y placeholder mínimo.
  - Omitted: [`playwright`] — no hay setup existente; tests unit/integration bastan para esta iteración.

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: [] | Blocked By: [1, 2]

  **References** (executor has NO interview context — be exhaustive):
  - Guard parent target: `src/routes/_auth.tsx` — será el padre de esta ruta.
  - Legacy root route: `src/routes/__root.tsx:12-29` — mantener outlet/devtools.
  - Button primitive: `src/components/ui/button.tsx:41-64`.
  - Card primitive: `src/components/ui/card.tsx:5-92`.
  - Existing auth hook contract seed: `src/features/auth/hooks/useAuth.ts:25-30` — ya existe `signOut`; ampliarlo, no duplicarlo.
  - External: `https://tanstack.com/router/latest/docs/framework/react/examples/authenticated-routes?path=examples%2Freact%2Fauthenticated-routes%2Fsrc%2Froutes%2F_auth.tsx` — ejemplo de `router.invalidate()` tras logout.

  **Acceptance Criteria** (agent-executable only):
  - [ ] `/dashboard` vive bajo `_auth` y no renderiza para anónimos.
  - [ ] La página muestra el texto “Dashboard”.
  - [ ] El botón “Cerrar sesión” invalida el router y el usuario termina en `/login`.
  - [ ] Un test cubre render authenticated y flujo de logout.

  **QA Scenarios** (MANDATORY — task incomplete without these):
  ```
  Scenario: Dashboard privado renderiza para sesión válida
    Tool: Bash
    Steps: bunx vitest run src/routes/_auth.dashboard*.test.tsx --reporter=verbose > .sisyphus/evidence/task-4-dashboard.txt 2>&1
    Expected: El test verifica render del placeholder y email del usuario.
    Evidence: .sisyphus/evidence/task-4-dashboard.txt

  Scenario: Logout fuerza re-evaluación de guards
    Tool: Bash
    Steps: bunx vitest run src/routes/_auth.dashboard*.test.tsx --reporter=verbose > .sisyphus/evidence/task-4-dashboard-logout.txt 2>&1
    Expected: El test verifica `signOut` + `router.invalidate()` + navegación a `/login`.
    Evidence: .sisyphus/evidence/task-4-dashboard-logout.txt
  ```

  **Commit**: YES | Message: `feat(auth): add protected dashboard placeholder` | Files: [`src/routes/_auth.dashboard.tsx`, `src/features/auth/**`]

- [ ] 5. Crear endpoint seguro admin para alta de usuarios

  **What to do**: Implementar una función server-side segura para crear usuarios administrados por admin. El nombre fijo del endpoint será `admin-create-user`. Debe vivir fuera del cliente y usar `service_role` solo en servidor. La función debe: validar JWT del caller, resolver su `USUARIOS` por `SupabaseUserId`, verificar que su `IdRol` corresponde a admin, crear el usuario en `auth.users` con email/password, insertar la fila en `USUARIOS` con `SupabaseUserId` del nuevo auth user, `CorreoInstitucional`, `NombreCompleto`, `IdRol`, `Estado = "ACTIVO"` e `IdJefeDirecto = null`, y responder 201. Casos de error: 401 sin token, 403 no-admin, 409 email duplicado o fila de `USUARIOS` existente, 500 errores inesperados. Deshabilitar signup público en Supabase Auth y documentar que el frontend jamás debe usar `signUp`.
  **Must NOT do**: No usar `service_role` en código cliente ni variables `VITE_*`; no crear usuarios desde el navegador; no permitir que el endpoint acepte `SupabaseUserId`, `Estado` o claims de rol enviados por el cliente.

  **Recommended Agent Profile**:
  - Category: `unspecified-high` — Reason: mezcla seguridad, Supabase Auth admin API y contrato backend/frontend.
  - Skills: [`brainstorming`] — mantener el endpoint mínimo y enfocado.
  - Omitted: [`playwright`] — no aplica a backend seguro.

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: [6] | Blocked By: []

  **References** (executor has NO interview context — be exhaustive):
  - Auth source: `src/lib/supabase.ts:1-19` — cliente frontend existente; NO reutilizar esta instancia para service role.
  - Role model: `src/types/database.ts:153-172` — tabla `ROLES`.
  - User model: `src/types/database.ts:198-245` — tabla `USUARIOS`, con `SupabaseUserId` e `IdRol`.
  - Command context: `package.json:15` — el repo ya usa CLI de Supabase para generar tipos; es aceptable introducir carpeta `supabase/` si hace falta.
  - External: `https://supabase.com/docs/reference/javascript/auth-admin-createuser` — creación segura de usuarios con admin API.
  - External: `https://supabase.com/docs/guides/functions` — patrón de Edge Functions.

  **Acceptance Criteria** (agent-executable only):
  - [ ] Existe un endpoint server-side `admin-create-user` que usa `service_role` solo en entorno servidor.
  - [ ] El endpoint valida caller admin mediante `USUARIOS.IdRol` antes de crear usuarios.
  - [ ] El endpoint crea `auth.users` y la fila correspondiente en `USUARIOS` de forma consistente.
  - [ ] `supabase.auth.signUp` no se usa en ningún archivo cliente del repo.
  - [ ] Un conjunto de pruebas/verificaciones cubre 401, 403, 201 y conflicto por duplicado.

  **QA Scenarios** (MANDATORY — task incomplete without these):
  ```
  Scenario: Endpoint rechaza anónimo y no-admin
    Tool: Bash
    Steps: ejecutar tests del endpoint o invocaciones HTTP automatizadas que cubran 401 y 403; guardar salida en .sisyphus/evidence/task-5-admin-endpoint.txt
    Expected: Sin token devuelve 401; con token de no-admin devuelve 403.
    Evidence: .sisyphus/evidence/task-5-admin-endpoint.txt

  Scenario: Repo cliente no expone signup público ni service role
    Tool: Bash
    Steps: rg "auth\.signUp|auth\.admin|SERVICE_ROLE|VITE_.*SERVICE" src .env* > .sisyphus/evidence/task-5-admin-endpoint-scan.txt ; test $? -eq 1
    Expected: No hay coincidencias inseguras en código cliente ni variables públicas.
    Evidence: .sisyphus/evidence/task-5-admin-endpoint-scan.txt
  ```

  **Commit**: YES | Message: `feat(admin): add secure user creation endpoint` | Files: [`supabase/functions/admin-create-user/**`, `supabase/**`, `README`/config docs if needed]

- [ ] 6. Implementar pantalla admin de alta de usuarios

  **What to do**: Crear la ruta `src/routes/_auth.admin.users.new.tsx` y un componente de feature `src/features/auth/components/AdminUserCreateForm.tsx` para alta de usuarios. La pantalla debe estar bajo `_auth.admin` y usar shadcn completo. Campos exactos: `correoInstitucional` (email requerido), `nombreCompleto` (string requerido), `idRol` (select requerido cargado desde `ROLES`). No pedir `SupabaseUserId`, no pedir `Estado`, no pedir `IdJefeDirecto`; el backend fija `Estado = "ACTIVO"` e `IdJefeDirecto = null`. También incluir `passwordTemporal` como campo requerido y confirmación visual de éxito. El submit debe llamar exclusivamente al endpoint `admin-create-user`. En éxito: limpiar formulario y mostrar mensaje de éxito. En 401/403/409: mostrar error inline legible. Usuarios no-admin nunca deben ver el formulario porque la ruta ya estará protegida por `_auth.admin`.
  **Must NOT do**: No insertar directamente en `USUARIOS` desde el cliente; no usar `supabase.auth.signUp`; no esconder el formulario “por CSS” sin guard real; no permitir escoger `Estado` ni `SupabaseUserId`.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` — Reason: formulario admin completo con estados y select.
  - Skills: [`brainstorming`] — mantener la pantalla enfocada y sin extras.
  - Omitted: [`playwright`] — no hay setup actual; cubrir con tests de formulario e integración.

  **Parallelization**: Can Parallel: NO | Wave 2 | Blocks: [] | Blocked By: [1, 2, 5]

  **References** (executor has NO interview context — be exhaustive):
  - Admin role source: `src/types/database.ts:198-245` — `USUARIOS`.
  - Role catalog source: `src/types/database.ts:153-172` — `ROLES`.
  - Form pattern: `src/components/ui/form.tsx:19-167`.
  - Input pattern: `src/components/ui/input.tsx:5-21`.
  - Button pattern: `src/components/ui/button.tsx:41-64`.
  - Card pattern: `src/components/ui/card.tsx:5-92`.
  - Route structure anchor: `src/routes/login.tsx:5-10` — file-based route pattern actual.
  - Feature fetch style: `src/features/posts/hooks/usePosts.ts:6-12` — patrón actual de query con Supabase y tipado.

  **Acceptance Criteria** (agent-executable only):
  - [ ] `/admin/users/new` existe y cuelga de `_auth.admin`.
  - [ ] El formulario carga opciones de `ROLES` y valida email, nombre, password temporal e `idRol`.
  - [ ] El submit invoca únicamente `admin-create-user`.
  - [ ] Éxito limpia el formulario y muestra confirmación; errores 401/403/409 muestran feedback inline.
  - [ ] Un test automatizado cubre render admin, carga de roles, submit exitoso y manejo de errores.

  **QA Scenarios** (MANDATORY — task incomplete without these):
  ```
  Scenario: Admin puede crear usuario desde la UI
    Tool: Bash
    Steps: bunx vitest run src/features/auth/components/AdminUserCreateForm*.test.tsx src/routes/_auth.admin.users.new*.test.tsx --reporter=verbose > .sisyphus/evidence/task-6-admin-form.txt 2>&1
    Expected: Tests pasan y validan carga de roles, submit al endpoint y mensaje de éxito.
    Evidence: .sisyphus/evidence/task-6-admin-form.txt

  Scenario: Errores del endpoint se muestran en pantalla
    Tool: Bash
    Steps: bunx vitest run src/features/auth/components/AdminUserCreateForm*.test.tsx --reporter=verbose > .sisyphus/evidence/task-6-admin-form-errors.txt 2>&1
    Expected: Tests pasan y verifican errores inline para 401/403/409.
    Evidence: .sisyphus/evidence/task-6-admin-form-errors.txt
  ```

  **Commit**: YES | Message: `feat(admin): add admin-only user registration screen` | Files: [`src/routes/_auth.admin.users.new.tsx`, `src/features/auth/components/AdminUserCreateForm.tsx`, `src/features/auth/**`]

## Final Verification Wave (MANDATORY — after ALL implementation tasks)
> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.
> **Do NOT auto-proceed after verification. Wait for user's explicit approval before marking work complete.**
> **Never mark F1-F4 as checked before getting user's okay.** Rejection or user feedback -> fix -> re-run -> present again -> wait for okay.
- [ ] F1. Plan Compliance Audit — oracle
- [ ] F2. Code Quality Review — unspecified-high
- [ ] F3. Real Manual QA — unspecified-high (+ playwright if UI)
- [ ] F4. Scope Fidelity Check — deep

## Commit Strategy
- Commit 1: `feat(auth): add session provider and router guards`
- Commit 2: `feat(auth): add login flows and protected dashboard`
- Commit 3: `feat(admin): add secure admin user creation flow`
- Commit 4: `test(auth): cover guards, login, and admin access rules`

## Success Criteria
- Login por email/password funciona con Supabase.
- Login por Microsoft Azure redirige correctamente y aterriza en dashboard.
- `/dashboard` solo es accesible con sesión válida.
- `/admin/users/new` solo es accesible para usuarios admin.
- El rol admin se deriva desde `USUARIOS` + `ROLES`, no desde estado inventado en cliente.
- No existe signup público ni uso de APIs admin de Supabase en frontend.
- El endpoint admin responde 401/403/200 en los casos correctos.
