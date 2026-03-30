# PROJECT KNOWLEDGE BASE

**Scope:** `src/routes/`

## OVERVIEW
Rutas file-based de TanStack; cada archivo representa una URL o layout del árbol.

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Root layout | `__root.tsx` | Outlet + devtools |
| Home page | `index.tsx` | Landing principal |
| About page | `about.tsx` | Página de ejemplo |
| Login page | `login.tsx` | Flujo de acceso |

## CONVENTIONS
- Usar `createFileRoute()` por archivo.
- Mantener los componentes de ruta locales al archivo salvo que haya reutilización clara.
- Si una ruta necesita lógica compartida, moverla a `features/` o `lib/`.
- `routeTree.gen.ts` se regenera; nunca editarlo a mano.

## ANTI-PATTERNS (THIS PROJECT)
- No poner lógica de dominio grande dentro de una ruta.
- No crear rutas con nombres que no correspondan al path real.
- No mezclar patrones de routing antiguos con TanStack file-based routing.

## NOTES
- `login.tsx` ya importa `supabase`; cualquier auth real debería centralizarse fuera del archivo si crece.
