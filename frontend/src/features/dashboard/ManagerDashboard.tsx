// src/features/dashboard/ManagerDashboard.tsx
import {
  Users, FileCheck, Clock, CheckCircle, XCircle, LayoutDashboard,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { StatCard } from "@/components/custom/StatCard";
import { PageHeader } from "@/components/custom/PageHeader";
import { StatusBadge } from "@/components/custom/StatusBadge";
import { DataTable } from "@/components/custom/DataTable";
import type { Column } from "@/components/custom/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Row = Record<string, unknown>;

const teamAttendance: Row[] = [
  { nombre: "Ana García", entrada: "08:02", salida: "—", estado: "PUNTUAL", modalidad: "PRESENCIAL" },
  { nombre: "Carlos López", entrada: "08:45", salida: "—", estado: "TARDANZA", modalidad: "PRESENCIAL" },
  { nombre: "María Torres", entrada: "07:58", salida: "17:03", estado: "PUNTUAL", modalidad: "REMOTO" },
  { nombre: "Roberto Vega", entrada: "—", salida: "—", estado: "AUSENTE", modalidad: "—" },
];

const teamColumns: Column<Row>[] = [
  { key: "nombre", header: "Empleado" },
  { key: "entrada", header: "Entrada" },
  { key: "salida", header: "Salida" },
  { key: "modalidad", header: "Modalidad", cell: (r) => <span className="text-xs text-muted-foreground">{String(r.modalidad)}</span> },
  { key: "estado", header: "Estado", cell: (r) => <StatusBadge status={String(r.estado)} /> },
];

const pendingRequests: Row[] = [
  { empleado: "Roberto Vega", tipo: "Permiso Personal", fecha: "2025-06-20", horas: 4 },
  { empleado: "Lilian Castro", tipo: "Cita Médica", fecha: "2025-06-22", horas: 2 },
];

const requestColumns: Column<Row>[] = [
  { key: "empleado", header: "Empleado" },
  { key: "tipo", header: "Tipo Ausencia" },
  { key: "fecha", header: "Fecha" },
  { key: "horas", header: "Horas", cell: (r) => <span className="font-medium">{String(r.horas)}h</span> },
  {
    key: "actions",
    header: "Acción",
    cell: () => (
      <div className="flex gap-1">
        <Button size="icon" variant="ghost" className="size-7 text-green-600 hover:text-green-700 hover:bg-green-50">
          <CheckCircle className="size-4" />
        </Button>
        <Button size="icon" variant="ghost" className="size-7 text-red-600 hover:text-red-700 hover:bg-red-50">
          <XCircle className="size-4" />
        </Button>
      </div>
    ),
  },
];

export function ManagerDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Panel del Jefe"
        description="Gestiona la asistencia y ausencias de tu equipo"
        icon={LayoutDashboard}
        actions={
          <Button asChild size="sm">
            <Link to="/_auth/app/manager/requests">Ver Solicitudes</Link>
          </Button>
        }
      />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard title="Mi Equipo" value={8} icon={Users} variant="primary" subtitle="Empleados activos" />
        <StatCard title="Presentes Hoy" value={6} icon={CheckCircle} variant="success" />
        <StatCard title="Tardanzas" value={1} icon={Clock} variant="warning" subtitle="Hoy" />
        <StatCard title="Solicitudes Pendientes" value={2} icon={FileCheck} variant="danger" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Equipo — Hoy</CardTitle>
              <Button asChild variant="ghost" size="sm" className="text-xs text-primary">
                <Link to="/_auth/app/manager/history">Historial →</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <DataTable
              columns={teamColumns}
              data={teamAttendance}
              className="rounded-none border-0 border-t"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Solicitudes Pendientes</CardTitle>
              <Button asChild variant="ghost" size="sm" className="text-xs text-primary">
                <Link to="/_auth/app/manager/requests">Ver todas →</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <DataTable
              columns={requestColumns}
              data={pendingRequests}
              className="rounded-none border-0 border-t"
              emptyMessage="No hay solicitudes pendientes"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
