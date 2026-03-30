import { useCallback, useState } from "react";
import { supabase } from "../../../lib/supabase";

export type GpsValidationData = {
	userLocation: {
		latitude: number;
		longitude: number;
		accuracy: number;
	};
	authorizedLocation: {
		name: string;
		latitude: number;
		longitude: number;
		radiusMeters: number;
	};
	distanceMeters: number;
	withinRadius: boolean;
	precisionValid: boolean;
	finalValid: boolean;
	message: string;
};

function getCurrentPosition(options?: PositionOptions) {
	return new Promise<GeolocationPosition>((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject, options);
	});
}

function getGeolocationErrorMessage(error: GeolocationPositionError) {
	switch (error.code) {
		case 1:
			return "Permiso de ubicación denegado.";
		case 2:
			return "No se pudo obtener tu ubicación.";
		case 3:
			return "Tiempo de espera agotado.";
		default:
			return "Error de geolocalización.";
	}
}

export function useGpsValidation() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [result, setResult] = useState<GpsValidationData | null>(null);

	const validateLocation = useCallback(async () => {
		if (!navigator.geolocation) {
			setError("Tu navegador no soporta geolocalización.");
			return null;
		}

		try {
			setLoading(true);
			setError(null);
			setResult(null);

			const position = await getCurrentPosition({
				enableHighAccuracy: true,
				timeout: 15000,
				maximumAge: 0,
			});

			const payload = {
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
				accuracy: position.coords.accuracy,
			};

			const { data, error } = await supabase.functions.invoke(
				"validar-ubicacion-gps",
				{
					body: payload,
				},
			);

			if (error) {
				throw error;
			}

			if (!data?.ok) {
				throw new Error(data?.error ?? "No se pudo validar la ubicación.");
			}

			const parsed = data.data as GpsValidationData;
			setResult(parsed);

			return parsed;
		} catch (err) {
			if (err && typeof err === "object" && "code" in err) {
				setError(getGeolocationErrorMessage(err as GeolocationPositionError));
			} else {
				setError(err instanceof Error ? err.message : "Error inesperado.");
			}

			return null;
		} finally {
			setLoading(false);
		}
	}, []);

	const reset = useCallback(() => {
		setLoading(false);
		setError(null);
		setResult(null);
	}, []);

	return {
		loading,
		error,
		result,
		validateLocation,
		reset,
	};
}
