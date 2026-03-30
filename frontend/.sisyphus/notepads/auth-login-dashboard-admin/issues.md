# Issues - Admin User Creation Endpoint

## LSP errors en Edge Functions

**Problema:** Los archivos Deno (.ts en supabase/functions/) muestran errores de tipos porque el LSP del proyecto no reconoce `Deno` ni los módulos JSR.

**Solución:** Estos errores son esperados y no afectan la ejecución. Cuando se despliega a Supabase Edge Functions, Deno proporciona sus propios tipos en runtime. Para desarrollar localmente, se puede usar VSCode con extensión Deno.

## Schema SQL no creado

**Problema:** El proyecto ya tiene tablas USUARIOS y ROLES en la base de datos (visibles en `src/types/database.ts`), pero mi schema.sql propuesto usaba nombres de columnas diferentes.

**Decisión:** Se ajustó el Edge Function para usar los nombres de columnas reales del schema existente (NombreCompleto, CorreoInstitucional, Estado en lugar de Nombre, Email, Activo).
