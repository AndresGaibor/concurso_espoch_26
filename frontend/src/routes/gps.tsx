import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/gps")({
	component: RouteComponent,
});

type GpsData = {
	latitude: number;
	longitude: number;
	accuracy: number;
	address: string | null;
	province: string | null;
	city: string | null;
};

async function reverseGeocode(latitude: number, longitude: number) {
	const url = new URL("https://nominatim.openstreetmap.org/reverse");
	url.searchParams.set("lat", String(latitude));
	url.searchParams.set("lon", String(longitude));
	url.searchParams.set("format", "jsonv2");
	url.searchParams.set("addressdetails", "1");

	const response = await fetch(url.toString(), {
		headers: {
			Accept: "application/json",
		},
	});

	if (!response.ok) {
		throw new Error("No se pudo obtener la dirección.");
	}

	const data = await response.json();
	const address = data.address ?? {};

	return {
		address: data.display_name ?? null,
		province: address.state ?? address.region ?? null,
		city:
			address.city ??
			address.town ??
			address.village ??
			address.municipality ??
			address.county ??
			null,
	};
}

function getCurrentPosition(options?: PositionOptions) {
	return new Promise<GeolocationPosition>((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject, options);
	});
}

function RouteComponent() {
	const [gpsData, setGpsData] = useState<GpsData | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleGetLocation = async () => {
		if (!navigator.geolocation) {
			setError("Tu navegador no soporta geolocalización.");
			return;
		}

		try {
			setLoading(true);
			setError(null);

			const position = await getCurrentPosition({
				enableHighAccuracy: true,
				timeout: 15000,
				maximumAge: 0,
			});

			const latitude = position.coords.latitude;
			const longitude = position.coords.longitude;
			const accuracy = position.coords.accuracy;

			const geo = await reverseGeocode(latitude, longitude);

			setGpsData({
				latitude,
				longitude,
				accuracy,
				address: geo.address,
				province: geo.province,
				city: geo.city,
			});
		} catch (err) {
			if (err && typeof err === "object" && "code" in err) {
				const geoError = err as GeolocationPositionError;

				switch (geoError.code) {
					case 1:
						setError("Permiso de ubicación denegado.");
						break;
					case 2:
						setError("No se pudo obtener tu ubicación.");
						break;
					case 3:
						setError("Tiempo de espera agotado.");
						break;
					default:
						setError("Error de geolocalización.");
				}
			} else {
				setError(err instanceof Error ? err.message : "Error inesperado.");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			style={{
				maxWidth: 720,
				margin: "0 auto",
				padding: 24,
				fontFamily: "system-ui, sans-serif",
			}}
		>
			<h1>GPS</h1>
			<p>Visualización de latitud, longitud, precisión, dirección, provincia y ciudad.</p>

			<button
				onClick={handleGetLocation}
				disabled={loading}
				style={{
					padding: "10px 16px",
					borderRadius: 8,
					border: "1px solid #ccc",
					cursor: loading ? "not-allowed" : "pointer",
				}}
			>
				{loading ? "Obteniendo ubicación..." : "Obtener ubicación"}
			</button>

			{error ? (
				<p style={{ color: "crimson", marginTop: 16 }}>{error}</p>
			) : null}

			<div
				style={{
					marginTop: 24,
					padding: 16,
					border: "1px solid #e5e5e5",
					borderRadius: 12,
				}}
			>
				<p>
					<strong>Latitud:</strong>{" "}
					{gpsData ? gpsData.latitude.toFixed(6) : "-"}
				</p>
				<p>
					<strong>Longitud:</strong>{" "}
					{gpsData ? gpsData.longitude.toFixed(6) : "-"}
				</p>
				<p>
					<strong>Precisión:</strong>{" "}
					{gpsData ? `${gpsData.accuracy.toFixed(2)} m` : "-"}
				</p>
				<p>
					<strong>Dirección:</strong> {gpsData?.address ?? "-"}
				</p>
				<p>
					<strong>Provincia:</strong> {gpsData?.province ?? "-"}
				</p>
				<p>
					<strong>Ciudad:</strong> {gpsData?.city ?? "-"}
				</p>
			</div>
		</div>
	);
}
