// Página de solicitudes de ausencia para el manager - Revisión de Ausencias
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
	CheckCircle,
	Clock,
	Download,
	FileText,
	Filter,
	Sparkles,
	User,
	XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAbsence } from "#/features/attendance/hooks/useAttendance";
import { useAuth } from "#/features/auth";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_auth/app/manager/requests")({
	component: ManagerRequestsPage,
});

function ManagerRequestsPage() {
	const { usuarioApp } = useAuth();
	const { getPendingAbsencesForManager, updateAbsenceStatus, isLoading } =
		useAbsence();
	const [absences, setAbsences] = useState<any[]>([]);
	const [selectedAbsence, setSelectedAbsence] = useState<any>(null);
	const [showApproveDialog, setShowApproveDialog] = useState(false);
	const [showRejectDialog, setShowRejectDialog] = useState(false);
	const [rejectionReason, setRejectionReason] = useState("");
	const [isProcessing, setIsProcessing] = useState(false);
	const [stats, setStats] = useState({
		pending: 0,
		approvedToday: 0,
		rejectedToday: 0,
	});

	useEffect(() => {
		if (!usuarioApp) return;

		const loadAbsences = async () => {
			const data = await getPendingAbsencesForManager(usuarioApp.IdUsuario);
			setAbsences(data);
			setStats((prev) => ({
				...prev,
				pending: data.length,
			}));
		};

		loadAbsences();
	}, [usuarioApp, getPendingAbsencesForManager]);

	const handleApprove = async () => {
		if (!selectedAbsence || !usuarioApp) return;

		setIsProcessing(true);
		const result = await updateAbsenceStatus(
			selectedAbsence.IdAusencia,
			"APROBADO",
		);
		setIsProcessing(false);

		if (result) {
			setAbsences((prev) =>
				prev.filter((a) => a.IdAusencia !== selectedAbsence.IdAusencia),
			);
			setStats((prev) => ({
				...prev,
				pending: prev.pending - 1,
				approvedToday: prev.approvedToday + 1,
			}));
			setSelectedAbsence(null);
			setShowApproveDialog(false);
		}
	};

	const handleReject = async () => {
		if (!selectedAbsence || !usuarioApp) return;

		setIsProcessing(true);
		const result = await updateAbsenceStatus(
			selectedAbsence.IdAusencia,
			"RECHAZADO",
			rejectionReason,
		);
		setIsProcessing(false);

		if (result) {
			setAbsences((prev) =>
				prev.filter((a) => a.IdAusencia !== selectedAbsence.IdAusencia),
			);
			setStats((prev) => ({
				...prev,
				pending: prev.pending - 1,
				rejectedToday: prev.rejectedToday + 1,
			}));
			setSelectedAbsence(null);
			setShowRejectDialog(false);
			setRejectionReason("");
		}
	};

	const openApproveDialog = (ausencia: any) => {
		setSelectedAbsence(ausencia);
		setShowApproveDialog(true);
	};

	const openRejectDialog = (ausencia: any) => {
		setSelectedAbsence(ausencia);
		setShowRejectDialog(true);
	};

	const getDurationLabel = (horas: number) => {
		if (horas >= 8) return `${horas.toFixed(0)} h (1 día)`;
		if (horas >= 4) return `${horas.toFixed(0)} h (Media Jornada)`;
		return `${horas.toFixed(0)} h`;
	};

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex flex-col gap-2">
				<span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
					Gestión de Talento
				</span>
				<div className="flex justify-between items-end">
					<div className="space-y-1">
						<h1 className="font-headline text-3xl font-extrabold text-primary tracking-tight">
							Revisión de Ausencias
						</h1>
						<p className="text-sm text-muted-foreground max-w-xl">
							Supervise y gestione las solicitudes de tiempo libre de su equipo
							directo con precisión académica.
						</p>
					</div>
					<div className="flex gap-2">
						<Button variant="outline" className="gap-2">
							<Filter className="h-4 w-4" />
							Filtros
						</Button>
						<Button className="gap-2 bg-primary hover:bg-primary/90">
							<Download className="h-4 w-4" />
							Reporte Diario
						</Button>
					</div>
				</div>
			</div>

			{/* Summary Widgets - Bento Grid */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{/* Pending Widget */}
				<Card className="bg-primary text-white relative overflow-hidden">
					<CardContent className="p-6">
						<div className="relative z-10">
							<p className="text-primary-foreground/70 text-xs font-bold tracking-widest uppercase mb-1">
								Total Pendiente
							</p>
							<h3 className="text-white text-4xl font-extrabold">
								{String(stats.pending).padStart(2, "0")}
							</h3>
						</div>
						<div className="mt-4 flex items-center gap-2 text-primary-foreground text-xs">
							<Clock className="h-4 w-4" />
							Requiere acción inmediata
						</div>
						<div className="absolute right-[-20px] bottom-[-20px] opacity-10">
							<FileText className="h-24 w-24" />
						</div>
					</CardContent>
				</Card>

				{/* Approved Today */}
				<Card className="border-outline-variant/15">
					<CardContent className="p-6">
						<div>
							<p className="text-muted-foreground text-xs font-bold tracking-widest uppercase mb-1">
								Aprobado Hoy
							</p>
							<h3 className="text-primary text-4xl font-extrabold">
								{String(stats.approvedToday).padStart(2, "0")}
							</h3>
						</div>
						<div className="mt-4 flex items-center gap-2 text-xs">
							<div className="w-2 h-2 rounded-full bg-primary" />
							<span>Flujo de trabajo estable</span>
						</div>
					</CardContent>
				</Card>

				{/* Rejected Today */}
				<Card className="border-outline-variant/15">
					<CardContent className="p-6">
						<div>
							<p className="text-muted-foreground text-xs font-bold tracking-widest uppercase mb-1">
								Rechazado Hoy
							</p>
							<h3 className="text-primary text-4xl font-extrabold">
								{String(stats.rejectedToday).padStart(2, "0")}
							</h3>
						</div>
						<div className="mt-4 flex items-center gap-2 text-destructive text-xs">
							<XCircle className="h-4 w-4" />
							Fuera de política institucional
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Requests List Section */}
			<Card>
				<CardHeader className="border-b border-border pb-4">
					<div className="flex items-center justify-between">
						<CardTitle className="flex items-center gap-2">
							<FileText className="h-5 w-5" />
							Solicitudes Entrantes
						</CardTitle>
						<div className="flex items-center gap-2 text-xs text-muted-foreground">
							<div className="w-2 h-2 rounded-full bg-green-500" />
							Actualizado hace 2 minutos
						</div>
					</div>
				</CardHeader>
				<CardContent className="p-0">
					{isLoading ? (
						<div className="text-center py-12 text-muted-foreground">
							Cargando solicitudes...
						</div>
					) : absences.length === 0 ? (
						<div className="text-center py-12">
							<CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50 text-green-600" />
							<p className="text-muted-foreground mb-4">
								¡No hay solicitudes pendientes!
							</p>
							<p className="text-sm text-muted-foreground">
								Todas las solicitudes han sido revisadas.
							</p>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow className="hover:bg-transparent border-0">
									<TableHead className="w-[25%]">Colaborador</TableHead>
									<TableHead className="w-[15%]">Fecha</TableHead>
									<TableHead className="w-[15%]">Duración</TableHead>
									<TableHead className="w-[30%]">Motivo</TableHead>
									<TableHead className="w-[15%] text-right">Acciones</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{absences.map((ausencia) => (
									<TableRow
										key={ausencia.IdAusencia}
										className="group hover:bg-accent/50 transition-all duration-300"
									>
										<TableCell>
											<div className="flex items-center gap-3">
												<Avatar className="h-12 w-12 border-2 border-border">
													<AvatarImage
														src={
															ausencia.USUARIOS?.FotoPerfil ||
															`https://ui-avatars.com/api/?name=${encodeURIComponent(ausencia.USUARIOS?.NombreCompleto || "E")}&background=0D8ABC&color=fff`
														}
														alt={
															ausencia.USUARIOS?.NombreCompleto || "Colaborador"
														}
													/>
													<AvatarFallback>
														<User className="h-6 w-6" />
													</AvatarFallback>
												</Avatar>
												<div>
													<p className="font-semibold text-sm">
														{ausencia.USUARIOS?.NombreCompleto || "Empleado"}
													</p>
													<p className="text-xs text-muted-foreground">
														{ausencia.USUARIOS?.Departamento || "Departamento"}
													</p>
												</div>
											</div>
										</TableCell>
										<TableCell>
											<div>
												<p className="text-xs font-bold text-muted-foreground uppercase tracking-tight mb-1">
													Fecha
												</p>
												<p className="text-sm font-medium">
													{ausencia.FechaAusencia
														? format(
																new Date(ausencia.FechaAusencia),
																"dd MMM, yyyy",
																{
																	locale: es,
																},
															)
														: "N/A"}
												</p>
											</div>
										</TableCell>
										<TableCell>
											<div>
												<p className="text-xs font-bold text-muted-foreground uppercase tracking-tight mb-1">
													Duración
												</p>
												<p className="text-sm font-medium">
													{getDurationLabel(ausencia.TotalHoras || 8)}
												</p>
											</div>
										</TableCell>
										<TableCell>
											<div>
												<p className="text-xs font-bold text-muted-foreground uppercase tracking-tight mb-1">
													Motivo
												</p>
												<p className="text-sm text-muted-foreground line-clamp-1 max-w-md">
													{ausencia.Motivo || "Sin motivo especificado"}
												</p>
											</div>
										</TableCell>
										<TableCell>
											<div className="flex justify-end gap-2">
												<Button
													variant="ghost"
													size="icon"
													onClick={() => openRejectDialog(ausencia)}
													className="text-destructive hover:bg-destructive/10 hover:text-destructive"
												>
													<XCircle className="h-5 w-5" />
												</Button>
												<Button
													onClick={() => openApproveDialog(ausencia)}
													className="bg-primary-fixed text-primary hover:bg-primary hover:text-white transition-all"
												>
													Aprobar
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>

			{/* Insights & Capacity */}
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
				<Card className="lg:col-span-3 border-outline-variant/10">
					<CardContent className="p-6 space-y-4">
						<div className="flex items-center justify-between">
							<div>
								<h4 className="font-semibold text-primary">
									Capacidad del Equipo
								</h4>
								<p className="text-xs text-muted-foreground">
									Disponibilidad proyectada para la semana actual
								</p>
							</div>
							<Badge
								variant="secondary"
								className="uppercase tracking-widest text-xs"
							>
								Optimizado
							</Badge>
						</div>
						<div className="flex gap-2 h-24 items-end">
							{[
								{ day: "LUN", value: 90 },
								{ day: "MAR", value: 85 },
								{ day: "MIE", value: 60, critical: true },
								{ day: "JUE", value: 95 },
								{ day: "VIE", value: 92 },
							].map((day) => (
								<div
									key={day.day}
									className="flex-1 bg-muted rounded-t-lg relative group"
								>
									<div
										className={`absolute bottom-0 w-full rounded-t-lg transition-all duration-700 ${day.critical ? "bg-destructive" : "bg-primary"}`}
										style={{ height: `${day.value}%` }}
									/>
									<p
										className={`absolute -bottom-6 w-full text-center text-[10px] font-bold ${day.critical ? "text-destructive" : "text-muted-foreground"}`}
									>
										{day.day}
									</p>
									{day.critical && (
										<div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
											Capacidad Crítica ({day.value}%)
										</div>
									)}
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				<Card className="bg-primary text-white flex flex-col justify-center items-center text-center space-y-3">
					<CardContent className="p-6">
						<div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mx-auto">
							<Sparkles className="h-8 w-8 text-white" />
						</div>
						<div>
							<h4 className="font-bold text-lg">Smart Filter</h4>
							<p className="text-white/70 text-xs mt-1">
								Sugerir aprobación automática según KPI de asistencia.
							</p>
						</div>
						<Button
							variant="secondary"
							size="sm"
							className="mt-2 rounded-full hover:scale-105 transition-transform"
						>
							Configurar Reglas
						</Button>
					</CardContent>
				</Card>
			</div>

			{/* Diálogo de Aprobación */}
			<AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className="flex items-center gap-2 text-green-600">
							<CheckCircle className="h-5 w-5" />
							Aprobar Solicitud
						</AlertDialogTitle>
						<AlertDialogDescription>
							¿Estás seguro de que deseas aprobar esta solicitud de ausencia?
							{selectedAbsence && (
								<div className="mt-3 p-3 bg-muted rounded-md">
									<p className="text-sm font-medium">
										{selectedAbsence.USUARIOS?.NombreCompleto}
									</p>
									<p className="text-sm">
										{selectedAbsence.TipoAusencia?.toLowerCase().replace(
											"_",
											" ",
										)}{" "}
										-{" "}
										{selectedAbsence.FechaAusencia
											? format(new Date(selectedAbsence.FechaAusencia), "PPP", {
													locale: es,
												})
											: "N/A"}
									</p>
								</div>
							)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancelar</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleApprove}
							disabled={isProcessing}
							className="bg-green-600 hover:bg-green-700"
						>
							{isProcessing ? "Procesando..." : "Confirmar Aprobación"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Diálogo de Rechazo */}
			<AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className="flex items-center gap-2 text-destructive">
							<XCircle className="h-5 w-5" />
							Rechazar Solicitud
						</AlertDialogTitle>
						<AlertDialogDescription>
							¿Estás seguro de que deseas rechazar esta solicitud? Esta acción
							no se puede deshacer.
							{selectedAbsence && (
								<div className="mt-3 p-3 bg-muted rounded-md">
									<p className="text-sm font-medium">
										{selectedAbsence.USUARIOS?.NombreCompleto}
									</p>
									<p className="text-sm">
										{selectedAbsence.TipoAusencia?.toLowerCase().replace(
											"_",
											" ",
										)}{" "}
										-{" "}
										{selectedAbsence.FechaAusencia
											? format(new Date(selectedAbsence.FechaAusencia), "PPP", {
													locale: es,
												})
											: "N/A"}
									</p>
								</div>
							)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<div className="space-y-2">
						<label className="text-sm font-medium" htmlFor="reason">
							Motivo del rechazo <span className="text-destructive">*</span>
						</label>
						<Textarea
							id="reason"
							value={rejectionReason}
							onChange={(e) => setRejectionReason(e.target.value)}
							placeholder="Ej: Se requiere presencia por cierre de semestre..."
							className="min-h-[80px]"
						/>
					</div>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancelar</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleReject}
							disabled={isProcessing}
							className="bg-destructive hover:bg-destructive/90"
						>
							{isProcessing ? "Procesando..." : "Confirmar Rechazo"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
