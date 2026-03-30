// Dashboard principal del empleado con registro de asistencia
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "#/features/auth";
import { useAttendance } from "#/features/attendance/hooks/useAttendance";
import { Clock, MapPin, CheckCircle, LogOut, AlertCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const Route = createFileRoute("/_auth/app/employee/")({
	component: EmployeeDashboardPage,
});

function EmployeeDashboardPage() {
	const { usuarioApp } = useAuth();
	const { registerAttendance, getLastAttendance, getUserAttendances, isLoading } = useAttendance();
	const [lastAttendance, setLastAttendance] = useState<any>(null);
	const [todayAttendances, setTodayAttendances] = useState<any[]>([]);
	const [isRegistering, setIsRegistering] = useState(false);
	const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
	const [locationError, setLocationError] = useState<string | null>(null);

	// Obtener ubicación actual
	const getCurrentLocation = useCallback(() => {
		return new Promise<{ lat: number; lng: number; address: string }>((resolve, reject) => {
			if (!navigator.geolocation) {
				reject(new Error("La geolocalización no es soportada por este navegador"));
				return;
			}

			navigator.geolocation.getCurrentPosition(
				async (position) => {
					const { latitude, longitude } = position.coords;
					// Intentar obtener dirección inversa (opcional)
					let address = `Lat: ${latitude.toFixed(6)}, Lon: ${longitude.toFixed(6)}`;
					try {
						const response = await fetch(
							`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
						);
						const data = await response.json();
						if (data.display_name) {
							address = data.display_name;
						}
					} catch {
						// Si falla la geocodificación inversa, usar coordenadas
					}
					resolve({ lat: latitude, lng: longitude, address });
				},
				(error) => {
					reject(new Error(error.message));
				},
				{
					enableHighAccuracy: true,
					timeout: 10000,
					maximumAge: 0,
				}
			);
		});
	}, []);

	// Cargar última asistencia y asistencias de hoy
	useEffect(() => {
		if (!usuarioApp) return;

		const loadData = async () => {
			const [last, today] = await Promise.all([
				getLastAttendance(usuarioApp.IdUsuario),
				getUserAttendances(usuarioApp.IdUsuario, 10),
			]);
			setLastAttendance(last);

			// Filtrar asistencias de hoy
			const todayStr = new Date().toDateString();
			const todayData = today.filter((a: any) => {
				if (!a.FechaHora) return false;
				return new Date(a.FechaHora).toDateString() === todayStr;
			});
			setTodayAttendances(todayData);
		};

		loadData();
	}, [usuarioApp, getLastAttendance, getUserAttendances]);

	// Manejar registro de asistencia
	const handleRegisterAttendance = async (tipo: "ENTRADA" | "SALIDA") => {
		if (!usuarioApp) return;

		setIsRegistering(true);
		setLocationError(null);

		try {
			// Obtener ubicación
			const loc = await getCurrentLocation();
			setLocation(loc);

			// Registrar asistencia
			const result = await registerAttendance({
				IdUsuario: usuarioApp.IdUsuario,
				Tipo: tipo,
				Latitud: loc.lat,
				Longitud: loc.lng,
				Direccion: loc.address,
				Modalidad: "PRESENCIAL",
			});

			if (result) {
				// Recargar datos
				const last = await getLastAttendance(usuarioApp.IdUsuario);
				setLastAttendance(last);

				const today = await getUserAttendances(usuarioApp.IdUsuario, 10);
				const todayStr = new Date().toDateString();
				const todayData = today.filter((a) => {
					if (!a.FechaHora) return false;
					return new Date(a.FechaHora).toDateString() === todayStr;
				});
				setTodayAttendances(todayData);
			}
		} catch (err) {
			setLocationError(err instanceof Error ? err.message : "Error al obtener ubicación");
		} finally {
			setIsRegistering(false);
		}
	};

	// Determinar si puede marcar entrada o salida
	const hasCheckedInToday = todayAttendances.some((a) => a.Tipo === "ENTRADA");
	const hasCheckedOutToday = todayAttendances.some((a) => a.Tipo === "SALIDA");

	const canCheckIn = !hasCheckedInToday;
	const canCheckOut = hasCheckedInToday && !hasCheckedOutToday;

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Panel del Colaborador</h1>
					<p className="text-muted-foreground">
						Gestiona tus asistencias y solicitudes de ausencia
					</p>
				</div>
			</div>

			{/* Tarjeta de registro de asistencia */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Clock className="h-5 w-5" />
						Registro de Asistencia
					</CardTitle>
					<CardDescription>
						Registra tu entrada y salida de manera rápida y segura
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{locationError && (
						<div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md flex items-center gap-2">
							<AlertCircle className="h-4 w-4" />
							{locationError}
						</div>
					)}

					{location && (
						<div className="p-3 text-sm bg-muted rounded-md flex items-start gap-2">
							<MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
							<div>
								<p className="font-medium">Ubicación registrada:</p>
								<p className="text-muted-foreground">{location.address}</p>
							</div>
						</div>
					)}

					<div className="flex flex-wrap gap-3">
						<Button
							onClick={() => handleRegisterAttendance("ENTRADA")}
							disabled={isLoading || isRegistering || !canCheckIn}
							size="lg"
							className="gap-2"
						>
							<CheckCircle className="h-5 w-5" />
							{isRegistering ? "Registrando..." : "Marcar Entrada"}
						</Button>

						<Button
							onClick={() => handleRegisterAttendance("SALIDA")}
							disabled={isLoading || isRegistering || !canCheckOut}
							size="lg"
							variant="outline"
							className="gap-2"
						>
							<LogOut className="h-5 w-5" />
							{isRegistering ? "Registrando..." : "Marcar Salida"}
						</Button>
					</div>

					{!canCheckIn && !canCheckOut && (
						<p className="text-sm text-muted-foreground">
							Ya has registrado tu entrada y salida hoy. Vuelve mañana.
						</p>
					)}
				</CardContent>
			</Card>

			{/* Resumen del día */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Calendar className="h-5 w-5" />
						Resumen de Hoy
					</CardTitle>
					<CardDescription>Tus registros de asistencia del día</CardDescription>
				</CardHeader>
				<CardContent>
					{todayAttendances.length === 0 ? (
						<p className="text-muted-foreground text-sm">No hay registros de asistencia hoy.</p>
					) : (
						<div className="space-y-2">
							{todayAttendances.map((asistencia, idx) => (
								<div
									key={idx}
									className="flex items-center justify-between p-3 bg-muted rounded-md"
								>
									<div className="flex items-center gap-3">
										{asistencia.Tipo === "ENTRADA" ? (
											<CheckCircle className="h-5 w-5 text-green-600" />
										) : (
											<LogOut className="h-5 w-5 text-orange-600" />
										)}
										<div>
											<p className="font-medium">
												{asistencia.Tipo === "ENTRADA" ? "Entrada" : "Salida"}
											</p>
											<p className="text-sm text-muted-foreground">
												{asistencia.FechaHora
													? format(new Date(asistencia.FechaHora), "HH:mm:ss")
													: "N/A"}
											</p>
										</div>
									</div>
									<div className="text-right text-sm text-muted-foreground">
										{asistencia.Modalidad && (
											<p className="capitalize">{asistencia.Modalidad.toLowerCase()}</p>
										)}
										{asistencia.EstadoPuntualidad && (
											<p
												className={
													asistencia.EstadoPuntualidad === "PUNTUAL"
														? "text-green-600"
														: "text-orange-600"
												}
											>
												{asistencia.EstadoPuntualidad.toLowerCase().replace("_", " ")}
											</p>
										)}
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Última asistencia */}
			{lastAttendance && (
				<Card>
					<CardHeader>
						<CardTitle>Último Registro</CardTitle>
						<CardDescription>Información de tu última asistencia registrada</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<p className="text-muted-foreground">Tipo</p>
								<p className="font-medium">
									{lastAttendance.Tipo === "ENTRADA" ? "Entrada" : "Salida"}
								</p>
							</div>
							<div>
								<p className="text-muted-foreground">Fecha y Hora</p>
								<p className="font-medium">
									{lastAttendance.FechaHora
										? format(new Date(lastAttendance.FechaHora), "PPP HH:mm:ss", { locale: es })
										: "N/A"}
								</p>
							</div>
							{lastAttendance.Modalidad && (
								<div>
									<p className="text-muted-foreground">Modalidad</p>
									<p className="font-medium capitalize">
										{lastAttendance.Modalidad.toLowerCase()}
									</p>
								</div>
							)}
							{lastAttendance.EstadoPuntualidad && (
								<div>
									<p className="text-muted-foreground">Puntualidad</p>
									<p
										className={`font-medium capitalize ${
											lastAttendance.EstadoPuntualidad === "PUNTUAL"
												? "text-green-600"
												: "text-orange-600"
										}`}
									>
										{lastAttendance.EstadoPuntualidad.toLowerCase().replace("_", " ")}
									</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Accesos rápidos */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<Card className="hover:shadow-md transition-shadow cursor-pointer">
					<Link to="/_auth/app/employee/attendance">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Clock className="h-5 w-5" />
								Mis Asistencias
							</CardTitle>
							<CardDescription>Ver historial completo de asistencias</CardDescription>
						</CardHeader>
					</Link>
				</Card>

				<Card className="hover:shadow-md transition-shadow cursor-pointer">
					<Link to="/_auth/app/employee/absences">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Calendar className="h-5 w-5" />
								Mis Ausencias
							</CardTitle>
							<CardDescription>Consultar ausencias registradas</CardDescription>
						</CardHeader>
					</Link>
				</Card>

				<Card className="hover:shadow-md transition-shadow cursor-pointer">
					<Link to="/_auth/app/employee/absences/new">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<AlertCircle className="h-5 w-5" />
								Justificar Ausencia
							</CardTitle>
							<CardDescription>Solicitar justificación de inasistencia</CardDescription>
						</CardHeader>
					</Link>
				</Card>

				<Card className="hover:shadow-md transition-shadow cursor-pointer">
					<Link to="/_auth/app/employee/history">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Clock className="h-5 w-5" />
								Historial
							</CardTitle>
							<CardDescription>Ver historial detallado</CardDescription>
						</CardHeader>
					</Link>
				</Card>
			</div>
		</div>
	);
}
