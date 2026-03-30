# Guía de Pruebas de la GUI - Control de Asistencias ESPOCH

## Rutas de la Aplicación

### Rutas Públicas
| Ruta | Descripción |
|------|-------------|
| `/` | Página de inicio (redirige a login si no está autenticado) |
| `/login` | Página de inicio de sesión |
| `/about` | Página acerca de |
| `/gps` | Página de prueba de GPS |
| `/unauthorized` | Página de acceso no autorizado |

### Rutas Protegidas (Requieren Autenticación)

#### Panel Principal
| Ruta | Rol | Descripción |
|------|-----|-------------|
| `/app` | Todos | Página principal de la aplicación |
| `/app/profile` | Todos | Perfil del usuario |

#### Empleado (EMPLOYEE)
| Ruta | Descripción | Componente |
|------|-------------|------------|
| `/app/employee` | Dashboard del empleado | EmployeeDashboardPage |
| `/app/employee/attendance` | Registro de asistencia | EmployeeAttendancePage |
| `/app/employee/history` | Historial de asistencias | EmployeeHistoryPage |
| `/app/employee/absences` | Lista de ausencias | EmployeeAbsencesPage |
| `/app/employee/absences/new` | Nueva solicitud de ausencia | NewAbsencePage |

#### Jefe Directo (MANAGER)
| Ruta | Descripción | Componente |
|------|-------------|------------|
| `/app/manager` | Dashboard del jefe directo | ManagerDashboardPage |
| `/app/manager/requests` | Gestión de solicitudes | ManagerRequestsPage |
| `/app/manager/history` | Historial del equipo | ManagerHistoryPage |

#### Administrador (ADMIN)
| Ruta | Descripción | Componente |
|------|-------------|------------|
| `/app/admin` | Panel de administración | AdminIndexPage |
| `/app/admin/users` | Gestión de usuarios | - |
| `/app/admin/schedules` | Gestión de horarios | - |
| `/app/admin/locations` | Gestión de ubicaciones | - |
| `/app/admin/attendances` | Ver todas las asistencias | - |
| `/app/admin/absences` | Ver todas las ausencias | - |

## Funcionalidades por Rol

### Empleado
1. **Registro de Asistencia**
   - Marcar entrada con geolocalización
   - Marcar salida con geolocalización
   - Visualizar asistencias del día
   - Ver última asistencia registrada

2. **Historial**
   - Ver todas las asistencias agrupadas por mes
   - Estadísticas mensuales (entradas, salidas, puntuales, tardanzas)
   - Paginación de registros

3. **Ausencias**
   - Ver historial de solicitudes de ausencia
   - Crear nueva solicitud de justificación
   - Ver estado de solicitudes (PENDIENTE, APROBADO, RECHAZADO)

### Jefe Directo
1. **Dashboard**
   - Estadísticas del equipo (total empleados, presentes hoy, solicitudes pendientes)
   - Asistencias recientes del equipo
   - Lista de empleados a cargo
   - Accesos rápidos a gestión

2. **Gestión de Solicitudes**
   - Ver solicitudes pendientes de aprobación
   - Aprobar solicitudes de ausencia
   - Rechazar solicitudes con motivo
   - Ver detalles de cada solicitud

3. **Historial del Equipo**
   - Ver asistencias de todos los empleados
   - Filtrar por empleado, tipo de asistencia
   - Búsqueda por nombre o email
   - Estadísticas resumidas

## Pasos para Probar

### 1. Inicio de Sesión
```
1. Navegar a http://localhost:5173/login
2. Ingresar credenciales (email/password o Microsoft)
3. Verificar redirección según rol
```

### 2. Pruebas como Empleado
```
1. Navegar a /app/employee
2. Probar registro de entrada (permite acceso a geolocalización)
3. Verificar que aparece el registro en "Resumen de Hoy"
4. Navegar a /app/employee/history para ver historial
5. Navegar a /app/employee/absences/new
6. Completar formulario de ausencia y enviar
7. Verificar que aparece en /app/employee/absences
```

### 3. Pruebas como Jefe Directo
```
1. Navegar a /app/manager
2. Verificar estadísticas del equipo
3. Si hay solicitudes pendientes, aparecerán en alerta
4. Navegar a /app/manager/requests
5. Aprobar o rechazar una solicitud
6. Navegar a /app/manager/history
7. Probar filtros de búsqueda
```

## Componentes UI Utilizados

- **StatCard**: Tarjetas de estadísticas
- **StatusBadge**: Badges de estado (PUNTUAL, TARDANZA, PENDIENTE, etc.)
- **DataTable**: Tablas de datos
- **ConfirmDialog**: Diálogos de confirmación
- **UserInfoCard**: Información de usuario
- **PageHeader**: Encabezados de página

## Hooks Disponibles

- `useAttendance`: Gestión de asistencias
- `useAbsence`: Gestión de ausencias
- `useManagerEmployees`: Empleados de un manager
- `useAuth`: Autenticación y usuario actual

## Verificación de Conexión

Para verificar que las rutas están correctamente conectadas:

1. Abrir DevTools del navegador (F12)
2. Ir a la pestaña Console
3. Navegar por las diferentes rutas
4. Verificar que no haya errores de:
   - Importación de componentes
   - Rutas no encontradas
   - Hooks de Supabase

## Comandos Útiles

```bash
# Desarrollo
bun run dev

# Build de producción
bun run build

# Verificar tipos
bun run typecheck

# Formatear código
bun run format
```

## Posibles Issues y Soluciones

### Error: "Route not found"
- Verificar que el archivo de ruta existe en `src/routes/`
- Ejecutar `bun run dev` para regenerar routeTree.gen.ts

### Error: "Module not found"
- Ejecutar `bun install` para reinstalar dependencias
- Verificar imports relativos/absolutos (#/)

### Error de geolocalización
- Asegurar que el navegador tiene permisos de ubicación
- Usar HTTPS o localhost

### Error de autenticación
- Verificar variables de entorno en .env
- Confirmar conexión con Supabase
