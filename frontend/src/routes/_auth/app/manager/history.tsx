// Historial de asistencias del equipo para el manager
import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
	ArrowLeft,
	Calendar,
	Clock,
	FileText,
	Filter,
	Search,
	Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
	useAbsence,
	useManagerEmployees,
} from "#/features/attendance/hooks/useAttendance";
import { useAuth } from "#/features/auth";
import { StatusBadge } from "@/components/custom/StatusBadge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_auth/app/manager/history")({
	component: ManagerHistoryPage,
});

function ManagerHistoryPage() {
	const { usuarioApp } = useAuth();
	const { getManagerEmployees, getEmployeesAttendances } =
		useManagerEmployees();
	const { getPendingAbsencesForManager } = useAbsence();

	const [employees, setEmployees] = useState<any[]>([]);
	const [attendances, setAttendances] = useState<any[]>([]);
	const [pendingAbsences, setPendingAbsences] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// Filtros
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedEmployee, setSelectedEmployee] = useState<string>("all");
	const [selectedType, setSelectedType] = useState<string>("all");

	useEffect(() => {
		if (!usuarioApp) return;

		const loadData = async () => {
			setIsLoading(true);
			const [emps, atts, absences] = await Promise.all([
				getManagerEmployees(usuarioApp.IdUsuario),
				getEmployeesAttendances(usuarioApp.IdUsuario, 500),
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

	// Filtrar asistencias
	const filteredAttendances = attendances.filter((a) => {
		const matchesSearch =
			searchTerm === "" ||
			a.USUARIOS?.NombreCompleto?.toLowerCase().includes(
				searchTerm.toLowerCase(),
			) ||
			a.USUARIOS?.CorreoInstitucional?.toLowerCase().includes(
				searchTerm.toLowerCase(),
			);

		const matchesEmployee =
			selectedEmployee === "all" || a.IdUsuario.toString() === selectedEmployee;

		const matchesType = selectedType === "all" || a.Tipo === selectedType;

		return matchesSearch && matchesEmployee && matchesType;
	});

	// Agrupar por empleado
	const groupedByEmployee = filteredAttendances.reduce(
		(acc, attendance) => {
			const empId = attendance.IdUsuario;
			if (!acc[empId]) acc[empId] = [];
			acc[empId].push(attendance);
			return acc;
		},
		{} as Record<number, any[]>,
	);

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="icon" asChild>
					<Link to="/_auth/app/manager">
						<ArrowLeft className="h-5 w-5" />
					</Link>
				</Button>
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Historial del Equipo
					</h1>
					<p className="text-muted-foreground">
						Consulta todas las asistencias de tu equipo
					</p>
				</div>
			</div>

			{/* Filtros */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Filter className="h-5 w-5" />
						Filtros
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Buscar por nombre o email..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>
						<Select
							value={selectedEmployee}
							onValueChange={setSelectedEmployee}
						>
							<SelectTrigger>
								<SelectValue placeholder="Todos los empleados" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Todos los empleados</SelectItem>
								{employees.map((emp) => (
									<SelectItem
										key={emp.IdUsuario}
										value={emp.IdUsuario.toString()}
									>
										{emp.NombreCompleto}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Select value={selectedType} onValueChange={setSelectedType}>
							<SelectTrigger>
								<SelectValue placeholder="Todos los tipos" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Todos los tipos</SelectItem>
								<SelectItem value="ENTRADA">Entrada</SelectItem>
								<SelectItem value="SALIDA">Salida</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Estadísticas */}
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Total Registros
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-bold">{filteredAttendances.length}</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Entradas
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-bold text-green-600">
							{filteredAttendances.filter((a) => a.Tipo === "ENTRADA").length}
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Salidas
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-bold text-orange-600">
							{filteredAttendances.filter((a) => a.Tipo === "SALIDA").length}
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Asistencias por empleado */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Users className="h-5 w-5" />
						Asistencias por Empleado
					</CardTitle>
					<CardDescription>
						{Object.keys(groupedByEmployee).length} empleados con registros
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="text-center py-8 text-muted-foreground">
							Cargando historial...
						</div>
					) : filteredAttendances.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							<Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
							<p>No se encontraron registros con los filtros actuales.</p>
						</div>
					) : (
						<div className="space-y-6">
							{Object.entries(groupedByEmployee).map(
								([empId, empAttendances]) => {
									const employee = employees.find(
										(e) => e.IdUsuario.toString() === empId,
									);
									if (!employee) return null;

									return (
										<div key={empId}>
											<div className="flex items-center gap-3 mb-3 pb-2 border-b">
												<div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
													<span className="text-sm font-semibold text-primary">
														{employee.NombreCompleto.charAt(0)}
													</span>
												</div>
												<div>
													<h3 className="font-semibold">
														{employee.NombreCompleto}
													</h3>
													<p className="text-sm text-muted-foreground">
														{employee.CorreoInstitucional}
													</p>
												</div>
												<div className="ml-auto text-sm text-muted-foreground">
													{empAttendances.length} registros
												</div>
											</div>
											<div className="rounded-md border">
												<div className="grid grid-cols-4 gap-4 p-3 bg-muted font-medium text-sm">
													<div>Fecha</div>
													<div>Tipo</div>
													<div>Hora</div>
													<div>Estado</div>
												</div>
												<div className="divide-y">
													{empAttendances.map(
														(asistencia: any, idx: number) => (
															<div
																key={idx}
																className="grid grid-cols-4 gap-4 p-3 text-sm hover:bg-muted/50"
															>
																<div className="flex items-center gap-2">
																	<Calendar className="h-4 w-4 text-muted-foreground" />
																	{asistencia.FechaHora
																		? format(
																				new Date(asistencia.FechaHora),
																				"dd/MM/yyyy",
																			)
																		: "N/A"}
																</div>
																<div>
																	<StatusBadge
																		variant={
																			asistencia.Tipo === "ENTRADA"
																				? "success"
																				: "warning"
																		}
																	>
																		{asistencia.Tipo === "ENTRADA"
																			? "Entrada"
																			: "Salida"}
																	</StatusBadge>
																</div>
																<div className="flex items-center gap-2">
																	<Clock className="h-4 w-4 text-muted-foreground" />
																	{asistencia.FechaHora
																		? format(
																				new Date(asistencia.FechaHora),
																				"HH:mm:ss",
																			)
																		: "N/A"}
																</div>
																<div>
																	{asistencia.EstadoPuntualidad ? (
																		<StatusBadge
																			variant={
																				asistencia.EstadoPuntualidad ===
																				"PUNTUAL"
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
																		<span className="text-muted-foreground">
																			N/A
																		</span>
																	)}
																</div>
															</div>
														),
													)}
												</div>
											</div>
										</div>
									);
								},
							)}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Solicitudes de ausencia */}
			{pendingAbsences.length > 0 && (
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle className="flex items-center gap-2">
									<FileText className="h-5 w-5" />
									Solicitudes Pendientes
								</CardTitle>
								<CardDescription>
									{pendingAbsences.length} solicitudes esperando aprobación
								</CardDescription>
							</div>
							<Button variant="outline" size="sm" asChild>
								<Link to="/_auth/app/manager/requests">Gestionar</Link>
							</Button>
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{pendingAbsences.map((ausencia) => (
								<div
									key={ausencia.IdAusencia}
									className="flex items-center justify-between p-3 bg-muted rounded-md"
								>
									<div className="flex items-center gap-3">
										<div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
											<span className="text-xs font-semibold text-primary">
												{ausencia.USUARIOS?.NombreCompleto?.charAt(0) || "U"}
											</span>
										</div>
										<div>
											<p className="font-medium text-sm">
												{ausencia.USUARIOS?.NombreCompleto || "Empleado"}
											</p>
											<p className="text-xs text-muted-foreground">
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
									<StatusBadge variant="warning">Pendiente</StatusBadge>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
