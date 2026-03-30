# Learnings - Admin User Creation Endpoint

## Endpoint creado: admin-users

**Ubicación:** `supabase/functions/admin-users/index.ts`

### Patrón de seguridad implementado:
1. Service role key SOLO usado en server-side (Deno Edge Function)
2. JWT del cliente validado con anon key via `supabase.auth.getUser(token)`
3. Admin verificado consultando USUARIOS + ROLES con service role
4. No se confía en ningún campo del body para determinar rol o userId

### Nombres de columnas reales (del schema existente):
- USUARIOS: `IdUsuario`, `SupabaseUserId`, `IdRol`, `NombreCompleto`, `CorreoInstitucional`, `Estado`, `IdJefeDirecto`, `CreatedAt`
- ROLES: `IdRol`, `NombreRol`, `Descripcioon`, `CreatedAt`

### Verificación de admin:
- Consulta USUARIOS.IdRol -> ROLES.NombreRol
- Acepta si NombreRol === 'ADMIN' o IdRol === 1

### Códigos de retorno:
- 401: Sin token o token inválido
- 403: Token válido pero no es admin
- 409: Email duplicado en USUARIOS
- 201: Usuario creado exitosamente
- 400: Datos inválidos (password < 8 chars, idRol inválido)
- 500: Error interno (usuario Auth creado pero falla insert en USUARIOS)

## Archivos creados:
- `supabase/functions/admin-users/index.ts` - Edge Function principal
- `supabase/functions/admin-users/test.ts` - Tests de verificación

---

# Task 1: Fundar dominio auth y resolver usuario app/rol

## Hook useAuth mejorado

**Ubicación:** `src/features/auth/hooks/useAuth.ts`

### API expuesta:
- `session` - Session de Supabase
- `authUser` - User de Supabase Auth
- `usuarioApp` - Fila de USUARIOS con ROLES
- `rol` - Fila de ROLES
- `isAdmin` - booleano derivado (rol.NombreRol === "ADMIN")
- `isAuthenticated` - booleano derivado (session !== null)
- `isLoading` - estado de carga
- `signInWithPassword(email, password)` - login email/password
- `signInWithMicrosoft()` - login OAuth Azure
- `signOut()` - cerrar sesión

### Resolución de usuario app:
1. Busca por `SupabaseUserId = session.user.id`
2. Si no encuentra Y hay email, busca por `CorreoInstitucional = email` donde `SupabaseUserId IS NULL`
3. Si encuentra, actualiza `SupabaseUserId` una sola vez (fallback Azure)

### Patrón de mocking para tests:
- Usar `vi.hoisted()` para definir mocks antes de `vi.mock()`
- Encadenar mocks con `.mockReturnValue()` para query builder

## Archivos creados:
- `src/features/auth/types/auth.types.ts` - Tipos del dominio auth
- `src/features/auth/hooks/useAuth.ts` - Hook mejorado
- `src/features/auth/index.ts` - Exports públicos
- `src/features/auth/hooks/__tests__/useAuth.test.tsx` - Tests (10 casos)
- `vitest.config.ts` - Configuración de tests con jsdom

## Actualizaciones:
- `src/types/index.ts` - Agregados tipos `Usuario` y `Rol`
- `src/components/ProtectedRoute.tsx` - Actualizado para usar nuevo API (deprecated)

