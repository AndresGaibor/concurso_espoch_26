import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  MapPin,
  MapPinCheck,
  Search,
  Settings,
  Users,
  UserCheck,
  AlertCircle,
  Plus,
  Radar,
  Edit,
  Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_auth/app/admin/")({
  component: AdminDashboardPage,
});

interface LocationItem {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number;
}

interface ShiftTemplate {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  days: string;
  color: string;
}

interface AttendanceRecord {
  id: string;
  employeeName: string;
  employeeId: string;
  initials: string;
  department: string;
  checkIn: string;
  status: "aprobado" | "pendiente" | "rechazado";
  location: string;
}

interface UserRole {
  id: string;
  name: string;
  description: string;
  icon: string;
  userCount: number;
  users: { name: string; avatar: string }[];
}

const locations: LocationItem[] = [
  {
    id: "1",
    name: "Campus Principal - Av. Arequipa",
    lat: -12.07342,
    lng: -77.03451,
    radius: 200,
  },
  {
    id: "2",
    name: "Sede Lince - Facultad de Salud",
    lat: -12.08125,
    lng: -77.03212,
    radius: 150,
  },
  {
    id: "3",
    name: "Centro de Idiomas - Petit Thouars",
    lat: -12.07554,
    lng: -77.03333,
    radius: 100,
  },
];

const shifts: ShiftTemplate[] = [
  {
    id: "1",
    name: "DOCENCIA MAÑANA",
    startTime: "07:00",
    endTime: "13:00",
    days: "L-S",
    color: "border-primary",
  },
  {
    id: "2",
    name: "ADMINISTRATIVO FULL",
    startTime: "08:30",
    endTime: "18:00",
    days: "L-V",
    color: "border-secondary",
  },
  {
    id: "3",
    name: "DOCENCIA NOCHE",
    startTime: "18:00",
    endTime: "22:30",
    days: "L-V",
    color: "border-blue-500",
  },
];

const attendances: AttendanceRecord[] = [
  {
    id: "1",
    employeeName: "Alejandro Mendoza",
    employeeId: "450921-X",
    initials: "AM",
    department: "Facultad de Ingeniería",
    checkIn: "08:24 AM",
    status: "aprobado",
    location: "Campus Principal",
  },
  {
    id: "2",
    employeeName: "Sofia Cardenas",
    employeeId: "320188-B",
    initials: "SC",
    department: "Administración Pública",
    checkIn: "08:42 AM",
    status: "pendiente",
    location: "Sede Lince",
  },
  {
    id: "3",
    employeeName: "Ricardo Palma",
    employeeId: "882012-K",
    initials: "RP",
    department: "Investigación Académica",
    checkIn: "--:--",
    status: "rechazado",
    location: "Trabajo Remoto",
  },
];

const roles: UserRole[] = [
  {
    id: "1",
    name: "Administrador Global",
    description:
      "Acceso completo a configuración del sistema, reportes financieros y eliminación de usuarios.",
    icon: "admin",
    userCount: 4,
    users: [
      { name: "User 1", avatar: "" },
      { name: "User 2", avatar: "" },
    ],
  },
  {
    id: "2",
    name: "Gestor de Facultad",
    description:
      "Gestiona asistencias y horarios de miembros específicos de la facultad.",
    icon: "manager",
    userCount: 24,
    users: [
      { name: "User 1", avatar: "" },
      { name: "User 2", avatar: "" },
    ],
  },
  {
    id: "3",
    name: "Empleado Estándar",
    description:
      "Acceso a funciones de registro de asistencia e historial personal.",
    icon: "employee",
    userCount: 1256,
    users: [
      { name: "User 1", avatar: "" },
    ],
  },
];

