import { createFileRoute } from "@tanstack/react-router";
import {
	BadgeCheck,
	Calendar,
	Clock,
	Download,
	Edit,
	LogOut,
	MapPin,
} from "lucide-react";
import { useAuth } from "#/features/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/_auth/app/profile")({
	component: ProfilePage,
});

function getInitials(name: string) {
	return name
		.split(" ")
		.slice(0, 2)
		.map((n) => n[0]?.toUpperCase() ?? "")
		.join("");
}

function ProfilePage() {
	const { usuarioApp, rol, signOut } = useAuth();

	const nombre = usuarioApp?.NombreCompleto ?? "Usuario";
	const email = usuarioApp?.CorreoInstitucional ?? "";
	const cargo = "Docente Investigador Principal";
	const jefeDirecto = "Dra. Beatriz Solari - Dean of Research";
	const horario = "Tiempo Completo Académico (40h/sem)";
	const idEmpleado = usuarioApp?.IdUsuario?.toString() ?? "N/A";

	// Datos simulados para última conexión
	const ultimaConexion = "Hoy, 08:42 AM";
	const ipConexion = "192.168.102.45";
	const duracionSesion = "5h 18m";

	// Ubicaciones autorizadas
	const ubicaciones = [
		{
			nombre: "Campus Central",
			direccion: "Av. Arequipa 440, Lima",
		},
		{
			nombre: "Laboratorio de Investigación Médica",
			direccion: "Calle Petit Thouars, Miraflores",
		},
	];

	// Horario semanal
	const horarioSemanal = [
		{ dia: "Lunes", horario: "08:00 - 17:00", tipo: "Campus" },
		{ dia: "Martes", horario: "08:00 - 17:00", tipo: "Campus" },
		{ dia: "Miércoles", horario: "09:00 - 13:00", tipo: "Remoto" },
		{ dia: "Jueves", horario: "08:00 - 17:00", tipo: "Campus" },
		{ dia: "Viernes", horario: "08:00 - 17:00", tipo: "Campus" },
	];

	return (
		<div className="p-10 max-w-7xl mx-auto space-y-8">
			{/* Header */}
			<div className="flex justify-between items-end">
				<div>
					<h2 className="text-4xl font-extrabold tracking-tight mb-2">
						Perfil de Usuario
					</h2>
					<p className="text-muted-foreground font-medium">
						Registro académico y laboral completo.
					</p>
				</div>
				<div className="flex gap-3">
					<Button variant="outline" size="sm">
						<Edit className="size-4 mr-2" />
						Editar Información
					</Button>
					<Button size="sm">
						<Download className="size-4 mr-2" />
						Descargar Reporte
					</Button>
				</div>
			</div>

			{/* Bento Grid Layout */}
			<div className="grid grid-cols-12 gap-6">
				{/* Main Identity Card */}
				<Card className="col-span-12 lg:col-span-8 relative overflow-hidden">
					<div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20" />
					<CardHeader className="relative z-10">
						<div className="flex items-start gap-6">
							<Avatar className="size-32 border-4 shadow-lg">
								<AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
									{getInitials(nombre)}
								</AvatarFallback>
							</Avatar>
							<div className="flex-1 space-y-4">
								<div className="flex items-center gap-3">
									<h3 className="text-2xl font-bold">{nombre}</h3>
									<Badge variant="secondary" className="text-xs">
										Estado Activo
									</Badge>
								</div>
								<p className="text-lg text-muted-foreground font-medium">
									{cargo}
								</p>
							</div>
						</div>
					</CardHeader>
					<CardContent className="relative z-10 grid grid-cols-2 gap-y-6 gap-x-12">
						<div>
							<p className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-1">
								Correo Institucional
							</p>
							<p className="font-semibold flex items-center gap-2">
								{email}
								<BadgeCheck className="size-4 text-primary" />
							</p>
						</div>
						<div>
							<p className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-1">
								Jefe Directo
							</p>
							<p className="font-semibold">{jefeDirecto}</p>
						</div>
						<div>
							<p className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-1">
								Horario Asignado
							</p>
							<p className="font-semibold">{horario}</p>
						</div>
						<div>
							<p className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-1">
								ID Empleado
							</p>
							<p className="font-semibold tracking-widest">W-{idEmpleado}-EX</p>
						</div>
					</CardContent>
				</Card>

				{/* Last Access Stats Card */}
				<Card className="col-span-12 lg:col-span-4 bg-primary text-primary-foreground overflow-hidden relative">
					<div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
					<CardHeader className="relative z-10 space-y-4">
						<Clock className="size-10 text-primary-foreground/80" />
						<div>
							<CardTitle>Seguridad y Acceso</CardTitle>
							<CardDescription className="text-primary-foreground/70">
								Información de última conexión
							</CardDescription>
						</div>
					</CardHeader>
					<CardContent className="relative z-10 space-y-6">
						<div>
							<p className="text-xs uppercase tracking-widest text-primary-foreground/70 font-bold mb-1">
								Último Acceso
							</p>
							<p className="text-2xl font-bold">{ultimaConexion}</p>
							<p className="text-sm text-primary-foreground/80">
								IP: {ipConexion}
							</p>
						</div>
						<div>
							<p className="text-xs uppercase tracking-widest text-primary-foreground/70 font-bold mb-1">
								Duración de Sesión
							</p>
							<p className="text-2xl font-bold">{duracionSesion}</p>
						</div>
					</CardContent>
				</Card>

				{/* Allowed Locations Map Section */}
				<Card className="col-span-12 lg:col-span-7">
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle>Ubicaciones Geocercadas Permitidas</CardTitle>
								<CardDescription>
									Zonas autorizadas para check-in móvil.
								</CardDescription>
							</div>
							<MapPin className="text-muted-foreground" />
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							{ubicaciones.map((ubicacion) => (
								<div
									key={ubicacion.nombre}
									className="p-4 bg-muted rounded-lg border-l-4 border-primary"
								>
									<p className="font-bold mb-1">{ubicacion.nombre}</p>
									<p className="text-xs text-muted-foreground">
										{ubicacion.direccion}
									</p>
								</div>
							))}
						</div>
						<div className="h-64 rounded-lg bg-muted overflow-hidden flex items-center justify-center">
							<div className="text-center text-muted-foreground">
								<MapPin className="size-8 mx-auto mb-2 opacity-50" />
								<p className="text-sm">Mapa de ubicaciones</p>
								<p className="text-xs">Lima, Perú</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Schedule & Weekly View */}
				<div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
					<Card className="flex-1">
						<CardHeader>
							<CardTitle>Horario Semanal</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{horarioSemanal.map((dia) => (
									<div
										key={dia.dia}
										className={`flex items-center justify-between p-3 rounded-md ${
											dia.dia === "Miércoles"
												? "bg-secondary text-secondary-foreground"
												: "bg-muted"
										}`}
									>
										<span className="text-sm font-bold w-24">{dia.dia}</span>
										<span className="text-sm text-muted-foreground">
											{dia.horario}
										</span>
										<Badge
											variant={dia.tipo === "Remoto" ? "outline" : "secondary"}
											className="text-xs"
										>
											{dia.tipo}
										</Badge>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Sign Out Primary Action */}
					<Button
						variant="outline"
						className="w-full h-auto p-6 justify-between border-destructive/10 text-destructive hover:bg-destructive/10"
						onClick={async () => {
							await signOut();
						}}
					>
						<div className="text-left">
							<p className="font-bold text-lg">Terminar Sesión</p>
							<p className="text-xs text-muted-foreground font-medium">
								Cerrar sesión del portal de forma segura.
							</p>
						</div>
						<LogOut className="size-6" />
					</Button>
				</div>
			</div>
		</div>
	);
}
