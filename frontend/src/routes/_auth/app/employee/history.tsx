// Historial de Ausencias del empleado
import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
	Calendar,
	ChevronLeft,
	ChevronRight,
	Clock,
	Download,
	Eye,
	FileText,
	Filter,
	Info,
	MoreHorizontal,
	Plus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAbsence } from "#/features/attendance/hooks/useAttendance";
import { useAuth } from "#/features/auth";
import { StatusBadge } from "@/components/custom/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_auth/app/employee/history")({
	component: EmployeeHistoryPage,
});

interface AusenciaExtended {
	IdAusencia: number;
	FechaSolicitud: string | null;
	FechaAusencia: string | null;
	TipoAusencia: string | null;
	TotalHoras: number | null;
	EstadoAprobacion: string | null;
	IdAprobador: number | null;
	Motivo: string | null;
	MotivoRechazo: string | null;
	aprobador?: {
		NombreCompleto: string;
	};
}

function EmployeeHistoryPage() {
	const { usuarioApp } = useAuth();
	const { getUserAbsences, isLoading } = useAbsence();
	const [absences, setAbsences] = useState<AusenciaExtended[]>([]);
	const [filteredAbsences, setFilteredAbsences] = useState<AusenciaExtended[]>(
		[],
	);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	// Filtros
	const [estadoFilter, setEstadoFilter] = useState<string>("todos");
	const [tipoFilter, setTipoFilter] = useState<string>("todos");
	const [fechaInicio, setFechaInicio] = useState<string>("");
	const [fechaFin, setFechaFin] = useState<string>("");

	useEffect(() => {
		if (!usuarioApp) return;

		const loadAbsences = async () => {
			const data = await getUserAbsences(usuarioApp.IdUsuario);
			setAbsences(data);
		};

		loadAbsences();
	}, [usuarioApp, getUserAbsences]);

	// Aplicar filtros
	useEffect(() => {
		let filtered = [...absences];

		// Filtro por estado
		if (estadoFilter !== "todos") {
			filtered = filtered.filter(
				(a) => a.EstadoAprobacion?.toUpperCase() === estadoFilter.toUpperCase(),
			);
		}

		// Filtro por tipo
		if (tipoFilter !== "todos") {
			filtered = filtered.filter(
				(a) =>
					a.TipoAusencia?.toUpperCase() === tipoFilter.toUpperCase() ||
					(tipoFilter === "VACACIONES" &&
						a.TipoAusencia?.toUpperCase().includes("VACACION")) ||
					(tipoFilter === "MEDICO" &&
						(a.TipoAusencia?.toUpperCase().includes("MEDICO") ||
							a.TipoAusencia?.toUpperCase().includes("MÉDICO"))) ||
					(tipoFilter === "PERSONAL" &&
						a.TipoAusencia?.toUpperCase().includes("PERSONAL")) ||
					(tipoFilter === "CAPACITACION" &&
						a.TipoAusencia?.toUpperCase().includes("CAPACITACION")),
			);
		}

		// Filtro por fecha
		if (fechaInicio) {
			filtered = filtered.filter(
				(a) =>
					a.FechaAusencia && new Date(a.FechaAusencia) >= new Date(fechaInicio),
			);
		}

		if (fechaFin) {
			filtered = filtered.filter(
				(a) =>
					a.FechaAusencia && new Date(a.FechaAusencia) <= new Date(fechaFin),
			);
		}

		setFilteredAbsences(filtered);
		setCurrentPage(1);
	}, [absences, estadoFilter, tipoFilter, fechaInicio, fechaFin]);

	// Paginación
	const totalPages = Math.ceil(filteredAbsences.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentAbsences = filteredAbsences.slice(startIndex, endIndex);

	// Estadísticas
	const totalDiasTomados = absences
		.filter((a) => a.EstadoAprobacion === "APROBADO")
		.reduce((acc, a) => acc + (a.TotalHoras ? a.TotalHoras / 8 : 0), 0);

	const pendientesCount = absences.filter(
		(a) => a.EstadoAprobacion === "PENDIENTE",
	).length;

	const saldoVacacional = 30 - totalDiasTomados; // Asumiendo 30 días anuales

	const ausenciasMedicas = absences.filter(
		(a) =>
			a.EstadoAprobacion === "APROBADO" &&
			(a.TipoAusencia?.includes("MEDICO") ||
				a.TipoAusencia?.includes("MÉDICO")),
	).length;

	const getTipoLabel = (tipo: string | null) => {
		if (!tipo) return "N/A";
		return tipo.toLowerCase().replace("_", " ");
	};

	const getEstadoBadgeVariant = (estado: string | null) => {
		switch (estado?.toUpperCase()) {
			case "APROBADO":
				return "success" as const;
			case "RECHAZADO":
				return "destructive" as const;
			case "PENDIENTE":
				return "warning" as const;
			default:
				return "secondary" as const;
		}
	};

	const getIconForTipo = (tipo: string | null) => {
		if (!tipo) return "📄";
		const tipoUpper = tipo.toUpperCase();
		if (tipoUpper.includes("VACACION")) return "🏖️";
		if (tipoUpper.includes("MEDIC")) return "🏥";
		if (tipoUpper.includes("PERSONAL")) return "👤";
		if (tipoUpper.includes("CAPACITACION")) return "📚";
		return "📄";
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
				<div>
					<div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
						<span>Portal</span>
						<ChevronRight className="h-3 w-3" />
						<span className="text-primary">Historial de Ausencias</span>
					</div>
					<h1 className="text-4xl font-extrabold tracking-tight">
						Historial de Ausencias
					</h1>
					<p className="text-muted-foreground mt-2 max-w-2xl">
						Visualice y gestione el registro histórico de sus solicitudes de
						ausencia, permisos y vacaciones académicas.
					</p>
				</div>
				<div className="flex items-center gap-3">
					<Button variant="outline" className="gap-2">
						<Download className="h-4 w-4" />
						Exportar Reporte
					</Button>
					<Button asChild className="gap-2">
						<Link to="/_auth/app/employee/absences/new">
							<Plus className="h-4 w-4" />
							Nueva Solicitud
						</Link>
					</Button>
				</div>
			</div>

			{/* Dashboard Insights (Bento Grid) */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card className="border-b-4 border-b-primary">
					<CardHeader className="pb-4">
						<CardDescription className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
							Total Días Tomados
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex items-end justify-between">
							<span className="text-3xl font-extrabold text-primary">
								{totalDiasTomados.toFixed(0)}
							</span>
							<Badge variant="secondary" className="bg-primary/10 text-primary">
								+2 este mes
							</Badge>
						</div>
					</CardContent>
				</Card>

				<Card className="border-b-4 border-b-blue-500">
					<CardHeader className="pb-4">
						<CardDescription className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
							Pendientes
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex items-end justify-between">
							<span className="text-3xl font-extrabold text-primary">
								{pendientesCount.toString().padStart(2, "0")}
							</span>
							<Clock className="h-5 w-5 text-muted-foreground" />
						</div>
					</CardContent>
				</Card>

				<Card className="border-b-4 border-b-green-500">
					<CardHeader className="pb-4">
						<CardDescription className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
							Saldo Vacacional
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex items-end justify-between">
							<span className="text-3xl font-extrabold text-primary">
								{Math.max(0, saldoVacacional).toFixed(0)}
							</span>
							<Badge variant="outline">Días hábiles</Badge>
						</div>
					</CardContent>
				</Card>

				<Card className="border-b-4 border-b-destructive">
					<CardHeader className="pb-4">
						<CardDescription className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
							Ausencias Médicas
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex items-end justify-between">
							<span className="text-3xl font-extrabold text-primary">
								{ausenciasMedicas.toString().padStart(2, "0")}
							</span>
							<Info className="h-5 w-5 text-destructive" />
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Filtros */}
			<Card>
				<CardContent>
					<div className="flex flex-wrap items-end gap-4">
						<div className="flex-1 min-w-[200px] space-y-2">
							<label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
								Estado
							</label>
							<Select value={estadoFilter} onValueChange={setEstadoFilter}>
								<SelectTrigger>
									<SelectValue placeholder="Seleccionar estado" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="todos">Todos los estados</SelectItem>
									<SelectItem value="APROBADO">Aprobado</SelectItem>
									<SelectItem value="PENDIENTE">Pendiente</SelectItem>
									<SelectItem value="RECHAZADO">Rechazado</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="flex-1 min-w-[200px] space-y-2">
							<label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
								Tipo de Ausencia
							</label>
							<Select value={tipoFilter} onValueChange={setTipoFilter}>
								<SelectTrigger>
									<SelectValue placeholder="Seleccionar tipo" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="todos">Todos los tipos</SelectItem>
									<SelectItem value="VACACIONES">Vacaciones</SelectItem>
									<SelectItem value="MEDICO">Permiso Médico</SelectItem>
									<SelectItem value="PERSONAL">Diligencia Personal</SelectItem>
									<SelectItem value="CAPACITACION">Capacitación</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="flex-1 min-w-[200px] space-y-2">
							<label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
								Rango de Fecha
							</label>
							<div className="flex items-center gap-2">
								<Input
									type="date"
									value={fechaInicio}
									onChange={(e) => setFechaInicio(e.target.value)}
									className="flex-1"
								/>
								<span className="text-muted-foreground">-</span>
								<Input
									type="date"
									value={fechaFin}
									onChange={(e) => setFechaFin(e.target.value)}
									className="flex-1"
								/>
							</div>
						</div>

						<Button
							variant="outline"
							size="icon"
							onClick={() => {
								setEstadoFilter("todos");
								setTipoFilter("todos");
								setFechaInicio("");
								setFechaFin("");
							}}
						>
							<Filter className="h-4 w-4" />
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Tabla de Datos */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Calendar className="h-5 w-5" />
						Historial de Ausencias
					</CardTitle>
					<CardDescription>
						{filteredAbsences.length} de {absences.length} registros mostrados
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="text-center py-8 text-muted-foreground">
							Cargando ausencias...
						</div>
					) : filteredAbsences.length === 0 ? (
						<div className="text-center py-12">
							<FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
							<p className="text-muted-foreground mb-4">
								No se encontraron solicitudes de ausencia.
							</p>
							<Button asChild>
								<Link to="/_auth/app/employee/absences/new">
									<Plus className="h-4 w-4 mr-2" />
									Crear primera solicitud
								</Link>
							</Button>
						</div>
					) : (
						<>
							<Table>
								<TableHeader>
									<TableRow className="bg-muted/50">
										<TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
											Fecha Solicitud
										</TableHead>
										<TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
											Fecha Ausencia
										</TableHead>
										<TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
											Tipo
										</TableHead>
										<TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
											Horas
										</TableHead>
										<TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
											Estado
										</TableHead>
										<TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
											Aprobador
										</TableHead>
										<TableHead className="text-right text-xs font-bold text-muted-foreground uppercase tracking-widest">
											Acciones
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{currentAbsences.map((ausencia) => (
										<TableRow key={ausencia.IdAusencia} className="group">
											<TableCell className="text-muted-foreground">
												{ausencia.FechaSolicitud
													? format(
															new Date(ausencia.FechaSolicitud),
															"dd MMM, yyyy",
															{
																locale: es,
															},
														)
													: "N/A"}
											</TableCell>
											<TableCell className="font-semibold text-primary">
												{ausencia.FechaAusencia
													? format(
															new Date(ausencia.FechaAusencia),
															"dd MMM, yyyy",
															{
																locale: es,
															},
														)
													: "N/A"}
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													<span className="text-lg">
														{getIconForTipo(ausencia.TipoAusencia)}
													</span>
													<span className="text-sm font-medium">
														{getTipoLabel(ausencia.TipoAusencia)}
													</span>
												</div>
											</TableCell>
											<TableCell>
												{ausencia.TotalHoras
													? `${ausencia.TotalHoras.toFixed(0)} hrs`
													: "N/A"}
											</TableCell>
											<TableCell>
												<StatusBadge
													variant={getEstadoBadgeVariant(
														ausencia.EstadoAprobacion,
													)}
												>
													{ausencia.EstadoAprobacion?.toLowerCase() || "N/A"}
												</StatusBadge>
											</TableCell>
											<TableCell>
												{ausencia.IdAprobador ? (
													ausencia.aprobador?.NombreCompleto || (
														<span className="text-muted-foreground italic">
															En revisión
														</span>
													)
												) : (
													<span className="text-muted-foreground italic">
														En revisión
													</span>
												)}
											</TableCell>
											<TableCell className="text-right">
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															variant="ghost"
															size="icon"
															className="opacity-0 group-hover:opacity-100 transition-opacity"
														>
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuItem>
															<Eye className="h-4 w-4 mr-2" />
															Ver Detalles
														</DropdownMenuItem>
														{ausencia.EstadoAprobacion === "APROBADO" && (
															<DropdownMenuItem>
																<Download className="h-4 w-4 mr-2" />
																Descargar Comprobante
															</DropdownMenuItem>
														)}
														{ausencia.EstadoAprobacion === "PENDIENTE" && (
															<DropdownMenuItem>
																<FileText className="h-4 w-4 mr-2" />
																Editar Solicitud
															</DropdownMenuItem>
														)}
														{ausencia.EstadoAprobacion === "RECHAZADO" &&
															ausencia.MotivoRechazo && (
																<DropdownMenuItem>
																	<Info className="h-4 w-4 mr-2" />
																	Ver Motivo
																</DropdownMenuItem>
															)}
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>

							{/* Paginación */}
							{totalPages > 1 && (
								<div className="flex items-center justify-between pt-4">
									<span className="text-sm text-muted-foreground">
										Mostrando {currentAbsences.length} de{" "}
										{filteredAbsences.length} registros
									</span>
									<div className="flex items-center gap-1">
										<Button
											variant="outline"
											size="icon"
											onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
											disabled={currentPage === 1}
										>
											<ChevronLeft className="h-4 w-4" />
										</Button>
										{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
											let pageNum = i + 1;
											if (totalPages > 5) {
												if (currentPage > 3) {
													pageNum = currentPage - 3 + i;
												}
												if (pageNum > totalPages) {
													pageNum = totalPages - 4 + i;
												}
											}
											return (
												<Button
													key={pageNum}
													variant={
														currentPage === pageNum ? "default" : "outline"
													}
													size="icon"
													className="w-8 h-8 text-xs"
													onClick={() => setCurrentPage(pageNum)}
												>
													{pageNum}
												</Button>
											);
										})}
										<Button
											variant="outline"
											size="icon"
											onClick={() =>
												setCurrentPage((p) => Math.min(totalPages, p + 1))
											}
											disabled={currentPage === totalPages}
										>
											<ChevronRight className="h-4 w-4" />
										</Button>
									</div>
								</div>
							)}
						</>
					)}
				</CardContent>
			</Card>

			{/* Contextual Information Card */}
			<Card className="bg-gradient-to-br from-primary to-primary-foreground text-primary-foreground relative overflow-hidden shadow-xl">
				<CardContent className="relative z-10">
					<div className="flex flex-col md:flex-row items-center gap-6">
						<div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
							<Info className="h-8 w-8" />
						</div>
						<div className="flex-1">
							<h3 className="text-xl font-bold mb-2">
								¿Necesitas ayuda con tu solicitud?
							</h3>
							<p className="text-primary-foreground/80 text-sm leading-relaxed">
								Recuerda que las ausencias por vacaciones deben solicitarse con
								al menos 15 días de antelación. Para permisos médicos, puedes
								adjuntar el certificado en formato PDF directamente en la
								sección de detalles.
							</p>
						</div>
						<Button variant="secondary" className="shrink-0 shadow-lg" asChild>
							<Link to="/_auth/app/profile">Centro de Ayuda</Link>
						</Button>
					</div>
				</CardContent>
				<div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
			</Card>
		</div>
	);
}