function AdminDashboardPage() {
  const getStatusBadge = (status: AttendanceRecord["status"]) => {
    switch (status) {
      case "aprobado":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            Aprobado
          </Badge>
        );
      case "pendiente":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
            Pendiente
          </Badge>
        );
      case "rechazado":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-700">
            Rechazado
          </Badge>
        );
    }
  };

  const getRoleIcon = (icon: string) => {
    switch (icon) {
      case "admin":
        return (
          <div className="bg-primary/5 p-2 rounded-lg">
            <Settings className="h-5 w-5 text-primary" />
          </div>
        );
      case "manager":
        return (
          <div className="bg-secondary/5 p-2 rounded-lg">
            <Users className="h-5 w-5 text-secondary" />
          </div>
        );
      case "employee":
        return (
          <div className="bg-blue-500/5 p-2 rounded-lg">
            <UserCheck className="h-5 w-5 text-blue-500" />
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Configuración y Reportes de Administración
          </h1>
          <p className="text-muted-foreground mt-1">
            Panel central para gestión de ubicaciones, horarios, asistencias y
            usuarios.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9 w-64"
              placeholder="Buscar configuración..."
            />
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Total Empleados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold">1,284</p>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                +12
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Ubicaciones Activas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold">08</p>
              <p className="text-xs text-muted-foreground">Campus Global</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Tasa de Puntualidad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold">94.2%</p>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                ↑ 2%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Tickets Abiertos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold">14</p>
              <Badge variant="destructive">Urgente</Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      <Tabs defaultValue="locations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="locations">Ubicaciones</TabsTrigger>
          <TabsTrigger value="schedules">Horarios</TabsTrigger>
          <TabsTrigger value="attendances">Asistencias</TabsTrigger>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
        </TabsList>

        {/* Locations Tab */}
        <TabsContent value="locations" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Gestión de Ubicaciones</CardTitle>
                  <CardDescription>
                    Configura geovallas y radio GPS para los campus.
                  </CardDescription>
                </div>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Agregar Ubicación
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  {locations.map((location) => (
                    <div
                      key={location.id}
                      className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors group cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-bold text-sm">
                          {location.name}
                        </h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[11px] font-mono text-muted-foreground uppercase">
                          LAT: {location.lat} | LONG: {location.lng}
                        </p>
                        <div className="flex items-center gap-2">
                          <Radar className="h-4 w-4 text-primary" />
                          <span className="text-xs font-medium">
                            Radio: {location.radius}m
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl overflow-hidden relative bg-muted/50 min-h-[300px] flex items-center justify-center">
                  <div className="text-center text-muted-foreground p-6">
                    <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Vista de mapa</p>
                    <p className="text-xs">
                      Integración con Google Maps / Leaflet
                    </p>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur-md p-3 rounded-lg flex items-center justify-between shadow-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-[10px] font-bold uppercase">
                        Modo Precisión Activo
                      </span>
                    </div>
                    <Button variant="link" className="text-xs h-auto p-0">
                      Recalibrar GPS
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedules Tab */}
        <TabsContent value="schedules" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Plantillas de Turnos</CardTitle>
                  <CardDescription>
                    Define horarios de trabajo principales para roles.
                  </CardDescription>
                </div>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nueva Plantilla
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {shifts.map((shift) => (
                  <div
                    key={shift.id}
                    className={`border-l-4 ${shift.color} bg-muted/50 p-4 rounded-r-lg`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="text-xs font-bold uppercase">
                        {shift.name}
                      </h5>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {shift.startTime} - {shift.endTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {shift.days}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendances Tab */}
        <TabsContent value="attendances" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Reporte Global de Asistencias</CardTitle>
                  <CardDescription>
                    Verificación en tiempo real de presencia y registros.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-md border">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-medium">
                      Oct 01, 2023 - Oct 31, 2023
                    </span>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Exportar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empleado</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Registro</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead className="text-right">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendances.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs font-bold">
                              {record.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-bold">
                              {record.employeeName}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              ID: {record.employeeId}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {record.department}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {record.checkIn}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(record.status)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {record.location}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Gestión de Usuarios y Permisos</CardTitle>
                  <CardDescription>
                    Administra roles y permisos de acceso.
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Gestionar Roles</Button>
                  <Button variant="outline">Auditoría</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {roles.map((role) => (
                  <Card key={role.id} className="border">
                    <CardContent className="p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        {getRoleIcon(role.icon)}
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                          {role.userCount} Usuarios
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold">{role.name}</h4>
                        <p className="text-[11px] text-muted-foreground mt-1">
                          {role.description}
                        </p>
                      </div>
                      <div className="flex -space-x-2">
                        {role.users.map((user, idx) => (
                          <Avatar
                            key={idx}
                            className="h-6 w-6 border-2 border-background"
                          >
                            <AvatarFallback className="text-[8px] bg-muted">
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {role.userCount > role.users.length && (
                          <div className="h-6 w-6 rounded-full bg-muted text-[8px] flex items-center justify-center font-bold border-2 border-background">
                            +{role.userCount - role.users.length}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
