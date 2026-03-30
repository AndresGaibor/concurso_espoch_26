// src/features/dashboard/AdminDashboard.tsx

import { Link } from "@tanstack/react-router";
import {
	AlertCircle,
	CalendarOff,
	ClipboardCheck,
	Clock,
	LayoutDashboard,
	Users,
} from "lucide-react";
import type { Column } from "@/components/custom/DataTable";
import { DataTable } from "@/components/custom/DataTable";
import { PageHeader } from "@/components/custom/PageHeader";
import { StatCard } from "@/components/custom/StatCard";
import { StatusBadge } from "@/components/custom/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AttendanceRow = Record<string, unknown>;

const recentAttendances: AttendanceRow[] = [
	{
		id: 1,
		nombre: "Ana García",
		tipo: "Entrada",
		hora: "08:02",
		modalidad: "PRESENCIAL",
		estado: "PUNTUAL",
	},
	{
		id: 2,
		nombre: "Carlos López",
		tipo: "Entrada",
		hora: "08:45",
		modalidad: "PRESENCIAL",
		estado: "TARDANZA",
	},
	{
		id: 3,
		nombre: "María Torres",
		tipo: "Entrada",
		hora: "07:58",
		modalidad: "REMOTO",
		estado: "PUNTUAL",
	},
	{
		id: 4,
		nombre: "Juan Pérez",
		tipo: "Salida",
		hora: "17:01",
		modalidad: "PRESENCIAL",
		estado: "PUNTUAL",
	},
	{
		id: 5,
		nombre: "Sofía Ruiz",
		tipo: "Entrada",
		hora: "09:10",
		modalidad: "REMOTO",
		estado: "TARDANZA",
	},
];

const attendanceColumns: Column<AttendanceRow>[] = [
	{ key: "nombre", header: "Empleado" },
	{
		key: "tipo",
		header: "Tipo",
		cell: (r) => (
			<Badge variant="outline" className="text-xs">
				{String(r.tipo)}
			</Badge>
		),
	},
	{ key: "hora", header: "Hora" },
	{
		key: "modalidad",
		header: "Modalidad",
		cell: (r) => (
			<span className="text-xs text-muted-foreground">
				{String(r.modalidad)}
			</span>
		),
	},
	{
		key: "estado",
		header: "Estado",
		cell: (r) => <StatusBadge status={String(r.estado)} />,
	},
];

const pendingAbsences: AttendanceRow[] = [
	{
		id: 1,
		empleado: "Roberto Vega",
		tipo: "Permiso Personal",
		fecha: "2025-06-20",
		horas: 4,
	},
	{
		id: 2,
		empleado: "Lilian Castro",
		tipo: "Cita Médica",
		fecha: "2025-06-22",
		horas: 2,
	},
	{
		id: 3,
		empleado: "Diego Mora",
		tipo: "Trámite Personal",
		fecha: "2025-06-25",
		horas: 8,
	},
];

const absenceColumns: Column<AttendanceRow>[] = [
	{ key: "empleado", header: "Empleado" },
	{ key: "tipo", header: "Tipo" },
	{ key: "fecha", header: "Fecha" },
	{
		key: "horas",
		header: "Horas",
		cell: (r) => <span className="font-medium">{String(r.horas)}h</span>,
	},
	{
		key: "estado",
		header: "Estado",
		cell: () => <StatusBadge status="PENDIENTE" />,
	},
];

export function AdminDashboard() {
	return (
		<div className="space-y-6">
			<PageHeader
				title="Panel de Administración"
				description="Vista general del sistema de control de asistencias"
				icon={LayoutDashboard}
				actions={
					<Button asChild size="sm">
						<Link to="/_auth/app/admin/users">Ver Usuarios</Link>
					</Button>
				}
			/>

			<div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
				<StatCard
					title="Total Empleados"
					value={42}
					icon={Users}
					variant="primary"
					subtitle="Activos en el sistema"
				/>
				<StatCard
					title="Asistencias Hoy"
					value={38}
					icon={ClipboardCheck}
					variant="success"
					trendLabel="+3 desde ayer"
				/>
				<StatCard
					title="Tardanzas"
					value={4}
					icon={AlertCircle}
					variant="warning"
					subtitle="Hoy"
				/>
				<StatCard
					title="Ausencias Pendientes"
					value={3}
					icon={CalendarOff}
					variant="danger"
					subtitle="Por aprobar"
				/>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader className="pb-3">
						<div className="flex items-center justify-between">
							<CardTitle className="text-base">Asistencias Recientes</CardTitle>
							<Button
								asChild
								variant="ghost"
								size="sm"
								className="text-xs text-primary"
							>
								<Link to="/_auth/app/admin/attendances">Ver todas →</Link>
							</Button>
						</div>
					</CardHeader>
					<CardContent className="px-0 pb-0">
						<DataTable
							columns={attendanceColumns}
							data={recentAttendances}
							className="rounded-none border-0 border-t"
						/>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-3">
						<div className="flex items-center justify-between">
							<CardTitle className="text-base">Ausencias Pendientes</CardTitle>
							<Button
								asChild
								variant="ghost"
								size="sm"
								className="text-xs text-primary"
							>
								<Link to="/_auth/app/admin/absences">Ver todas →</Link>
							</Button>
						</div>
					</CardHeader>
					<CardContent className="px-0 pb-0">
						<DataTable
							columns={absenceColumns}
							data={pendingAbsences}
							className="rounded-none border-0 border-t"
						/>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="text-base">Accesos Rápidos</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
						{[
							{
								to: "/_auth/app/admin/users" as const,
								label: "Usuarios",
								icon: Users,
							},
							{
								to: "/_auth/app/admin/schedules" as const,
								label: "Horarios",
								icon: Clock,
							},
							{
								to: "/_auth/app/admin/attendances" as const,
								label: "Asistencias",
								icon: ClipboardCheck,
							},
							{
								to: "/_auth/app/admin/absences" as const,
								label: "Ausencias",
								icon: CalendarOff,
							},
						].map(({ to, label, icon: Icon }) => (
							<Button
								key={to}
								asChild
								variant="outline"
								className="h-auto flex-col gap-2 py-4"
							>
								<Link to={to}>
									<Icon className="size-5 text-primary" />
									<span className="text-xs">{label}</span>
								</Link>
							</Button>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
