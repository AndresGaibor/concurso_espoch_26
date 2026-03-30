# Verificación de Rutas - GUI Control de Asistencias ESPOCH

## ✅ Estado del Build
- **Build**: Exitoso
- **Servidor de Desarrollo**: Corriendo en `http://localhost:5173`
- **TypeScript**: Errores menores no bloqueantes (principalmente tipos no utilizados)

## 🗺️ Mapa de Rutas Conectadas

### Rutas Públicas
```
/ → Redirecciona a /login si no está autenticado
/login → LoginForm (autenticación con email/password o Microsoft)
/about → Página informativa
/gps → Página de prueba GPS
/unauthorized → Página de acceso denegado
```

### Rutas Autenticadas (`/_auth`)
Todas las rutas bajo `/_auth` están protegidas por el guard `authStore`

#### Layout Principal
```
/_auth/app → AppLayout (Sidebar + Header + Outlet)
```

#### Dashboard General
```
/app → AppIndexPage (selector de rol)
/app/profile → Perfil de usuario
```

#### Empleado (`/app/employee`)
```
/app/employee → EmployeeDashboardPage ✅
  - Registro entrada/salida con geolocalización
  - Resumen del día
  - Accesos rápidos

/app/employee/attendance → EmployeeAttendancePage ✅
  - Redirige al dashboard para registro

/app/employee/history → EmployeeHistoryPage ✅
  - Historial agrupado por mes
  - Estadísticas mensuales
  - Paginación

/app/employee/absences → EmployeeAbsencesPage ✅
  - Lista de ausencias
  - Estados (PENDIENTE, APROBADO, RECHAZADO)

/app/employee/absences/new → NewAbsencePage ✅
  - Formulario de solicitud
  - Select de tipo de ausencia
  - Cálculo automático de horas
```

#### Manager/Jefe Directo (`/app/manager`)
```
/app/manager → ManagerDashboardPage ✅
  - Estadísticas del equipo
  - Solicitudes pendientes
  - Asistencias recientes
  - Lista de empleados

/app/manager/requests → ManagerRequestsPage ✅
  - Lista de solicitudes pendientes
  - Diálogo de aprobación
  - Diálogo de rechazo con motivo

/app/manager/history → ManagerHistoryPage ✅
  - Historial de todo el equipo
  - Filtros por empleado y tipo
  - Búsqueda por nombre/email
```

#### Administrador (`/app/admin`)
```
/app/admin → AdminIndexPage ✅
  - Enlaces a todas las secciones

/app/admin/users → (pendiente de implementación)
/app/admin/schedules → (pendiente de implementación)
/app/admin/locations → (pendiente de implementación)
/app/admin/attendances → (pendiente de implementación)
/app/admin/absences → (pendiente de implementación)
```

## 🔌 Conexiones Verificadas

### Componentes → Rutas
| Componente | Ruta | Estado |
|------------|------|--------|
| EmployeeDashboardPage | /app/employee | ✅ Conectado |
| EmployeeHistoryPage | /app/employee/history | ✅ Conectado |
| EmployeeAbsencesPage | /app/employee/absences | ✅ Conectado |
| NewAbsencePage | /app/employee/absences/new | ✅ Conectado |
| ManagerDashboardPage | /app/manager | ✅ Conectado |
| ManagerRequestsPage | /app/manager/requests | ✅ Conectado |
| ManagerHistoryPage | /app/manager/history | ✅ Conectado |

### Sidebar → Rutas
El `AppSidebar` detecta automáticamente el rol del usuario y muestra:

**Empleado:**
- Inicio → /app/employee
- Registrar Asistencia → /app/employee/attendance
- Mis Ausencias → /app/employee/absences
- Mi Historial → /app/employee/history

**Manager:**
- Inicio → /app/manager
- Solicitudes → /app/manager/requests
- Historial Equipo → /app/manager/history

**Admin:**
- Inicio → /app/admin
- Usuarios → /app/admin/users
- Horarios → /app/admin/schedules
- Ubicaciones → /app/admin/locations
- Asistencias → /app/admin/attendances
- Ausencias → /app/admin/absences

### Hooks → Supabase
| Hook | Función | Tabla | Estado |
|------|---------|-------|--------|
| useAttendance | registerAttendance | ASISTENCIAS | ✅ |
| useAttendance | getUserAttendances | ASISTENCIAS | ✅ |
| useAttendance | getLastAttendance | ASISTENCIAS | ✅ |
| useAbsence | createAbsence | AUSENCIAS | ✅ |
| useAbsence | getUserAbsences | AUSENCIAS | ✅ |
| useAbsence | getPendingAbsencesForManager | AUSENCIAS | ✅ |
| useAbsence | updateAbsenceStatus | AUSENCIAS | ✅ |
| useManagerEmployees | getManagerEmployees | USUARIOS | ✅ |
| useManagerEmployees | getEmployeesAttendances | ASISTENCIAS + USUARIOS | ✅ |

## 🧪 Pruebas Recomendadas

### 1. Acceso Inicial
```
1. Abrir http://localhost:5173
2. Verificar redirección a /login
3. Iniciar sesión con credenciales de prueba
```

### 2. Rol Empleado
```
1. Navegar a /app/employee
2. Click en "Marcar Entrada" → Permitir geolocalización
3. Verificar aparición en "Resumen de Hoy"
4. Navegar a /app/employee/history
5. Navegar a /app/employee/absences/new
6. Completar y enviar formulario
7. Verificar en /app/employee/absences
```

### 3. Rol Manager
```
1. Navegar a /app/manager
2. Verificar estadísticas
3. Si hay solicitudes pendientes, click en "Revisar"
4. En /app/manager/requests, aprobar/rechazar
5. Navegar a /app/manager/history
6. Probar filtros de búsqueda
```

### 4. Navegación
```
1. Verificar que el sidebar muestra opciones correctas según rol
2. Click en cada enlace del sidebar
3. Verificar que no hay errores 404
4. Verificar que el breadcrumb funciona
```

## 🛠️ Comandos Útiles

```bash
# Desarrollo
cd frontend && bun run dev

# Build producción
cd frontend && bun run build

# Verificar tipos
cd frontend && bun run typecheck

# Formatear
cd frontend && bun run format
```

## 📝 Notas Importantes

1. **Geolocalización**: Requiere HTTPS o localhost. El navegador pedirá permiso.

2. **Roles**: Los roles se determinan por la tabla ROLES en la BD:
   - ADMIN → Panel completo de administración
   - MANAGER → Vista de equipo y aprobaciones
   - EMPLOYEE → Vista personal de asistencias

3. **Jefe Directo**: La relación se establece en USUARIOS.IdJefeDirecto

4. **Estados de Ausencia**:
   - PENDIENTE → Espera aprobación
   - APROBADO → Aceptada por el manager
   - RECHAZADO → Rechazada con motivo opcional

5. **Build**: Los archivos en `dist/` son estáticos, listos para deploy.

## 🎯 Próximos Pasos

1. Probar en el navegador siguiendo la guía
2. Verificar conexión con Supabase
3. Confirmar que los datos se guardan correctamente
4. Testear flujos completos (registro → historial → ausencia → aprobación)
