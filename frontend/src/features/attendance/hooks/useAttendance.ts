// Hooks para gestión de asistencias y ausencias
import { useState, useCallback, useEffect } from "react";
import { supabase } from "#/lib/supabase";
import type {
	AsistenciaRow,
	AsistenciaInsert,
	AusenciaRow,
	AusenciaInsert,
	AusenciaUpdate,
	AusenciaFormData,
} from "./attendance.types";

// ==================== HOOK PARA ASISTENCIAS ====================

export function useAttendance() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Registrar asistencia (entrada o salida)
	const registerAttendance = useCallback(
		async (data: {
			IdUsuario: number;
			Tipo: "ENTRADA" | "SALIDA";
			Latitud?: number;
			Longitud?: number;
			Direccion?: string;
			Modalidad?: string;
		}): Promise<AsistenciaRow | null> => {
			setIsLoading(true);
			setError(null);

			try {
				const { data: asistencia, error } = await supabase
					.from("ASISTENCIAS")
					.insert({
						...data,
						FechaHora: new Date().toISOString(),
					})
					.select()
					.single();

				if (error) throw error;
				return asistencia;
			} catch (err) {
				const message = err instanceof Error ? err.message : "Error al registrar asistencia";
				setError(message);
				return null;
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	// Obtener asistencias de un usuario
	const getUserAttendances = useCallback(
		async (userId: number, limit = 50): Promise<AsistenciaRow[]> => {
			setIsLoading(true);
			setError(null);

			try {
				const { data, error } = await supabase
					.from("ASISTENCIAS")
					.select("*")
					.eq("IdUsuario", userId)
					.order("FechaHora", { ascending: false })
					.limit(limit);

				if (error) throw error;
				return data || [];
			} catch (err) {
				const message = err instanceof Error ? err.message : "Error al obtener asistencias";
				setError(message);
				return [];
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	// Obtener última asistencia de un usuario
	const getLastAttendance = useCallback(
		async (userId: number): Promise<AsistenciaRow | null> => {
			setIsLoading(true);
			setError(null);

			try {
				const { data, error } = await supabase
					.from("ASISTENCIAS")
					.select("*")
					.eq("IdUsuario", userId)
					.order("FechaHora", { ascending: false })
					.limit(1)
					.single();

				if (error && error.code !== "PGRST116") throw error;
				return data;
			} catch (err) {
				const message = err instanceof Error ? err.message : "Error al obtener última asistencia";
				setError(message);
				return null;
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	// Obtener asistencias por fecha
	const getAttendancesByDate = useCallback(
		async (userId: number, date: string): Promise<AsistenciaRow[]> => {
			setIsLoading(true);
			setError(null);

			try {
				const startOfDay = new Date(date);
				startOfDay.setHours(0, 0, 0, 0);
				const endOfDay = new Date(date);
				endOfDay.setHours(23, 59, 59, 999);

				const { data, error } = await supabase
					.from("ASISTENCIAS")
					.select("*")
					.eq("IdUsuario", userId)
					.gte("FechaHora", startOfDay.toISOString())
					.lte("FechaHora", endOfDay.toISOString())
					.order("FechaHora", { ascending: true });

				if (error) throw error;
				return data || [];
			} catch (err) {
				const message = err instanceof Error ? err.message : "Error al obtener asistencias por fecha";
				setError(message);
				return [];
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	return {
		isLoading,
		error,
		registerAttendance,
		getUserAttendances,
		getLastAttendance,
		getAttendancesByDate,
	};
}

// ==================== HOOK PARA AUSENCIAS ====================

export function useAbsence() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Crear solicitud de ausencia
	const createAbsence = useCallback(
		async (data: {
			IdUsuario: number;
			FechaAusencia: string;
			HoraInicio: string;
			HoraFin: string;
			Motivo: string;
			TipoAusencia: string;
			IdAprobador?: number;
		}): Promise<AusenciaRow | null> => {
			setIsLoading(true);
			setError(null);

			try {
				// Calcular total de horas
				const inicio = new Date(`1970-01-01T${data.HoraInicio}`);
				const fin = new Date(`1970-01-01T${data.HoraFin}`);
				const totalHoras = (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60);

				const { data: ausencia, error } = await supabase
					.from("AUSENCIAS")
					.insert({
						...data,
						FechaSolicitud: new Date().toISOString(),
						EstadoAprobacion: "PENDIENTE",
						TotalHoras: totalHoras > 0 ? totalHoras : 0,
					})
					.select()
					.single();

				if (error) throw error;
				return ausencia;
			} catch (err) {
				const message = err instanceof Error ? err.message : "Error al crear ausencia";
				setError(message);
				return null;
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	// Obtener ausencias de un usuario
	const getUserAbsences = useCallback(
		async (userId: number): Promise<AusenciaRow[]> => {
			setIsLoading(true);
			setError(null);

			try {
				const { data, error } = await supabase
					.from("AUSENCIAS")
					.select("*")
					.eq("IdUsuario", userId)
					.order("FechaSolicitud", { ascending: false });

				if (error) throw error;
				return data || [];
			} catch (err) {
				const message = err instanceof Error ? err.message : "Error al obtener ausencias";
				setError(message);
				return [];
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	// Obtener ausencias pendientes de aprobación para un jefe
	const getPendingAbsencesForManager = useCallback(
		async (managerId: number): Promise<AusenciaRow[]> => {
			setIsLoading(true);
			setError(null);

			try {
				const { data, error } = await supabase
					.from("AUSENCIAS")
					.select("*, USUARIOS(NombreCompleto, CorreoInstitucional)")
					.eq("IdAprobador", managerId)
					.eq("EstadoAprobacion", "PENDIENTE")
					.order("FechaSolicitud", { ascending: false });

				if (error) throw error;
				return data || [];
			} catch (err) {
				const message = err instanceof Error ? err.message : "Error al obtener ausencias pendientes";
				setError(message);
				return [];
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	// Aprobar o rechazar ausencia
	const updateAbsenceStatus = useCallback(
		async (
			idAusencia: number,
			estado: "APROBADO" | "RECHAZADO",
			motivoRechazo?: string,
		): Promise<AusenciaRow | null> => {
			setIsLoading(true);
			setError(null);

			try {
				const updateData: AusenciaUpdate = {
					EstadoAprobacion: estado,
					MotivoRechazo: motivoRechazo || null,
				};

				const { data: ausencia, error } = await supabase
					.from("AUSENCIAS")
					.update(updateData)
					.eq("IdAusencia", idAusencia)
					.select()
					.single();

				if (error) throw error;
				return ausencia;
			} catch (err) {
				const message = err instanceof Error ? err.message : "Error al actualizar ausencia";
				setError(message);
				return null;
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	// Obtener una ausencia por ID
	const getAbsenceById = useCallback(
		async (idAusencia: number): Promise<AusenciaRow | null> => {
			setIsLoading(true);
			setError(null);

			try {
				const { data, error } = await supabase
					.from("AUSENCIAS")
					.select("*, USUARIOS(NombreCompleto, CorreoInstitucional)")
					.eq("IdAusencia", idAusencia)
					.single();

				if (error) throw error;
				return data;
			} catch (err) {
				const message = err instanceof Error ? err.message : "Error al obtener ausencia";
				setError(message);
				return null;
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	return {
		isLoading,
		error,
		createAbsence,
		getUserAbsences,
		getPendingAbsencesForManager,
		updateAbsenceStatus,
		getAbsenceById,
	};
}

// ==================== HOOK PARA EMPLEADOS DE UN JEFE ====================

export function useManagerEmployees() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Obtener empleados de un jefe
	const getManagerEmployees = useCallback(
		async (managerId: number) => {
			setIsLoading(true);
			setError(null);

			try {
				const { data, error } = await supabase
					.from("USUARIOS")
					.select("*, ROLES(*)")
					.eq("IdJefeDirecto", managerId);

				if (error) throw error;
				return data || [];
			} catch (err) {
				const message = err instanceof Error ? err.message : "Error al obtener empleados";
				setError(message);
				return [];
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	// Obtener asistencias de todos los empleados
	const getEmployeesAttendances = useCallback(
		async (managerId: number, limit = 100) => {
			setIsLoading(true);
			setError(null);

			try {
				// Primero obtener los IDs de los empleados
				const { data: empleados, error: errorEmpleados } = await supabase
					.from("USUARIOS")
					.select("IdUsuario, NombreCompleto, CorreoInstitucional")
					.eq("IdJefeDirecto", managerId);

				if (errorEmpleados) throw errorEmpleados;

				if (!empleados || empleados.length === 0) {
					return [];
				}

				const employeeIds = empleados.map((e) => e.IdUsuario);

				// Obtener asistencias de los empleados
				const { data: asistencias, error: errorAsistencias } = await supabase
					.from("ASISTENCIAS")
					.select("*, USUARIOS(NombreCompleto, CorreoInstitucional)")
					.in("IdUsuario", employeeIds)
					.order("FechaHora", { ascending: false })
					.limit(limit);

				if (errorAsistencias) throw errorAsistencias;
				return asistencias || [];
			} catch (err) {
				const message = err instanceof Error ? err.message : "Error al obtener asistencias de empleados";
				setError(message);
				return [];
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	return {
		isLoading,
		error,
		getManagerEmployees,
		getEmployeesAttendances,
	};
}
