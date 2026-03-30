# PROJECT KNOWLEDGE BASE

**Scope:** `src/components/ui/`

## OVERVIEW
Primitivas visuales tipo shadcn para toda la app.

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Botones | `button.tsx` | Variantes visuales |
| Formularios | `form.tsx`, `input.tsx`, `label.tsx`, `textarea.tsx` | Patrones de input |
| Overlays | `dialog.tsx`, `sheet.tsx`, `tooltip.tsx` | Componentes con portal |
| Layout atoms | `card.tsx`, `separator.tsx`, `skeleton.tsx` | UI base |
| Selectores | `select.tsx` | Controles compuestos |

## CONVENTIONS
- Mantener el patrón shadcn: composables, accesibles, variantes explícitas.
- No acoplar estado de dominio aquí.
- Preferir props claras y tipadas sobre lógica oculta.

## ANTI-PATTERNS (THIS PROJECT)
- No meter comportamiento de feature en primitives.
- No romper la compatibilidad de variantes sin necesidad.
- No sustituir componentes compartidos por copias locales.

## NOTES
- Si necesitas un patrón nuevo, primero revisa si ya existe una primitive equivalente en esta carpeta.
