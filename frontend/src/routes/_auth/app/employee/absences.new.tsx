// Formulario para crear nueva solicitud de ausencia
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "#/features/auth";
import { useAbsence } from "#/features/attendance/hooks/useAttendance";
import { Calendar, Clock, FileText, ArrowLeft, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
	Form,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { TIPOS_AUSENCIA } from "#/features/attendance/types/attendance.types";

export const Route = createFileRoute("/_auth/app/employee/absences/new")({
	component: NewAbsencePage,
});

function NewAbsencePage() {
	const { usuarioApp } = useAuth();
	const { createAbsence, isLoading } = useAbsence();
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitSuccess, setSubmitSuccess] = useState(false);

	const form = useForm({
		defaultValues: {
			fechaAusencia: "",
			horaInicio: "",
			horaFin: "",
			tipoAusencia: "",
			motivo: "",
		},
	});

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
				TipoAusencia: data.tipoAusencia,
				Motivo: data.motivo,
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

	if (submitSuccess) {
		return (
			<div className="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-green-600">
							<CheckCircle className="h-6 w-6" />
							Solicitud Enviada
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground">
							Tu solicitud de ausencia ha sido enviada correctamente. Tu jefe directo la revisará
							pronto.
						</p>
						<div className="mt-4">
							<Button asChild variant="outline">
								<Link to="/_auth/app/employee/absences">Ver mis ausencias</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="icon" asChild>
					<Link to="/_auth/app/employee/absences">
						<ArrowLeft className="h-5 w-5" />
					</Link>
				</Button>
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Nueva Solicitud de Ausencia</h1>
					<p className="text-muted-foreground">
						Completa el formulario para justificar tu inasistencia
					</p>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<FileText className="h-5 w-5" />
						Información de la Ausencia
					</CardTitle>
					<CardDescription>
						Proporciona los detalles de tu solicitud de ausencia
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<FormField
									control={form.control}
									name="fechaAusencia"
									rules={{ required: "La fecha es requerida" }}
									render={({ field }) => (
										<FormItem>
											<FormLabel className="flex items-center gap-2">
												<Calendar className="h-4 w-4" />
												Fecha de Ausencia
											</FormLabel>
											<FormControl>
												<Input type="date" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="tipoAusencia"
									rules={{ required: "El tipo es requerido" }}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Tipo de Ausencia</FormLabel>
											<Select onValueChange={field.onChange} defaultValue={field.value}>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Selecciona un tipo" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{Object.entries(TIPOS_AUSENCIA).map(([key, value]) => (
														<SelectItem key={key} value={value}>
															{value.toLowerCase().replace("_", " ")}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<FormField
									control={form.control}
									name="horaInicio"
									rules={{ required: "La hora de inicio es requerida" }}
									render={({ field }) => (
										<FormItem>
											<FormLabel className="flex items-center gap-2">
												<Clock className="h-4 w-4" />
												Hora de Inicio
											</FormLabel>
											<FormControl>
												<Input type="time" {...field} />
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
										<FormItem>
											<FormLabel className="flex items-center gap-2">
												<Clock className="h-4 w-4" />
												Hora de Fin
											</FormLabel>
											<FormControl>
												<Input type="time" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="motivo"
								rules={{ required: "El motivo es requerido" }}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Motivo de la Ausencia</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Describe el motivo de tu ausencia..."
												className="min-h-[120px]"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{usuarioApp?.IdJefeDirecto && (
								<div className="p-4 bg-muted rounded-md">
									<p className="text-sm text-muted-foreground">
										Tu solicitud será revisada por tu jefe directo.
									</p>
								</div>
							)}

							<div className="flex gap-3">
								<Button type="submit" disabled={isLoading || isSubmitting} className="gap-2">
									{isSubmitting ? "Enviando..." : "Enviar Solicitud"}
								</Button>
								<Button type="button" variant="outline" asChild>
									<Link to="/_auth/app/employee/absences">Cancelar</Link>
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
