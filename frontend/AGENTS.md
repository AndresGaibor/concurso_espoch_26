# PROJECT KNOWLEDGE BASE

**Generated:** 2026-03-30
**Commit:** 398d652
**Branch:** main

## OVERVIEW
Frontend React/TanStack Start app con Vite, Tailwind v4, Supabase, Biome y TypeScript estricto.

## STRUCTURE
```text
frontend/
├─ src/              # App principal, rutas, features y utilidades compartidas
├─ styles/           # CSS global fuera del árbol de rutas
├─ public/           # Assets estáticos
├─ .sisyphus/        # Planes y metadatos de trabajo
├─ .omc/             # Memoria/estado local de agentes
└─ CLAUDE.md         # Guía heredada del proyecto
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Bootstrap de la app | `src/main.tsx`, `src/router.tsx` | Entrada real del cliente |
| Rutas | `src/routes/` | File-based routing de TanStack |
| UI compartida | `src/components/` | Layout + primitives reutilizables |
| Features | `src/features/` | Módulos por dominio (`auth`, `posts`) |
| Supabase / datos | `src/lib/supabase.ts`, `src/lib/database.types.ts` | Cliente y tipos |
| Estilos globales | `src/styles.css`, `styles/globals.css` | Tokens y base visual |

## CODE MAP
| Symbol | Type | Location | Role |
|--------|------|----------|------|
| `getRouter` | function | `src/router.tsx` | Router central |
| `Route` | file route | `src/routes/__root.tsx` | Raíz del árbol de rutas |
| `Route` | file route | `src/routes/index.tsx` | Home |
| `Route` | file route | `src/routes/login.tsx` | Login |
| `AppSidebar` | component | `src/components/layout/AppSidebar.tsx` | Navegación lateral |

## CONVENTIONS
- Alias dual: `#/*` y `@/*` apuntan a `src/*`.
- Biome manda: tabs, comillas dobles, `organizeImports` activo.
- Scripts se ejecutan vía `bun run ...`.
- `src/routeTree.gen.ts` es generado; no editar a mano.
- Las rutas usan `createFileRoute`; mantener componentes de ruta pequeños.

## ANTI-PATTERNS (THIS PROJECT)
- No introducir `eslint`/`prettier`; ya existe Biome.
- No mezclar alias relativos y absolutos sin motivo.
- No editar artefactos generados (`routeTree.gen.ts`, tipos de Supabase) manualmente.
- No mover lógica de feature a `src/routes/` si puede vivir en `src/features/`.

## UNIQUE STYLES
- TanStack Router + React 19 es el eje de la UI.
- Tailwind v4 se configura desde `vite.config.ts` con plugin oficial.
- `components.json` usa shadcn `new-york` y alias `@/components`, `@/lib`, `@/hooks`.

## COMMANDS
```bash
bun install
bun run dev
bun run build
bun run test
bun run check
bun run check:fix
bun run typecheck
bun run format
```

## NOTES
- `CLAUDE.md` contiene guía heredada con preferencia por Bun; este archivo refleja el estado real del repo.
- `src/frontend.tsx` y `src/index.ts` existen como entradas/ejemplos legacy; el flujo principal actual pasa por Vite + TanStack Start.
