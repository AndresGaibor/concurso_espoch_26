# PROJECT KNOWLEDGE BASE

**Scope:** `src/features/`

## OVERVIEW
Módulos por dominio. Hoy hay dos fronteras claras: `auth/` y `posts/`.

## STRUCTURE
```text
features/
├─ auth/
│  ├─ components/
│  ├─ hooks/
│  └─ index.ts
└─ posts/
   ├─ components/
   ├─ hooks/
   └─ index.ts
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Auth UI/logic | `auth/` | Formularios y hooks de sesión |
| Posts UI/logic | `posts/` | Formularios y hooks de posts |
| Export público | `index.ts` | Entrada del feature |

## CONVENTIONS
- Mantener cada feature autocontenida.
- Exportar solo superficie pública desde `index.ts`.
- Si algo cruza de una feature a otra, moverlo a `lib/` o `components/`.
- `components/` y `hooks/` dentro de cada feature no deben importar de otras features salvo excepción clara.

## ANTI-PATTERNS (THIS PROJECT)
- No crear imports cruzados auth↔posts.
- No subir hooks/logic a `src/` si pertenecen a un dominio.
- No duplicar la misma abstracción entre features.

## NOTES
- La carpeta es pequeña ahora; este archivo existe para proteger la frontera antes de que crezca.
