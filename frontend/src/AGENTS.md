# PROJECT KNOWLEDGE BASE

**Scope:** `src/`

## OVERVIEW
Árbol principal de la app: router, componentes compartidos, features, tipos y estilos.

## STRUCTURE
```text
src/
├─ routes/        # Páginas TanStack por archivo
├─ components/    # UI compartida + layouts
├─ features/      # Módulos por dominio
├─ lib/           # Cliente Supabase, helpers, utilidades
├─ hooks/         # Hooks cross-feature
├─ types/         # Tipos compartidos y generados
└─ styles.css     # Estilos base del router/app
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Navegación | `routes/` | Páginas, layouts y loaders |
| Layouts | `components/layout/` | Shell visual y composición |
| Design system | `components/ui/` | Primitivas tipo shadcn |
| Dominio auth | `features/auth/` | Componentes + hooks de auth |
| Dominio posts | `features/posts/` | Componentes + hooks de posts |
| Cliente backend | `lib/supabase.ts` | Punto único para Supabase |

## CONVENTIONS
- Mantener lógica de dominio dentro de `features/`.
- Exponer cada feature desde su `index.ts`.
- Reutilizar alias `#/*` / `@/*`.
- Preferir componentes pequeños y composables.

## ANTI-PATTERNS (THIS PROJECT)
- No meter queries o lógica de negocio directamente en rutas si una feature puede encargarse.
- No crear utilidades duplicadas entre `lib/`, `hooks/` y `features/`.
- No importar hacia arriba desde una feature cuando un export público ya existe.

## NOTES
- `main.tsx` es el bootstrap del cliente; `routes/__root.tsx` define la raíz del router.
- `frontend.tsx` e `index.ts` son entradas legacy separadas del flujo actual.
