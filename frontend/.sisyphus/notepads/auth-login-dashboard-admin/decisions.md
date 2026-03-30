# Decisions - Admin User Creation Endpoint

## Uso de Deno Edge Functions vs API routes en backend/

**Decisión:** Crear en `supabase/functions/` en lugar de `backend/index.ts`

**Razón:** Las Supabase Edge Functions son el padrão recomendado para lógica server-side que interactúa con Supabase Auth y base de datos. Proveen:
- Autenticación automática de requests
- Variables de entorno preconfiguradas
- Despliegue independiente
- Aislamiento de credenciales

## Service Role Key nunca expuesta al cliente

**Decisión:** El service role key solo existe como variable de entorno en la Edge Function

**Razón:** El service role key tiene acceso completo a todas las tablas sin RLS. Si llegara al cliente, cualquier usuario podría ejecutar operaciones admin.

## Validación de admin via query a USUARIOS/ROLES

**Decisión:** Verificar rol consultando la tabla USUARIOS con JOIN a ROLES

**Razón:** No confiar en app_metadata del JWT porque puede ser manipulado por el cliente. La verificación real debe hacerse server-side consultando la base de datos con el service role.

## Columnas usadas: NombreCompleto, CorreoInstitucional, Estado

**Decisión:** Usar los nombres de columna exactos del schema existente

**Razón:** El schema ya existe y tiene columnas específicas. Adaptar el código al schema evita necesidad de migraciones.
