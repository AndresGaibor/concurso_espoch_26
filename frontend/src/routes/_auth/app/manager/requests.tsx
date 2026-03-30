// Página de solicitudes de ausencia para el manager
import { createFileRoute, Link, useParams, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "#/features/auth";
import { useAbsence } from "#/features/attendance/hooks/useAttendance";
import { 
	ArrowLeft, 
	Calendar, 
	Clock, 
	FileText, 
	CheckCircle, 
	XCircle, 
	AlertCircle,
	User
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { StatusBadge } from "@/components/custom/StatusBadge";
import { Textarea } from "@/components/ui/textarea";
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

export const Route = createFileRoute("/_auth/app/manager/requests")({
	component: ManagerRequestsPage,
});

function ManagerRequestsPage() {
	const { usuarioApp } = useAuth();
	const { getPendingAbsencesForManager, updateAbsenceStatus, isLoading } = useAbsence();
	const [absences, setAbsences] = useState<any[]>([]);
	const [selectedAbsence, setSelectedAbsence] = useState<any>(null);
	const [showApproveDialog, setShowApproveDialog] = useState(false);
	const [showRejectDialog, setShowRejectDialog] = useState(false);
	const [rejectionReason, setRejectionReason] = useState("");
	const [isProcessing, setIsProcessing] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		if (!usuarioApp) return;

		const loadAbsences = async () => {
			const data = await getPendingAbsencesForManager(usuarioApp.IdUsuario);
			setAbsences(data);
		};

		loadAbsences();
	}, [usuarioApp, getPendingAbsencesForManager]);

	const handleApprove = async () => {
		if (!selectedAbsence || !usuarioApp) return;

		setIsProcessing(true);
		const result = await updateAbsenceStatus(selectedAbsence.IdAusencia, "APROBADO");
		setIsProcessing(false);

		if (result) {
			setAbsences((prev) => prev.filter((a) => a.IdAusencia !== selectedAbsence.IdAusencia));
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
			rejectionReason
		);
		setIsProcessing(false);

		if (result) {
			setAbsences((prev) => prev.filter((a) => a.IdAusencia !== selectedAbsence.IdAusencia));
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

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="icon" asChild>
					<Link to="/_auth/app/manager">
						<ArrowLeft className="h-5 w-5" />
					</Link>
				</Button>
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Solicitudes de Ausencia</h1>
					<p className="text-muted-foreground">
						Revisa y gestiona las solicitudes de tu equipo
					</p>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<FileText className="h-5 w-5" />
						Solicitudes Pendientes
					</CardTitle>
					<CardDescription>
						{absences.length} {absences.length === 1 ? "solicitud" : "solicitudes"} esperando aprobación
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="text-center py-8 text-muted-foreground">
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
						<div className="space-y-4">
							{absences.map((ausencia) => (
								<Card key={ausencia.IdAusencia}>
									<CardHeader>
										<div className="flex items-start justify-between">
											<div className="flex items-center gap-3">
												<div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
													<User className="h-5 w-5 text-primary" />
												</div>
												<div>
													<CardTitle className="flex items-center gap-2">
														{ausencia.USUARIOS?.NombreCompleto || "Empleado"}
													</CardTitle>
													<CardDescription className="flex items-center gap-1">
														{ausencia.USUARIOS?.CorreoInstitucional || ""}
													</CardDescription>
												</div>
											</div>
											<StatusBadge variant="warning">Pendiente</StatusBadge>
										</div>
									</CardHeader>
									<CardContent>
										<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
											<div>
												<p className="text-sm text-muted-foreground flex items-center gap-1">
													<Calendar className="h-4 w-4" />
													Fecha de Ausencia
												</p>
												<p className="font-medium">
													{ausencia.FechaAusencia
														? format(new Date(ausencia.FechaAusencia), "PPP", { locale: es })
														: "N/A"}
												</p>
											</div>
											<div>
												<p className="text-sm text-muted-foreground flex items-center gap-1">
													<Clock className="h-4 w-4" />
													Horario
												</p>
												<p className="font-medium">
													{ausencia.HoraInicio || "N/A"} - {ausencia.HoraFin || "N/A"}
												</p>
												<p className="text-xs text-muted-foreground">
													{ausencia.TotalHoras ? `${ausencia.TotalHoras.toFixed(2)} horas` : ""}
												</p>
											</div>
											<div>
												<p className="text-sm text-muted-foreground">Tipo</p>
												<p className="font-medium capitalize">
													{ausencia.TipoAusencia?.toLowerCase().replace("_", " ") || "N/A"}
												</p>
											</div>
										</div>

										{ausencia.Motivo && (
											<div className="p-3 bg-muted rounded-md mb-4">
												<p className="text-sm font-medium mb-1">Motivo de la ausencia</p>
												<p className="text-sm">{ausencia.Motivo}</p>
											</div>
										)}

										<div className="flex gap-2">
											<Button
												onClick={() => openApproveDialog(ausencia)}
												className="gap-2 bg-green-600 hover:bg-green-700"
											>
												<CheckCircle className="h-4 w-4" />
												Aprobar
											</Button>
											<Button
												onClick={() => openRejectDialog(ausencia)}
												variant="outline"
												className="gap-2 text-destructive hover:text-destructive"
											>
												<XCircle className="h-4 w-4" />
												Rechazar
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</CardContent>
			</Card>

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
										{selectedAbsence.TipoAusencia?.toLowerCase().replace("_", " ")} -{" "}
										{selectedAbsence.FechaAusencia
											? format(new Date(selectedAbsence.FechaAusencia), "PPP", { locale: es })
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
							¿Estás seguro de que deseas rechazar esta solicitud? Esta acción no se puede deshacer.
							{selectedAbsence && (
								<div className="mt-3 p-3 bg-muted rounded-md">
									<p className="text-sm font-medium">
										{selectedAbsence.USUARIOS?.NombreCompleto}
									</p>
									<p className="text-sm">
										{selectedAbsence.TipoAusencia?.toLowerCase().replace("_", " ")} -{" "}
										{selectedAbsence.FechaAusencia
											? format(new Date(selectedAbsence.FechaAusencia), "PPP", { locale: es })
											: "N/A"}
									</p>
								</div>
							)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<div className="space-y-2">
						<label className="text-sm font-medium" htmlFor="reason">
							Motivo del rechazo (opcional)
						</label>
						<Textarea
							id="reason"
							value={rejectionReason}
							onChange={(e) => setRejectionReason(e.target.value)}
							placeholder="Explica el motivo del rechazo..."
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
