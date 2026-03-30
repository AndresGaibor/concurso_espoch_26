// Historial de asistencias del empleado
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "#/features/auth";
import { useAttendance } from "#/features/attendance/hooks/useAttendance";
import { Clock, MapPin, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { StatusBadge } from "@/components/custom/StatusBadge";

export const Route = createFileRoute("/_auth/app/employee/history")({
	component: EmployeeHistoryPage,
});

function EmployeeHistoryPage() {
	const { usuarioApp } = useAuth();
	const { getUserAttendances, isLoading } = useAttendance();
	const [attendances, setAttendances] = useState<any[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	useEffect(() => {
		if (!usuarioApp) return;

		const loadAttendances = async () => {
			const data = await getUserAttendances(usuarioApp.IdUsuario, 200);
			setAttendances(data);
		};

		loadAttendances();
	}, [usuarioApp, getUserAttendances]);

	// Paginación
	const totalPages = Math.ceil(attendances.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentAttendances = attendances.slice(startIndex, endIndex);

	// Agrupar por mes
	const groupedByMonth = currentAttendances.reduce((acc, attendance) => {
		if (!attendance.FechaHora) return acc;
		const monthKey = format(new Date(attendance.FechaHora), "yyyy-MM");
		if (!acc[monthKey]) acc[monthKey] = [];
		acc[monthKey].push(attendance);
		return acc;
	}, {} as Record<string, any[]>);

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Historial de Asistencias</h1>
				<p className="text-muted-foreground">
					Consulta todos tus registros de entrada y salida
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Calendar className="h-5 w-5" />
						Mis Registros
					</CardTitle>
					<CardDescription>
						{attendances.length} registros encontrados
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="text-center py-8 text-muted-foreground">
							Cargando registros...
						</div>
					) : attendances.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							<Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
							<p>No tienes registros de asistencia aún.</p>
						</div>
					) : (
						<div className="space-y-6">
							{Object.entries(groupedByMonth).map(([monthKey, monthAttendances]) => (
								<div key={monthKey}>
									<h3 className="text-lg font-semibold mb-3 capitalize">
										{format(new Date(monthKey + "-01"), "MMMM yyyy", { locale: es })}
									</h3>
									<div className="rounded-md border">
										<div className="grid grid-cols-5 gap-4 p-3 bg-muted font-medium text-sm">
											<div>Fecha</div>
											<div>Tipo</div>
											<div>Hora</div>
											<div>Modalidad</div>
											<div>Estado</div>
										</div>
										<div className="divide-y">
											{monthAttendances.map((asistencia: any, idx: number) => (
												<div
													key={idx}
													className="grid grid-cols-5 gap-4 p-3 text-sm hover:bg-muted/50"
												>
													<div className="flex items-center gap-2">
														<Calendar className="h-4 w-4 text-muted-foreground" />
														{format(new Date(asistencia.FechaHora!), "dd/MM/yyyy")}
													</div>
													<div>
														<StatusBadge
															variant={
																asistencia.Tipo === "ENTRADA" ? "success" : "warning"
															}
														>
															{asistencia.Tipo === "ENTRADA" ? "Entrada" : "Salida"}
														</StatusBadge>
													</div>
													<div className="flex items-center gap-2">
														<Clock className="h-4 w-4 text-muted-foreground" />
														{format(new Date(asistencia.FechaHora!), "HH:mm:ss")}
													</div>
													<div className="capitalize">
														{asistencia.Modalidad?.toLowerCase() || "N/A"}
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
																{asistencia.EstadoPuntualidad.toLowerCase().replace("_", " ")}
															</StatusBadge>
														) : (
															<span className="text-muted-foreground">N/A</span>
														)}
													</div>
												</div>
											))}
										</div>
									</div>
								</div>
							))}
						</div>
					)}

					{/* Paginación */}
					{totalPages > 1 && (
						<div className="flex items-center justify-between pt-4">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
								disabled={currentPage === 1}
							>
								<ChevronLeft className="h-4 w-4 mr-1" />
								Anterior
							</Button>
							<span className="text-sm text-muted-foreground">
								Página {currentPage} de {totalPages}
							</span>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
								disabled={currentPage === totalPages}
							>
								Siguiente
								<ChevronRight className="h-4 w-4 ml-1" />
							</Button>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Estadísticas resumen */}
			<Card>
				<CardHeader>
					<CardTitle>Resumen del Mes Actual</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div className="text-center p-4 bg-muted rounded-lg">
							<p className="text-2xl font-bold">
								{
									attendances.filter(
										(a) =>
											a.Tipo === "ENTRADA" &&
											new Date(a.FechaHora!).getMonth() === new Date().getMonth()
									).length
								}
							</p>
							<p className="text-sm text-muted-foreground">Entradas</p>
						</div>
						<div className="text-center p-4 bg-muted rounded-lg">
							<p className="text-2xl font-bold">
								{
									attendances.filter(
										(a) =>
											a.Tipo === "SALIDA" &&
											new Date(a.FechaHora!).getMonth() === new Date().getMonth()
									).length
								}
							</p>
							<p className="text-sm text-muted-foreground">Salidas</p>
						</div>
						<div className="text-center p-4 bg-muted rounded-lg">
							<p className="text-2xl font-bold text-green-600">
								{
									attendances.filter(
										(a) =>
											a.EstadoPuntualidad === "PUNTUAL" &&
											new Date(a.FechaHora!).getMonth() === new Date().getMonth()
									).length
								}
							</p>
							<p className="text-sm text-muted-foreground">Puntuales</p>
						</div>
						<div className="text-center p-4 bg-muted rounded-lg">
							<p className="text-2xl font-bold text-orange-600">
								{
									attendances.filter(
										(a) =>
											a.EstadoPuntualidad === "TARDANZA" &&
											new Date(a.FechaHora!).getMonth() === new Date().getMonth()
									).length
								}
							</p>
							<p className="text-sm text-muted-foreground">Tardanzas</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
