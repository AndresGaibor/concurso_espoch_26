// Exportadores principales para el módulo de asistencias y ausencias
export {
	useAbsence,
	useAttendance,
	useManagerEmployees,
} from "./hooks/useAttendance";
export type {
	AsistenciaInsert,
	AsistenciaRow,
	AsistenciaUpdate,
	AsistenciaWithUser,
	AusenciaFormData,
	AusenciaInsert,
	AusenciaRow,
	AusenciaUpdate,
	AusenciaWithUser,
	EstadoAprobacion,
	EstadoPuntualidad,
	TipoAsistencia,
	TipoAusencia,
} from "./types/attendance.types";
export {
	ESTADOS_PUNTUALIDAD,
	TIPOS_ASISTENCIA,
	TIPOS_AUSENCIA,
} from "./types/attendance.types";
