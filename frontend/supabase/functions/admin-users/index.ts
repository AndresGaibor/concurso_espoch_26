import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

interface RequestBody {
	email: string;
	password: string;
	idRol: number;
	nombre?: string;
	user_metadata?: Record<string, unknown>;
}

interface Claims {
	sub: string;
	email?: string;
	aud: string;
}

async function obtenerUsuarioDesdeToken(
	token: string,
): Promise<{ user: Claims | null; error: string | null }> {
	try {
		const supabase = createClient(supabaseUrl, anonKey);
		const { data, error } = await supabase.auth.getUser(token);

		if (error || !data.user) {
			return { user: null, error: "Token inválido o expirado" };
		}

		return {
			user: { sub: data.user.id, email: data.user.email, aud: data.user.aud },
			error: null,
		};
	} catch (e) {
		console.error("Error validando token:", e);
		return { user: null, error: "Error validando autenticación" };
	}
}

async function verificarEsAdmin(supabaseUserId: string): Promise<boolean> {
	const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
	const { data, error } = await supabaseAdmin
		.from("USUARIOS")
		.select("IdRol, ROLES!inner(NombreRol)")
		.eq("SupabaseUserId", supabaseUserId)
		.single();

	if (error || !data) {
		console.error("Error consultando USUARIOS:", error);
		return false;
	}

	const nombreRol = data.ROLES?.NombreRol?.toUpperCase();
	return nombreRol === "ADMIN" || data.IdRol === 1;
}

async function emailExiste(email: string): Promise<boolean> {
	const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
	const { data } = await supabaseAdmin
		.from("USUARIOS")
		.select("SupabaseUserId")
		.eq("CorreoInstitucional", email.toLowerCase())
		.single();

	return !!data;
}

async function crearUsuarioAdmin(
	email: string,
	password: string,
	idRol: number,
	nombre: string,
	user_metadata?: Record<string, unknown>,
): Promise<{
	success: boolean;
	userId?: string;
	error?: string;
	statusCode: number;
}> {
	const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

	const { data: authData, error: authError } =
		await supabaseAdmin.auth.admin.createUser({
			email: email.toLowerCase(),
			password,
			email_confirm: true,
			user_metadata: { nombre, ...user_metadata },
			app_metadata: { role: "usuario" },
		});

	if (authError) {
		if (authError.message.includes("already been registered")) {
			return {
				success: false,
				error: "El email ya está registrado",
				statusCode: 409,
			};
		}
		return {
			success: false,
			error: `Error creando usuario: ${authError.message}`,
			statusCode: 400,
		};
	}

	const supabaseUserId = authData.user!.id;

	const { error: dbError } = await supabaseAdmin.from("USUARIOS").insert({
		SupabaseUserId: supabaseUserId,
		IdRol: idRol,
		NombreCompleto: nombre,
		CorreoInstitucional: email.toLowerCase(),
		Estado: "ACTIVO",
	});

	if (dbError) {
		console.error(
			"CRÍTICO: Usuario Auth creado pero falla insert en USUARIOS:",
			dbError,
		);
		console.error("SupabaseUserId huérfano:", supabaseUserId);
		return {
			success: false,
			error: "Error interno al registrar usuario",
			statusCode: 500,
		};
	}

	return { success: true, userId: supabaseUserId, statusCode: 201 };
}

Deno.serve(async (req: Request) => {
	if (req.method !== "POST") {
		return Response.json(
			{ error: "Método no permitido. Use POST." },
			{ status: 405 },
		);
	}

	const authHeader = req.headers.get("Authorization");
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return Response.json(
			{ error: "Authorization header faltante" },
			{ status: 401 },
		);
	}

	const token = authHeader.replace("Bearer ", "").trim();
	if (!token) {
		return Response.json({ error: "Token JWT faltante" }, { status: 401 });
	}

	const { user: caller, error: authError } =
		await obtenerUsuarioDesdeToken(token);
	if (authError || !caller) {
		return Response.json(
			{ error: authError ?? "Token inválido" },
			{ status: 401 },
		);
	}

	const esAdmin = await verificarEsAdmin(caller.sub);
	if (!esAdmin) {
		return Response.json(
			{ error: "Acceso denegado. Se requiere rol de administrador." },
			{ status: 403 },
		);
	}

	let body: RequestBody;
	try {
		body = await req.json();
	} catch {
		return Response.json({ error: "Body inválido" }, { status: 400 });
	}

	const { email, password, idRol, nombre = "", user_metadata } = body;

	if (!email || typeof email !== "string") {
		return Response.json({ error: "Email es requerido" }, { status: 400 });
	}

	if (!password || typeof password !== "string" || password.length < 8) {
		return Response.json(
			{ error: "Password debe tener al menos 8 caracteres" },
			{ status: 400 },
		);
	}

	if (!idRol || typeof idRol !== "number" || idRol < 1) {
		return Response.json({ error: "IdRol inválido" }, { status: 400 });
	}

	if (await emailExiste(email)) {
		return Response.json(
			{ error: "El email ya está registrado" },
			{ status: 409 },
		);
	}

	const resultado = await crearUsuarioAdmin(
		email,
		password,
		idRol,
		nombre,
		user_metadata,
	);

	if (!resultado.success) {
		return Response.json(
			{ error: resultado.error },
			{ status: resultado.statusCode },
		);
	}

	return Response.json(
		{
			message: "Usuario creado exitosamente",
			userId: resultado.userId,
			email: email.toLowerCase(),
			idRol,
		},
		{ status: 201 },
	);
});
