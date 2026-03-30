import { createFileRoute } from "@tanstack/react-router";
import { useGpsValidation } from "../features/asistencias/hooks/gps-validation";

export const Route = createFileRoute("/gps")({
	component: RouteComponent,
});

function RouteComponent() {
	const { loading, error, result, validateLocation } = useGpsValidation();

	return (
		<div
			style={{
				maxWidth: 800,
				margin: "0 auto",
				padding: 24,
				fontFamily: "system-ui, sans-serif",
			}}
		>
			<h1>Validación GPS con Haversine</h1>
			<p>
				Obtiene tu ubicación actual y valida si estás dentro del radio permitido
				de la sede.
			</p>

			<button
				onClick={() => void validateLocation()}
				disabled={loading}
				style={{
					padding: "10px 16px",
					borderRadius: 8,
					border: "1px solid #ccc",
					cursor: loading ? "not-allowed" : "pointer",
				}}
			>
				{loading ? "Validando..." : "Obtener ubicación y validar"}
			</button>

			{error ? (
				<p style={{ color: "crimson", marginTop: 16 }}>{error}</p>
			) : null}

			{result ? (
				<div
					style={{
						marginTop: 24,
						display: "grid",
						gap: 16,
					}}
				>
					<div
						style={{
							padding: 16,
							border: "1px solid #e5e5e5",
							borderRadius: 12,
						}}
					>
						<h2>Tu ubicación</h2>
						<p>
							<strong>Latitud:</strong>{" "}
							{result.userLocation.latitude.toFixed(6)}
						</p>
						<p>
							<strong>Longitud:</strong>{" "}
							{result.userLocation.longitude.toFixed(6)}
						</p>
						<p>
							<strong>Precisión:</strong>{" "}
							{result.userLocation.accuracy.toFixed(2)} m
						</p>
					</div>

					<div
						style={{
							padding: 16,
							border: "1px solid #e5e5e5",
							borderRadius: 12,
						}}
					>
						<h2>Sede autorizada</h2>
						<p>
							<strong>Nombre:</strong> {result.authorizedLocation.name}
						</p>
						<p>
							<strong>Latitud:</strong>{" "}
							{result.authorizedLocation.latitude.toFixed(6)}
						</p>
						<p>
							<strong>Longitud:</strong>{" "}
							{result.authorizedLocation.longitude.toFixed(6)}
						</p>
						<p>
							<strong>Radio permitido:</strong>{" "}
							{result.authorizedLocation.radiusMeters} m
						</p>
					</div>

					<div
						style={{
							padding: 16,
							border: "1px solid #e5e5e5",
							borderRadius: 12,
						}}
					>
						<h2>Resultado</h2>
						<p>
							<strong>Distancia a la sede:</strong>{" "}
							{result.distanceMeters.toFixed(2)} m
						</p>
						<p>
							<strong>¿Dentro del radio?:</strong>{" "}
							{result.withinRadius ? "Sí" : "No"}
						</p>
						<p>
							<strong>¿Precisión aceptable?:</strong>{" "}
							{result.precisionValid ? "Sí" : "No"}
						</p>
						<p>
							<strong>¿Validación final?:</strong>{" "}
							{result.finalValid ? "Aprobada" : "Rechazada"}
						</p>
						<p>
							<strong>Mensaje:</strong> {result.message}
						</p>
					</div>
				</div>
			) : null}
		</div>
	);
}
