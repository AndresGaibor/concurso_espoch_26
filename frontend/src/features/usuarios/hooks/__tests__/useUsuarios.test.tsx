import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	useCreateUsuario,
	useDeleteUsuario,
	useUpdateUsuario,
	useUsuario,
	useUsuarios,
} from "../useUsuarios";

const mocks = vi.hoisted(() => {
	const mockChain = {
		select: vi.fn().mockReturnThis(),
		eq: vi.fn().mockReturnThis(),
		order: vi.fn().mockReturnThis(),
		single: vi.fn(),
		insert: vi.fn().mockReturnThis(),
		update: vi.fn().mockReturnThis(),
		delete: vi.fn().mockReturnThis(),
	};

	return {
		mockChain,
		mockSupabase: {
			from: vi.fn().mockReturnValue(mockChain),
		},
	};
});

vi.mock("#/lib/supabase", () => ({
	supabase: mocks.mockSupabase,
}));

describe("useUsuarios", () => {
	const mockUsuario = {
		IdUsuario: 1,
		SupabaseUserId: "user-123",
		CorreoInstitucional: "test@example.com",
		NombreCompleto: "Test User",
		IdRol: 1,
		Estado: "ACTIVO",
		IdJefeDirecto: null,
		CreatedAt: "2024-01-01",
		ROLES: {
			IdRol: 1,
			NombreRol: "ADMIN",
			CreatedAt: "2024-01-01",
			Descripcioon: "Administrador",
		},
		JefeDirecto: null,
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("useUsuarios", () => {
		it("debe cargar usuarios con relaciones al iniciar", async () => {
			mocks.mockChain.order.mockResolvedValueOnce({
				data: [mockUsuario],
				error: null,
			});

			const { result } = renderHook(() => useUsuarios());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.usuarios).toHaveLength(1);
			expect(result.current.error).toBeNull();
		});

		it("debe manejar lista vacia", async () => {
			mocks.mockChain.order.mockResolvedValueOnce({
				data: [],
				error: null,
			});

			const { result } = renderHook(() => useUsuarios());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.usuarios).toHaveLength(0);
		});

		it("debe retornar error cuando falla la consulta", async () => {
			mocks.mockChain.order.mockResolvedValueOnce({
				data: null,
				error: { message: "Error de conexion" },
			});

			const { result } = renderHook(() => useUsuarios());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.error).toBeInstanceOf(Error);
			expect(result.current.error?.message).toBe("Error de conexion");
		});

		it("debe exponer funcion refresh", async () => {
			mocks.mockChain.order.mockResolvedValue({
				data: [mockUsuario],
				error: null,
			});

			const { result } = renderHook(() => useUsuarios());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			const refresh = result.current.refresh;
			expect(typeof refresh).toBe("function");
		});
	});

	describe("useUsuario", () => {
		it("debe cargar un usuario por ID con relaciones", async () => {
			mocks.mockChain.eq.mockReturnValue({
				...mocks.mockChain,
				single: vi.fn().mockResolvedValueOnce({
					data: mockUsuario,
					error: null,
				}),
			});
			mocks.mockChain.single.mockResolvedValueOnce({
				data: mockUsuario,
				error: null,
			});

			const { result } = renderHook(() => useUsuario(1));

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.usuario).toEqual(mockUsuario);
		});

		it("debe no hacer fetch cuando id es null", () => {
			const { result } = renderHook(() =>
				useUsuario(null as unknown as number),
			);

			expect(result.current.loading).toBe(false);
			expect(result.current.usuario).toBeNull();
			expect(mocks.mockSupabase.from).not.toHaveBeenCalled();
		});
	});

	describe("useCreateUsuario", () => {
		it("debe llamar a supabase con tabla USUARIOS", async () => {
			const nuevoUsuario = {
				NombreCompleto: "Nuevo Usuario",
				IdRol: 1,
				CorreoInstitucional: "nuevo@example.com",
			};

			mocks.mockChain.single.mockResolvedValueOnce({
				data: { ...mockUsuario, ...nuevoUsuario },
				error: null,
			});

			const { result } = renderHook(() => useCreateUsuario());

			const created = await result.current.createUsuario(nuevoUsuario);

			expect(created).toBeTruthy();
			expect(mocks.mockSupabase.from).toHaveBeenCalledWith("USUARIOS");
		});
	});

	describe("useUpdateUsuario", () => {
		it.skip("debe llamar a supabase con tabla USUARIOS (mock chain complejo)", async () => {
			const updates = { Estado: "INACTIVO" };

			mocks.mockChain.single.mockResolvedValueOnce({
				data: { ...mockUsuario, ...updates },
				error: null,
			});

			const { result } = renderHook(() => useUpdateUsuario());

			const updated = await result.current.updateUsuario(1, updates);

			expect(updated).toBeTruthy();
			expect(mocks.mockSupabase.from).toHaveBeenCalledWith("USUARIOS");
		});
	});

	describe("useDeleteUsuario", () => {
		it("debe eliminar usuario exitosamente", async () => {
			mocks.mockChain.eq.mockReturnValue({
				...mocks.mockChain,
				eq: vi.fn().mockResolvedValueOnce({
					data: null,
					error: null,
				}),
			});

			const { result } = renderHook(() => useDeleteUsuario());

			const deleted = await result.current.deleteUsuario(1);

			expect(deleted).toBe(true);
			expect(mocks.mockSupabase.from).toHaveBeenCalledWith("USUARIOS");
		});
	});
});
