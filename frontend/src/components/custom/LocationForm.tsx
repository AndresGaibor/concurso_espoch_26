import { Info, Map as MapIcon, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import type {
	Ubicacion,
	UbicacionInsert,
} from "#/features/ubicaciones/types/ubicaciones.types";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface LocationFormProps {
	initialData?: Ubicacion | null;
	onSave: (data: UbicacionInsert) => void;
	onCancel: () => void;
	isSaving?: boolean;
}

export function LocationForm({
	initialData,
	onSave,
	onCancel,
	isSaving = false,
}: LocationFormProps) {
	const [formData, setFormData] = useState<UbicacionInsert>({
		Codigo: "",
		Nombre: "",
		Direccion: "",
		Latitud: 0,
		Longitud: 0,
		RadioMetros: 100,
		Estado: "PENDIENTE",
	});

	useEffect(() => {
		if (initialData) {
			setFormData({
				Codigo: initialData.Codigo,
				Nombre: initialData.Nombre,
				Direccion: initialData.Direccion,
				Latitud: initialData.Latitud,
				Longitud: initialData.Longitud,
				RadioMetros: initialData.RadioMetros,
				Estado: initialData.Estado,
			});
		}
	}, [initialData]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev: UbicacionInsert) => ({
			...prev,
			[name]: name === "RadioMetros" ? Number(value) : value,
		}));
	};

	const handleCoordinateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev: UbicacionInsert) => ({
			...prev,
			[name]:
				name === "Latitud" || name === "Longitud" ? Number(value) || 0 : value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave(formData);
	};

	const handleOpenMapPicker = () => {
		// TODO: Implementar mapa interactivo
		alert(
			"Funcionalidad de mapa: Aquí se abriría un mapa para seleccionar las coordenadas.",
		);
	};

	return (
		<Card className="border-t-4 border-t-primary">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<MapPin className="size-5 text-primary" />
					Editor de Ubicaciones
				</CardTitle>
				<CardDescription>
					{initialData
						? "Editar información de la sede"
						: "Agregar nueva sede al sistema"}
				</CardDescription>
			</CardHeader>
			<form onSubmit={handleSubmit}>
				<CardContent className="space-y-5">
					<div className="space-y-2">
						<Label
							htmlFor="Codigo"
							className="text-xs font-bold uppercase tracking-widest text-muted-foreground"
						>
							Código
						</Label>
						<Input
							id="Codigo"
							name="Codigo"
							value={formData.Codigo}
							onChange={handleChange}
							placeholder="ej. NW-01-LIM"
							className="font-mono"
							required
						/>
					</div>

					<div className="space-y-2">
						<Label
							htmlFor="Nombre"
							className="text-xs font-bold uppercase tracking-widest text-muted-foreground"
						>
							Nombre de la Sede
						</Label>
						<Input
							id="Nombre"
							name="Nombre"
							value={formData.Nombre}
							onChange={handleChange}
							placeholder="ej. Sede Central"
							required
						/>
					</div>

					<div className="space-y-2">
						<Label
							htmlFor="Direccion"
							className="text-xs font-bold uppercase tracking-widest text-muted-foreground"
						>
							Dirección
						</Label>
						<Textarea
							id="Direccion"
							name="Direccion"
							value={formData.Direccion}
							onChange={handleChange}
							placeholder="Nombre de la calle y número..."
							rows={2}
							required
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label
								htmlFor="Latitud"
								className="text-xs font-bold uppercase tracking-widest text-muted-foreground"
							>
								Latitud
							</Label>
							<Input
								id="Latitud"
								name="Latitud"
								type="number"
								step="any"
								value={formData.Latitud}
								onChange={handleCoordinateChange}
								placeholder="-12.0000"
								className="font-mono"
								required
							/>
						</div>
						<div className="space-y-2">
							<Label
								htmlFor="Longitud"
								className="text-xs font-bold uppercase tracking-widest text-muted-foreground"
							>
								Longitud
							</Label>
							<Input
								id="Longitud"
								name="Longitud"
								type="number"
								step="any"
								value={formData.Longitud}
								onChange={handleCoordinateChange}
								placeholder="-77.0000"
								className="font-mono"
								required
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label
							htmlFor="RadioMetros"
							className="text-xs font-bold uppercase tracking-widest text-muted-foreground"
						>
							Radio de Detección (metros)
						</Label>
						<div className="flex items-center gap-3">
							<input
								id="RadioMetros"
								name="RadioMetros"
								type="range"
								min="50"
								max="1000"
								step="50"
								value={formData.RadioMetros}
								onChange={handleChange}
								className="flex-1 accent-primary"
							/>
							<span className="text-sm font-bold text-primary min-w-[3rem] text-right">
								{formData.RadioMetros}m
							</span>
						</div>
					</div>

					<div className="relative h-40 rounded-lg bg-muted overflow-hidden group">
						<img
							src="https://maps.googleapis.com/maps/api/staticmap?center=-12.0464,-77.0428&zoom=12&size=400x200&key=YOUR_API_KEY"
							alt="Mapa de referencia"
							className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-500"
							onError={(e) => {
								(e.target as HTMLImageElement).src =
									"https://via.placeholder.com/400x200?text=Mapa";
							}}
						/>
						<div className="absolute inset-0 flex items-center justify-center">
							<Button
								type="button"
								variant="secondary"
								size="sm"
								onClick={handleOpenMapPicker}
								className="bg-background/90 backdrop-blur-sm hover:bg-background"
							>
								<MapIcon className="size-4 mr-2" />
								Abrir Selector GPS
							</Button>
						</div>
					</div>
					<p className="text-[10px] text-center text-muted-foreground italic">
						Haz clic en el mapa para seleccionar la zona precisa de check-in.
					</p>
				</CardContent>
				<CardFooter className="flex flex-col gap-3 pt-2">
					<Button type="submit" className="w-full" disabled={isSaving}>
						{isSaving ? "Guardando..." : "Guardar Ubicación"}
					</Button>
					<Button
						type="button"
						variant="outline"
						className="w-full"
						onClick={onCancel}
						disabled={isSaving}
					>
						Cancelar
					</Button>
				</CardFooter>
			</form>

			<div className="mx-6 mb-6 rounded-lg border bg-secondary/10 p-4">
				<div className="flex gap-3">
					<Info className="size-5 text-secondary shrink-0" />
					<div>
						<h4 className="text-sm font-semibold text-secondary">
							Protocolo de Geovallado
						</h4>
						<p className="text-xs text-muted-foreground leading-relaxed mt-1">
							El radio académico estándar es de 100m. Aumentar el radio más allá
							de 250m requiere aprobación del administrador senior para mantener
							los estándares de precisión GPS.
						</p>
					</div>
				</div>
			</div>
		</Card>
	);
}
