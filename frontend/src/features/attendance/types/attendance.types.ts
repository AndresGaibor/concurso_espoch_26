// Tipos para asistencias y ausencias
import type { Database } from "#/types/database";

// Tipos base de ASISTENCIAS
export type AsistenciaRow = Database["public"]["Tables"]["ASISTENCIAS"]["Row"];
export type AsistenciaInsert = Database["public"]["Tables"]["ASISTENCIAS"]["Insert"];
export type AsistenciaUpdate = Database["public"]["Tables"]["ASISTENCIAS"]["Update"];

// Tipos base de AUSENCIAS
export type AusenciaRow = Database["public"]["Tables"]["AUSENCIAS"]["Row"];
export type AusenciaInsert = Database["public"]["Tables"]["AUSENCIAS"]["Insert"];
export type AusenciaUpdate = Database["public"]["Tables"]["AUSENCIAS"]["Update"];

// Tipos con relaciones para vistas enriquecidas
export type AsistenciaWithUser = AsistenciaRow & {
	USUARIOS?: {
		NombreCompleto: string;
		CorreoInstitucional: string | null;
	};
};

export type AusenciaWithUser = AusenciaRow & {
	USUARIOS?: {
		NombreCompleto: string;
		CorreoInstitucional: string | null;
	};
	Aprobador?: {
		NombreCompleto: string;
		CorreoInstitucional: string | null;
	};
};

// Tipos para el formulario de ausencia
export interface AusenciaFormData {
	FechaAusencia: string;
	HoraInicio: string;
	HoraFin: string;
	Motivo: string;
	TipoAusencia: string;
}

// Estados de aprobación
export type EstadoAprobacion = "PENDIENTE" | "APROBADO" | "RECHAZADO";

// Tipos de ausencia comunes
export const TIPOS_AUSENCIA = {
	VACACIONES: "VACACIONES",
	ENFERMEDAD: "ENFERMEDAD",
	PERSONAL: "PERSONAL",
	MEDICA: "MEDICA",
	OTRO: "OTRO",
} as const;

export type TipoAusencia = (typeof TIPOS_AUSENCIA)[keyof typeof TIPOS_AUSENCIA];

// Tipos de asistencia
export const TIPOS_ASISTENCIA = {
	ENTRADA: "ENTRADA",
	SALIDA: "SALIDA",
} as const;

export type TipoAsistencia = (typeof TIPOS_ASISTENCIA)[keyof typeof TIPOS_ASISTENCIA];

// Estados de puntualidad
export const ESTADOS_PUNTUALIDAD = {
	PUNTUAL: "PUNTUAL",
	TARDANZA: "TARDANZA",
} as const;

export type EstadoPuntualidad =
	(typeof ESTADOS_PUNTUALIDAD)[keyof typeof ESTADOS_PUNTUALIDAD];
