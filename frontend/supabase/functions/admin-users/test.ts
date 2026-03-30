import { createClient } from "@supabase/supabase-js";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

interface TestResult {
	test: string;
	status: "PASS" | "FAIL";
	details?: string;
}

const testResults: TestResult[] = [];

async function test401SinToken() {
	const res = await fetch(`${supabaseUrl}/functions/v1/admin-users`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			email: "test@test.com",
			password: "password123",
			idRol: 1,
		}),
	});
	const json = await res.json();
	const passed = res.status === 401 && json.error?.includes("Authorization");
	testResults.push({
		test: "401 - Sin token",
		status: passed ? "PASS" : "FAIL",
		details: `Status: ${res.status}`,
	});
}

async function test403NoAdmin() {
	const email = `testnoadmin-${Date.now()}@test.com`;
	const { data: userData } = await supabaseAdmin.auth.admin.createUser({
		email,
		password: "password123",
		email_confirm: true,
	});
	await supabaseAdmin.from("USUARIOS").insert({
		SupabaseUserId: userData.user!.id,
		IdRol: 2,
		NombreCompleto: "Test No Admin",
		CorreoInstitucional: email.toLowerCase(),
		Estado: "ACTIVO",
	});
	const { data: sessionData } = await supabaseAdmin.auth.admin.generateLink({
		type: "magiclink",
		email: email,
	});
	const token = sessionData?.properties?.hashed_token;
	if (!token) {
		testResults.push({
			test: "403 - No admin",
			status: "FAIL",
			details: "No se pudo obtener token",
		});
		return;
	}
	const res = await fetch(`${supabaseUrl}/functions/v1/admin-users`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({
			email: "otro@test.com",
			password: "password123",
			idRol: 1,
		}),
	});
	const json = await res.json();
	const passed = res.status === 403 && json.error?.includes("administrador");
	testResults.push({
		test: "403 - No admin",
		status: passed ? "PASS" : "FAIL",
		details: `Status: ${res.status}`,
	});
}

async function test409EmailDuplicado() {
	const email = `duplicado-${Date.now()}@test.com`;
	await supabaseAdmin.auth.admin.createUser({
		email,
		password: "password123",
		email_confirm: true,
	});
	const { data: sessionData } = await supabaseAdmin.auth.admin.generateLink({
		type: "magiclink",
		email,
	});
	const adminToken = sessionData?.properties?.hashed_token;
	if (!adminToken) {
		testResults.push({
			test: "409 - Email duplicado",
			status: "FAIL",
			details: "No se pudo obtener token",
		});
		return;
	}
	const res = await fetch(`${supabaseUrl}/functions/v1/admin-users`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${adminToken}`,
		},
		body: JSON.stringify({ email, password: "password123", idRol: 1 }),
	});
	const json = await res.json();
	const passed = res.status === 409 && json.error?.includes("registrado");
	testResults.push({
		test: "409 - Email duplicado",
		status: passed ? "PASS" : "FAIL",
		details: `Status: ${res.status}`,
	});
}

async function test201CreacionExitosa() {
	const email = `nuevousuario-${Date.now()}@test.com`;
	const { data: sessionData } = await supabaseAdmin.auth.admin.generateLink({
		type: "magiclink",
		email,
	});
	const adminToken = sessionData?.properties?.hashed_token;
	if (!adminToken) {
		testResults.push({
			test: "201 - Creación exitosa",
			status: "FAIL",
			details: "No se pudo obtener token",
		});
		return;
	}
	const res = await fetch(`${supabaseUrl}/functions/v1/admin-users`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${adminToken}`,
		},
		body: JSON.stringify({
			email,
			password: "password123",
			idRol: 1,
			nombre: "Usuario Nuevo",
		}),
	});
	const json = await res.json();
	const passed = res.status === 201 && json.userId;
	testResults.push({
		test: "201 - Creación exitosa",
		status: passed ? "PASS" : "FAIL",
		details: `Status: ${res.status}, userId: ${json.userId}`,
	});
}

async function runTests() {
	console.log("Iniciando tests del endpoint admin-users...\n");
	await test401SinToken();
	await test403NoAdmin();
	await test409EmailDuplicado();
	await test201CreacionExitosa();
	console.log("\n=== RESULTADOS ===");
	for (const r of testResults) {
		console.log(`${r.status} - ${r.test}${r.details ? ` (${r.details})` : ""}`);
	}
	const passed = testResults.filter((r) => r.status === "PASS").length;
	console.log(`\nTotal: ${passed}/${testResults.length} tests pasados`);
}

runTests();
