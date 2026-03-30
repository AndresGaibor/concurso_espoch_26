# PROJECT KNOWLEDGE BASE

**Scope:** `src/components/`

## OVERVIEW
Componentes compartidos de la app: layout, wrappers y piezas reutilizables.

## STRUCTURE
```text
components/
├─ layout/   # Shells y composición de página
└─ ui/       # Primitivas visuales
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Shell de app | `layout/AppLayout.tsx` | Contenedor principal |
| Sidebar/layout | `layout/AppSidebar.tsx` | Navegación lateral |
| Primitivas UI | `ui/` | Botones, inputs, dialogs, etc. |

## CONVENTIONS
- `layout/` para componentes estructurales.
- `ui/` para piezas pequeñas y agnósticas al dominio.
- Mantener APIs de props estables; preferir composición.
- Usar alias `@/components/...` o `#/components/...`.

## ANTI-PATTERNS (THIS PROJECT)
- No meter lógica de negocio en componentes compartidos.
- No acoplar `ui/` a features específicas.
- No duplicar variantes que ya existen en `ui/`.

## NOTES
- `ui/` refleja el estilo shadcn; cambios deben conservar consistencia visual y de props.
