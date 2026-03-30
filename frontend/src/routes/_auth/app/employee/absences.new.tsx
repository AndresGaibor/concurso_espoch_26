// Formulario para crear nueva solicitud de ausencia
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertCircle, Calendar, Clock, Info, Send, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAbsence } from "#/features/attendance/hooks/useAttendance";
import { useAuth } from "#/features/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_auth/app/employee/absences/new")({
	component: NewAbsencePage,
});

const MOTIVOS_AUSENCIA = [
	"Cita Médica",
	"Trámite Personal",
	"Emergencia Familiar",
	"Capacitación Externa",
	"Otros",
];

function NewAbsencePage() {
	const { usuarioApp } = useAuth();
	const { createAbsence, isLoading } = useAbsence();
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitSuccess, setSubmitSuccess] = useState(false);
	const [horasCalculadas, setHorasCalculadas] = useState(0);
	const [horaInicio, setHoraInicio] = useState("");
	const [horaFin, setHoraFin] = useState("");

	const form = useForm({
		defaultValues: {
			fechaAusencia: "",
			horaInicio: "",
			horaFin: "",
			motivo: "",
			observaciones: "",
		},
	});

	// Calcular horas cuando cambian las horas
	useEffect(() => {
		if (horaInicio && horaFin) {
			const inicio = new Date(`1970-01-01T${horaInicio}`);
			const fin = new Date(`1970-01-01T${horaFin}`);
			const diff = (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60);
			setHorasCalculadas(diff > 0 ? diff : 0);
		} else {
			setHorasCalculadas(0);
		}
	}, [horaInicio, horaFin]);

	const onSubmit = async (data: any) => {
		if (!usuarioApp) return;

		setIsSubmitting(true);

		try {
			const result = await createAbsence({
				IdUsuario: usuarioApp.IdUsuario,
				IdAprobador: usuarioApp.IdJefeDirecto || undefined,
				FechaAusencia: new Date(data.fechaAusencia).toISOString(),
				HoraInicio: data.horaInicio,
				HoraFin: data.horaFin,
				TipoAusencia: data.motivo.toUpperCase().replace(" ", "_"),
				Motivo: data.observaciones,
			});

			if (result) {
				setSubmitSuccess(true);
				form.reset();
				setTimeout(() => {
					navigate({ to: "/_auth/app/employee/absences" });
				}, 2000);
			}
		} catch (error) {
			console.error("Error al crear ausencia:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const horasDisponibles = 6.0 - horasCalculadas;
	const porcentajeUso = (horasCalculadas / 6.0) * 100;

	if (submitSuccess) {
		return (
			<div className="space-y-6">
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-2 text-green-600 mb-4">
							<Info className="h-6 w-6" />
							<h2 className="text-xl font-bold">Solicitud Enviada</h2>
						</div>
						<p className="text-muted-foreground">
							Tu solicitud de ausencia ha sido enviada correctamente. Tu jefe
							directo la revisará pronto.
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<header className="mb-8">
				<nav className="flex gap-2 text-[10px] font-bold tracking-widest text-muted-foreground mb-2 uppercase">
					<span>Portal</span>
					<span>/</span>
					<span className="text-primary">Solicitud de Ausencia</span>
				</nav>
				<h1 className="text-4xl font-extrabold text-primary tracking-tight leading-none">
					Nueva Solicitud
				</h1>
				<p className="text-muted-foreground mt-2 max-w-xl text-sm">
					Gestiona tus permisos de ausencia de corta duración. Recuerda que el
					límite máximo permitido es de 6 horas por jornada laboral.
				</p>
			</header>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
				{/* Left Side: The Form */}
				<div className="lg:col-span-8 space-y-6">
					<Card className="rounded-2xl">
						<CardContent className="p-8">
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-8"
								>
									{/* Row 1: Date & Motivo */}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
										<FormField
											control={form.control}
											name="fechaAusencia"
											rules={{ required: "La fecha es requerida" }}
											render={({ field }) => (
												<FormItem className="space-y-2">
													<FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
														Fecha de Ausencia
													</FormLabel>
													<FormControl>
														<div className="relative group">
															<Input
																type="date"
																className="w-full bg-background border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary transition-all text-primary font-medium"
																{...field}
															/>
															<Calendar className="absolute right-4 top-3 text-muted-foreground group-focus-within:text-primary transition-colors h-5 w-5" />
														</div>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="motivo"
											rules={{ required: "El motivo es requerido" }}
											render={({ field }) => (
												<FormItem className="space-y-2">
													<FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
														Motivo
													</FormLabel>
													<FormControl>
														<Select
															onValueChange={field.onChange}
															defaultValue={field.value}
														>
															<SelectTrigger className="w-full bg-background border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary transition-all text-primary font-medium">
																<SelectValue placeholder="Seleccione un motivo" />
															</SelectTrigger>
															<SelectContent>
																{MOTIVOS_AUSENCIA.map((motivo) => (
																	<SelectItem key={motivo} value={motivo}>
																		{motivo}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									{/* Row 2: Time Settings */}
									<div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 bg-muted rounded-xl">
										<FormField
											control={form.control}
											name="horaInicio"
											rules={{ required: "La hora de inicio es requerida" }}
											render={({ field }) => (
												<FormItem className="space-y-2">
													<FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
														Hora Inicio
													</FormLabel>
													<FormControl>
														<Input
															type="time"
															className="w-full bg-background border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary transition-all text-primary font-medium"
															{...field}
															onChange={(e) => {
																field.onChange(e);
																setHoraInicio(e.target.value);
															}}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="horaFin"
											rules={{ required: "La hora de fin es requerida" }}
											render={({ field }) => (
												<FormItem className="space-y-2">
													<FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
														Hora Fin
													</FormLabel>
													<FormControl>
														<Input
															type="time"
															className="w-full bg-background border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary transition-all text-primary font-medium"
															{...field}
															onChange={(e) => {
																field.onChange(e);
																setHoraFin(e.target.value);
															}}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<div className="space-y-2">
											<label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block">
												Total Solicitado
											</label>
											<div className="w-full bg-primary text-white rounded-lg px-4 py-3 flex items-center justify-between font-bold">
												<span>{horasCalculadas.toFixed(1)}</span>
												<span className="text-[10px] font-medium tracking-normal opacity-70">
													HORAS
												</span>
											</div>
										</div>
									</div>

									{/* Row 3: Observaciones */}
									<FormField
										control={form.control}
										name="observaciones"
										rules={{ required: "Las observaciones son requeridas" }}
										render={({ field }) => (
											<FormItem className="space-y-2">
												<FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
													Observaciones
												</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Describa brevemente el motivo de su ausencia..."
														className="min-h-[120px] w-full bg-muted border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary transition-all text-primary placeholder:text-muted-foreground italic"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Actions */}
									<div className="flex items-center justify-end gap-4 pt-4">
										<Button
											type="button"
											variant="ghost"
											className="px-8 py-3 text-muted-foreground font-bold hover:text-primary transition-colors gap-2"
											onClick={() =>
												navigate({ to: "/_auth/app/employee/absences" })
											}
										>
											<X className="h-4 w-4" />
											Cancelar
										</Button>
										<Button
											type="submit"
											disabled={isLoading || isSubmitting}
											className="px-10 py-3 bg-primary text-white font-bold rounded-lg shadow-lg shadow-primary/30 active:scale-95 transition-all flex items-center gap-2"
										>
											<Send className="text-lg h-5 w-5" />
											{isSubmitting ? "Enviando..." : "Enviar Solicitud"}
										</Button>
									</div>
								</form>
							</Form>
						</CardContent>
					</Card>
				</div>

				{/* Right Side: Validation & Status */}
				<div className="lg:col-span-4 space-y-6">
					{/* Quota Card */}
					<Card className="rounded-2xl overflow-hidden relative">
						<CardContent className="p-6 space-y-6">
							<h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
								<Clock className="text-sm h-4 w-4" />
								Validación de Cupo
							</h3>

							<div className="flex justify-between items-end">
								<div>
									<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
										Utilizado hoy
									</p>
									<p className="text-3xl font-extrabold text-primary">
										{horasCalculadas.toFixed(1)}{" "}
										<span className="text-sm font-normal text-muted-foreground">
											h
										</span>
									</p>
								</div>
								<div className="text-right">
									<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
										Límite Diario
									</p>
									<p className="text-xl font-bold text-foreground">
										6.0{" "}
										<span className="text-xs font-normal text-muted-foreground">
											h
										</span>
									</p>
								</div>
							</div>

							{/* Progress Bar */}
							<Progress value={porcentajeUso} className="h-2" />

							<div className="flex items-center gap-3 p-4 bg-secondary/10 rounded-xl border border-secondary/20">
								<Info className="text-muted-foreground h-4 w-4" />
								<p className="text-xs font-medium text-foreground leading-relaxed">
									Aún tienes{" "}
									<span className="font-bold">
										{horasDisponibles.toFixed(1)} horas
									</span>{" "}
									disponibles para solicitar hoy.
								</p>
							</div>
						</CardContent>
					</Card>

					{/* Alert Card */}
					<Card className="bg-destructive/10 border border-destructive/30 rounded-2xl">
						<CardContent className="p-6 flex gap-4">
							<AlertCircle className="text-destructive h-5 w-5" />
							<div>
								<h4 className="text-sm font-bold text-foreground mb-1">
									Restricción de Tiempo
								</h4>
								<p className="text-xs text-muted-foreground leading-relaxed">
									No es posible solicitar más de 6 horas continuas o acumuladas
									por día bajo este concepto. Para ausencias mayores, use el
									módulo de{" "}
									<span className="font-bold underline cursor-pointer">
										Licencias
									</span>
									.
								</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Secondary Info Section - Recent History */}
			<section className="mt-12">
				<h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6 px-2">
					Historial Reciente de Solicitudes
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<RecentAbsenceCard
						icon="medical_services"
						title="Cita Oftalmológica"
						date="12 Oct 2023"
						hours="2.5h"
						status="Aprobado"
						statusVariant="success"
					/>
					<RecentAbsenceCard
						icon="account_balance"
						title="Trámite Notarial"
						date="05 Oct 2023"
						hours="1.0h"
						status="Pendiente"
						statusVariant="warning"
					/>
					<RecentAbsenceCard
						icon="other_houses"
						title="Asunto Personal"
						date="28 Sep 2023"
						hours="4.0h"
						status="Rechazado"
						statusVariant="destructive"
					/>
				</div>
			</section>
		</div>
	);
}

interface RecentAbsenceCardProps {
	icon: string;
	title: string;
	date: string;
	hours: string;
	status: string;
	statusVariant: "success" | "warning" | "destructive" | "secondary";
}

function RecentAbsenceCard({
	icon,
	title,
	date,
	hours,
	status,
	statusVariant,
}: RecentAbsenceCardProps) {
	const getIcon = () => {
		switch (icon) {
			case "medical_services":
				return <Info className="h-5 w-5" />;
			case "account_balance":
				return <Info className="h-5 w-5" />;
			case "other_houses":
				return <Info className="h-5 w-5" />;
			default:
				return <Info className="h-5 w-5" />;
		}
	};

	const getStatusColors = () => {
		switch (statusVariant) {
			case "success":
				return "bg-green-100 text-green-800";
			case "warning":
				return "bg-yellow-100 text-yellow-800";
			case "destructive":
				return "bg-destructive/20 text-destructive";
			default:
				return "bg-secondary/20 text-secondary";
		}
	};

	return (
		<Card className="p-5 rounded-xl flex items-center justify-between group hover:bg-background transition-colors">
			<CardContent className="p-0 flex items-center gap-4">
				<div
					className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColors()}`}
				>
					{getIcon()}
				</div>
				<div>
					<p className="font-bold text-primary text-sm">{title}</p>
					<p className="text-[10px] text-muted-foreground font-medium">
						{date} • {hours}
					</p>
				</div>
			</CardContent>
			<span
				className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-tighter ${getStatusColors()}`}
			>
				{status}
			</span>
		</Card>
	);
}
