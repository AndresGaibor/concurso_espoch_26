// Dashboard del Manager/Jefe Directo
import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
	AlertCircle,
	Calendar,
	CheckCircle,
	Clock,
	FileCheck,
	Users,
	XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
	useAbsence,
	useManagerEmployees,
} from "#/features/attendance/hooks/useAttendance";
import { useAuth } from "#/features/auth";
import { StatCard } from "@/components/custom/StatCard";
import { StatusBadge } from "@/components/custom/StatusBadge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/_auth/app/manager/")({
	component: ManagerDashboardPage,
});

function ManagerDashboardPage() {
	const { usuarioApp } = useAuth();
	const {
		getManagerEmployees,
		getEmployeesAttendances,
		isLoading: employeesLoading,
	} = useManagerEmployees();
	const { getPendingAbsencesForManager } = useAbsence();

	const [employees, setEmployees] = useState<any[]>([]);
	const [attendances, setAttendances] = useState<any[]>([]);
	const [pendingAbsences, setPendingAbsences] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!usuarioApp) return;

		const loadData = async () => {
			setIsLoading(true);
			const [emps, atts, absences] = await Promise.all([
				getManagerEmployees(usuarioApp.IdUsuario),
				getEmployeesAttendances(usuarioApp.IdUsuario, 100),
				getPendingAbsencesForManager(usuarioApp.IdUsuario),
			]);
			setEmployees(emps);
			setAttendances(atts);
			setPendingAbsences(absences);
			setIsLoading(false);
		};

		loadData();
	}, [
		usuarioApp,
		getManagerEmployees,
		getEmployeesAttendances,
		getPendingAbsencesForManager,
	]);

	// Estadísticas
	const totalEmployees = employees.length;
	const today = new Date().toDateString();
	const todayAttendances = attendances.filter((a) => {
		if (!a.FechaHora) return false;
		return (
			new Date(a.FechaHora).toDateString() === today && a.Tipo === "ENTRADA"
		);
	});
	const presentToday = new Set(todayAttendances.map((a) => a.IdUsuario)).size;
	const pendingAbsencesCount = pendingAbsences.length;

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Panel del Jefe Directo
					</h1>
					<p className="text-muted-foreground">
						Gestiona tu equipo y revisa las asistencias
					</p>
				</div>
			</div>

			{/* Estadísticas */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<StatCard
					title="Total Empleados"
					value={totalEmployees}
					icon={Users}
					description="Miembros en tu equipo"
				/>
				<StatCard
					title="Presentes Hoy"
					value={`${presentToday}/${totalEmployees}`}
					icon={CheckCircle}
					description="Empleados que marcaron entrada"
					valueClass={
						presentToday === totalEmployees
							? "text-green-600"
							: "text-orange-600"
					}
				/>
				<StatCard
					title="Solicitudes Pendientes"
					value={pendingAbsencesCount}
					icon={AlertCircle}
					description="Esperan tu aprobación"
					valueClass={
						pendingAbsencesCount > 0 ? "text-destructive" : "text-green-600"
					}
				/>
				<StatCard
					title="Asistencias (Total)"
					value={attendances.length}
					icon={Clock}
					description="Registros totales"
				/>
			</div>

			{/* Solicitudes Pendientes */}
			{pendingAbsencesCount > 0 && (
				<Card className="border-destructive/50">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-destructive">
							<AlertCircle className="h-5 w-5" />
							Solicitudes Pendientes de Aprobación
						</CardTitle>
						<CardDescription>
							Tienes {pendingAbsencesCount}{" "}
							{pendingAbsencesCount === 1 ? "solicitud" : "solicitudes"}{" "}
							esperando revisión
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{pendingAbsences.slice(0, 3).map((ausencia) => (
								<div
									key={ausencia.IdAusencia}
									className="flex items-center justify-between p-3 bg-muted rounded-md"
								>
									<div className="flex items-center gap-3">
										<div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
											<span className="text-sm font-semibold text-primary">
												{ausencia.USUARIOS?.NombreCompleto?.charAt(0) || "U"}
											</span>
										</div>
										<div>
											<p className="font-medium">
												{ausencia.USUARIOS?.NombreCompleto || "Empleado"}
											</p>
											<p className="text-sm text-muted-foreground">
												{ausencia.TipoAusencia?.toLowerCase().replace("_", " ")}{" "}
												-{" "}
												{ausencia.FechaAusencia
													? format(new Date(ausencia.FechaAusencia), "PPP", {
															locale: es,
														})
													: "N/A"}
											</p>
										</div>
									</div>
									<Button asChild size="sm">
										<Link to="/app/manager/requests">Revisar</Link>
									</Button>
								</div>
							))}
						</div>
						{pendingAbsences.length > 3 && (
							<Button variant="link" asChild className="mt-2">
								<Link to="/app/manager/requests">
									Ver todas las solicitudes ({pendingAbsences.length})
								</Link>
							</Button>
						)}
					</CardContent>
				</Card>
			)}

			{/* Asistencias Recientes del Equipo */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="flex items-center gap-2">
								<Clock className="h-5 w-5" />
								Asistencias Recientes
							</CardTitle>
							<CardDescription>Últimos registros de tu equipo</CardDescription>
						</div>
						<Button variant="outline" size="sm" asChild>
							<Link to="/app/manager/history">
								Ver historial completo
							</Link>
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					{employeesLoading || isLoading ? (
						<div className="text-center py-8 text-muted-foreground">
							Cargando asistencias...
						</div>
					) : attendances.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							<Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
							<p>No hay registros de asistencias de tu equipo.</p>
						</div>
					) : (
						<div className="rounded-md border">
							<div className="grid grid-cols-4 gap-4 p-3 bg-muted font-medium text-sm">
								<div>Empleado</div>
								<div>Tipo</div>
								<div>Fecha y Hora</div>
								<div>Estado</div>
							</div>
							<div className="divide-y">
								{attendances
									.slice(0, 10)
									.map((asistencia: any, idx: number) => (
										<div
											key={idx}
											className="grid grid-cols-4 gap-4 p-3 text-sm hover:bg-muted/50"
										>
											<div className="flex items-center gap-2">
												<div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
													<span className="text-xs font-semibold text-primary">
														{asistencia.USUARIOS?.NombreCompleto?.charAt(0) ||
															"E"}
													</span>
												</div>
												<div>
													<p className="font-medium truncate">
														{asistencia.USUARIOS?.NombreCompleto || "Empleado"}
													</p>
													<p className="text-xs text-muted-foreground truncate">
														{asistencia.USUARIOS?.CorreoInstitucional || ""}
													</p>
												</div>
											</div>
											<div>
												<StatusBadge
													variant={
														asistencia.Tipo === "ENTRADA"
															? "success"
															: "warning"
													}
												>
													{asistencia.Tipo === "ENTRADA" ? "Entrada" : "Salida"}
												</StatusBadge>
											</div>
											<div className="flex items-center gap-2">
												<Calendar className="h-4 w-4 text-muted-foreground" />
												{asistencia.FechaHora
													? format(
															new Date(asistencia.FechaHora),
															"dd/MM/yyyy HH:mm",
														)
													: "N/A"}
											</div>
											<div>
												{asistencia.EstadoPuntualidad ? (
													<StatusBadge
														variant={
															asistencia.EstadoPuntualidad === "PUNTUAL"
																? "success"
																: "warning"
														}
													>
														{asistencia.EstadoPuntualidad.toLowerCase().replace(
															"_",
															" ",
														)}
													</StatusBadge>
												) : (
													<span className="text-muted-foreground">N/A</span>
												)}
											</div>
										</div>
									))}
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Equipo */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="flex items-center gap-2">
								<Users className="h-5 w-5" />
								Mi Equipo
							</CardTitle>
							<CardDescription>
								{totalEmployees}{" "}
								{totalEmployees === 1 ? "empleado" : "empleados"} a cargo
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{employeesLoading ? (
						<div className="text-center py-8 text-muted-foreground">
							Cargando equipo...
						</div>
					) : employees.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							<Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
							<p>No tienes empleados asignados.</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{employees.map((empleado) => {
								const empAttendances = attendances.filter(
									(a) => a.IdUsuario === empleado.IdUsuario,
								);
								const checkedInToday = empAttendances.some((a) => {
									if (!a.FechaHora) return false;
									return (
										new Date(a.FechaHora).toDateString() === today &&
										a.Tipo === "ENTRADA"
									);
								});

								return (
									<div
										key={empleado.IdUsuario}
										className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
									>
										<div className="flex items-center gap-3">
											<div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
												<span className="text-sm font-semibold text-primary">
													{empleado.NombreCompleto.charAt(0)}
												</span>
											</div>
											<div className="flex-1 min-w-0">
												<p className="font-medium truncate">
													{empleado.NombreCompleto}
												</p>
												<p className="text-xs text-muted-foreground truncate">
													{empleado.CorreoInstitucional}
												</p>
											</div>
											{checkedInToday ? (
												<CheckCircle className="h-5 w-5 text-green-600" />
											) : (
												<XCircle className="h-5 w-5 text-muted-foreground" />
											)}
										</div>
									</div>
								);
							})}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Accesos rápidos */}
			<div className="grid gap-4 md:grid-cols-2">
				<Card className="hover:shadow-md transition-shadow cursor-pointer">
					<Link to="/app/manager/requests">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<FileCheck className="h-5 w-5" />
								Gestionar Solicitudes
							</CardTitle>
							<CardDescription>Aprobar o rechazar ausencias</CardDescription>
						</CardHeader>
					</Link>
				</Card>

				<Card className="hover:shadow-md transition-shadow cursor-pointer">
					<Link to="/app/manager/history">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Clock className="h-5 w-5" />
								Historial del Equipo
							</CardTitle>
							<CardDescription>Ver todas las asistencias</CardDescription>
						</CardHeader>
					</Link>
				</Card>
			</div>
		</div>
	);
}
