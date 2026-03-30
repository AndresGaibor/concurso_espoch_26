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

---

# Task 2: Router Context y Guards Pathless

## Arquitectura de autenticación

**Store de auth (module-level):** `src/features/auth/stores/authStore.ts`
- Estado mutable a nivel de módulo accesible síncronamente
- Se actualiza desde AuthProvider cuando cambia auth

**AuthProvider:** `src/components/AuthProvider.tsx`
- Inicializa auth desde Supabase en useEffect
- Actualiza el store global en cada cambio de auth

**Route Guards:**
- `auth/_auth.tsx` - Layout pathless que verifica `authStore.isAuthenticated`
- `auth/_auth.admin.tsx` - Layout pathless que verifica `authStore.isAdmin`
- Ambos usan `beforeLoad` con `redirect` para proteger rutas

## Estructura de rutas generada

```
/                           → index.tsx
/login                      → login.tsx (pública)
/about                      → about.tsx (pública)
/unauthorized               → unauthorized.tsx
/auth                       → auth/_auth.tsx (layout, guarda auth)
  /auth/admin              → auth/_auth.admin.tsx (guarda admin)
```

## NOTA: Estructura diferente a la especificada

El task especificaba `_auth.tsx` y `_auth.admin.tsx` directamente en `src/routes/`, pero:
- `_auth.tsx` al nivel raíz crea una ruta en `/` (pathless) que choca con `index.tsx`
- Solución: usar `auth/_auth.tsx` y `auth/_auth.admin.tsx` con directorio `auth/`

## Archivos creados:
- `src/features/auth/stores/authStore.ts` - Store de auth
- `src/components/AuthProvider.tsx` - Provider de auth
- `src/routes/auth/_auth.tsx` - Layout pathless para auth
- `src/routes/auth/_auth.admin.tsx` - Layout pathless para admin

## Archivos modificados:
- `src/router.tsx` - exports RouterContext
- `src/main.tsx` - Envuelve con AuthProvider y pasa context
- `src/routes/__root.tsx` - Removido import no usado de SidebarProvider
- `src/routes/login.tsx` - Removido imports no usados


