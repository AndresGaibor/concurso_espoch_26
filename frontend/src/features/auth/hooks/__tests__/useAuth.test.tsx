import type { Session, User } from "@supabase/supabase-js";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuth } from "../useAuth";

const mocks = vi.hoisted(() => {
	const mockChain = {
		select: vi.fn().mockReturnThis(),
		eq: vi.fn().mockReturnThis(),
		is: vi.fn().mockReturnThis(),
		single: vi.fn(),
		update: vi.fn().mockReturnThis(),
	};

	return {
		mockChain,
		mockSupabase: {
			auth: {
				getSession: vi.fn(),
				onAuthStateChange: vi.fn(),
				signInWithPassword: vi.fn(),
				signInWithOAuth: vi.fn(),
				signOut: vi.fn(),
			},
			from: vi.fn().mockReturnValue(mockChain),
		},
	};
});

const { mockSupabase, mockChain } = mocks;

vi.mock("#/lib/supabase", () => ({
	supabase: mocks.mockSupabase,
}));

describe("useAuth", () => {
	const mockSession: Session = {
		access_token: "test-token",
		refresh_token: "test-refresh",
		expires_in: 3600,
		expires_at: Date.now() + 3600,
		token_type: "bearer",
	} as Session;

	const mockUser: User = {
		id: "user-123",
		email: "test@example.com",
		role: "authenticated",
		aud: "authenticated",
		created_at: "2024-01-01",
		app_metadata: {},
		user_metadata: {},
	} as User;

	const mockRol = {
		IdRol: 1,
		NombreRol: "ADMIN",
		CreatedAt: "2024-01-01",
		Descripcioon: "Administrador",
	};

	const mockUsuarioApp = {
		IdUsuario: 1,
		SupabaseUserId: "user-123",
		CorreoInstitucional: "test@example.com",
		NombreCompleto: "Test User",
		IdRol: 1,
		Estado: "ACTIVO",
		IdJefeDirecto: null,
		CreatedAt: "2024-01-01",
		ROLES: mockRol,
	};

	beforeEach(() => {
		vi.clearAllMocks();
		mockChain.single.mockReset();
	});

	describe("Estado inicial", () => {
		it("debe iniciar con isLoading en true cuando no hay sesion", () => {
			mockSupabase.auth.getSession.mockResolvedValueOnce({
				data: { session: null },
			});
			mockSupabase.auth.onAuthStateChange.mockReturnValueOnce({
				data: { subscription: { unsubscribe: vi.fn() } },
			});

			const { result } = renderHook(() => useAuth());

			expect(result.current.isLoading).toBe(true);
		});

		it("debe iniciar con isAuthenticated en false cuando no hay sesion", () => {
			mockSupabase.auth.getSession.mockResolvedValueOnce({
				data: { session: null },
			});
			mockSupabase.auth.onAuthStateChange.mockReturnValueOnce({
				data: { subscription: { unsubscribe: vi.fn() } },
			});

			const { result } = renderHook(() => useAuth());

			expect(result.current.isAuthenticated).toBe(false);
		});

		it("debe tener session y authUser en null cuando no hay sesion", () => {
			mockSupabase.auth.getSession.mockResolvedValueOnce({
				data: { session: null },
			});
			mockSupabase.auth.onAuthStateChange.mockReturnValueOnce({
				data: { subscription: { unsubscribe: vi.fn() } },
			});

			const { result } = renderHook(() => useAuth());

			expect(result.current.session).toBeNull();
			expect(result.current.authUser).toBeNull();
		});
	});

	describe("Usuario autenticado no-admin", () => {
		it("debe resolver usuario app y rol cuando hay sesion", async () => {
			mockSupabase.auth.getSession.mockResolvedValueOnce({
				data: { session: { ...mockSession, user: mockUser } },
			});
			mockSupabase.auth.onAuthStateChange.mockReturnValueOnce({
				data: { subscription: { unsubscribe: vi.fn() } },
			});
			mockChain.single.mockResolvedValueOnce({
				data: {
					...mockUsuarioApp,
					ROLES: { ...mockRol, NombreRol: "USUARIO" },
				},
			});

			const { result } = renderHook(() => useAuth());

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.isAuthenticated).toBe(true);
			expect(result.current.authUser?.email).toBe("test@example.com");
		});

		it("debe tener isAdmin en false para usuarios no-admin", async () => {
			mockSupabase.auth.getSession.mockResolvedValueOnce({
				data: { session: { ...mockSession, user: mockUser } },
			});
			mockSupabase.auth.onAuthStateChange.mockReturnValueOnce({
				data: { subscription: { unsubscribe: vi.fn() } },
			});
			mockChain.single.mockResolvedValueOnce({
				data: {
					...mockUsuarioApp,
					ROLES: { ...mockRol, NombreRol: "USUARIO" },
				},
			});

			const { result } = renderHook(() => useAuth());

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.isAdmin).toBe(false);
		});
	});

	describe("Usuario autenticado admin", () => {
		it("debe tener isAdmin en true cuando el rol es ADMIN", async () => {
			mockSupabase.auth.getSession.mockResolvedValueOnce({
				data: { session: { ...mockSession, user: mockUser } },
			});
			mockSupabase.auth.onAuthStateChange.mockReturnValueOnce({
				data: { subscription: { unsubscribe: vi.fn() } },
			});
			mockChain.single.mockResolvedValueOnce({
				data: { ...mockUsuarioApp, ROLES: mockRol },
			});

			const { result } = renderHook(() => useAuth());

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.isAdmin).toBe(true);
		});
	});

	describe("signInWithPassword", () => {
		it("debe llamar a supabase.auth.signInWithPassword", async () => {
			mockSupabase.auth.getSession.mockResolvedValueOnce({
				data: { session: null },
			});
			mockSupabase.auth.onAuthStateChange.mockReturnValueOnce({
				data: { subscription: { unsubscribe: vi.fn() } },
			});
			mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
				data: { session: mockSession, user: mockUser },
				error: null,
			});

			const { result } = renderHook(() => useAuth());

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			const signInResult = await result.current.signInWithPassword(
				"test@example.com",
				"password123",
			);

			expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
				email: "test@example.com",
				password: "password123",
			});
			expect(signInResult.success).toBe(true);
			expect(signInResult.error).toBeNull();
		});

		it("debe retornar error cuando falla signIn", async () => {
			mockSupabase.auth.getSession.mockResolvedValueOnce({
				data: { session: null },
			});
			mockSupabase.auth.onAuthStateChange.mockReturnValueOnce({
				data: { subscription: { unsubscribe: vi.fn() } },
			});
			mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
				data: null,
				error: { message: "Invalid credentials" },
			});

			const { result } = renderHook(() => useAuth());

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			const signInResult = await result.current.signInWithPassword(
				"test@example.com",
				"wrong-password",
			);

			expect(signInResult.success).toBe(false);
			expect(signInResult.error?.message).toBe("Invalid credentials");
		});
	});

	describe("signInWithMicrosoft", () => {
		it("debe llamar a signInWithOAuth con provider azure", async () => {
			mockSupabase.auth.getSession.mockResolvedValueOnce({
				data: { session: null },
			});
			mockSupabase.auth.onAuthStateChange.mockReturnValueOnce({
				data: { subscription: { unsubscribe: vi.fn() } },
			});
			mockSupabase.auth.signInWithOAuth.mockResolvedValueOnce({
				data: { url: "https://mock-azure-url" },
				error: null,
			});

			const { result } = renderHook(() => useAuth());

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			await result.current.signInWithMicrosoft();

			expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith(
				expect.objectContaining({
					provider: "azure",
					options: expect.objectContaining({
						scopes: "email",
					}),
				}),
			);
		});
	});

	describe("signOut", () => {
		it("debe llamar a supabase.auth.signOut", async () => {
			mockSupabase.auth.getSession.mockResolvedValueOnce({
				data: { session: null },
			});
			mockSupabase.auth.onAuthStateChange.mockReturnValueOnce({
				data: { subscription: { unsubscribe: vi.fn() } },
			});
			mockSupabase.auth.signOut.mockResolvedValueOnce({ error: null });

			const { result } = renderHook(() => useAuth());

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			await result.current.signOut();

			expect(mockSupabase.auth.signOut).toHaveBeenCalled();
		});
	});
});
