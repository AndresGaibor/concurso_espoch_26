// Lista de ausencias del empleado
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "#/features/auth";
import { useAbsence } from "#/features/attendance/hooks/useAttendance";
import { Calendar, Clock, FileText, PlusCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { StatusBadge } from "@/components/custom/StatusBadge";

export const Route = createFileRoute("/_auth/app/employee/absences")({
	component: EmployeeAbsencesPage,
});

function EmployeeAbsencesPage() {
	const { usuarioApp } = useAuth();
	const { getUserAbsences, isLoading } = useAbsence();
	const [absences, setAbsences] = useState<any[]>([]);

	useEffect(() => {
		if (!usuarioApp) return;

		const loadAbsences = async () => {
			const data = await getUserAbsences(usuarioApp.IdUsuario);
			setAbsences(data);
		};

		loadAbsences();
	}, [usuarioApp, getUserAbsences]);

	const getEstadoBadgeVariant = (estado: string) => {
		switch (estado.toUpperCase()) {
			case "APROBADO":
				return "success";
			case "RECHAZADO":
				return "destructive";
			case "PENDIENTE":
				return "warning";
			default:
				return "secondary";
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Mis Ausencias</h1>
					<p className="text-muted-foreground">
						Consulta y gestiona tus solicitudes de ausencia
					</p>
				</div>
				<Button asChild className="gap-2">
					<Link to="/_auth/app/employee/absences/new">
						<PlusCircle className="h-5 w-5" />
						Nueva Solicitud
					</Link>
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Calendar className="h-5 w-5" />
						Historial de Ausencias
					</CardTitle>
					<CardDescription>
						{absences.length} solicitudes registradas
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="text-center py-8 text-muted-foreground">
							Cargando ausencias...
						</div>
					) : absences.length === 0 ? (
						<div className="text-center py-12">
							<FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
							<p className="text-muted-foreground mb-4">
								No tienes solicitudes de ausencia registradas.
							</p>
							<Button asChild>
								<Link to="/_auth/app/employee/absences/new">
									<PlusCircle className="h-4 w-4 mr-2" />
									Crear primera solicitud
								</Link>
							</Button>
						</div>
					) : (
						<div className="space-y-4">
							{absences.map((ausencia) => (
								<Card key={ausencia.IdAusencia}>
									<CardHeader>
										<div className="flex items-start justify-between">
											<div>
												<CardTitle className="flex items-center gap-2">
													<Calendar className="h-5 w-5" />
													{ausencia.TipoAusencia
														? ausencia.TipoAusencia.toLowerCase().replace("_", " ")
														: "Ausencia"}
												</CardTitle>
												<CardDescription>
													Solicitado el{" "}
													{ausencia.FechaSolicitud
														? format(new Date(ausencia.FechaSolicitud), "PPP", { locale: es })
														: "N/A"}
												</CardDescription>
											</div>
											<StatusBadge variant={getEstadoBadgeVariant(ausencia.EstadoAprobacion)}>
												{ausencia.EstadoAprobacion?.toLowerCase() || "N/A"}
											</StatusBadge>
										</div>
									</CardHeader>
									<CardContent>
										<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
											<div>
												<p className="text-muted-foreground">Fecha de Ausencia</p>
												<p className="font-medium">
													{ausencia.FechaAusencia
														? format(new Date(ausencia.FechaAusencia), "PPP", { locale: es })
														: "N/A"}
												</p>
											</div>
											<div>
												<p className="text-muted-foreground">Horario</p>
												<div className="flex items-center gap-1">
													<Clock className="h-4 w-4 text-muted-foreground" />
													<span className="font-medium">
														{ausencia.HoraInicio || "N/A"} - {ausencia.HoraFin || "N/A"}
													</span>
												</div>
											</div>
											<div>
												<p className="text-muted-foreground">Duración</p>
												<p className="font-medium">
													{ausencia.TotalHoras ? `${ausencia.TotalHoras.toFixed(2)} horas` : "N/A"}
												</p>
											</div>
											{ausencia.EstadoAprobacion === "RECHAZADO" && ausencia.MotivoRechazo && (
												<div className="col-span-2 md:col-span-4">
													<p className="text-muted-foreground flex items-center gap-1">
														<AlertCircle className="h-4 w-4" />
														Motivo de Rechazo
													</p>
													<p className="font-medium text-destructive">
														{ausencia.MotivoRechazo}
													</p>
												</div>
											)}
										</div>
										{ausencia.Motivo && (
											<div className="mt-4 p-3 bg-muted rounded-md">
												<p className="text-sm text-muted-foreground mb-1">Motivo</p>
												<p className="text-sm">{ausencia.Motivo}</p>
											</div>
										)}
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
