// Componente: LoginForm — Formulario de login con email/password y Microsoft OAuth
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "#/features/auth/hooks/useAuth";

export function LoginForm() {
	const { signInWithPassword, signInWithMicrosoft } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const handleEmailLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");
		const result = await signInWithPassword(email, password);
		if (!result.success) {
			setError(result.error?.message ?? "Error al iniciar sesión");
			setIsLoading(false);
		}
	};

	const handleMicrosoftLogin = async () => {
		setIsLoading(true);
		setError("");
		await signInWithMicrosoft();
	};

	return (
		<Card className="w-full max-w-sm mx-auto">
			<CardHeader>
				<CardTitle>Iniciar Sesión</CardTitle>
				<CardDescription>
					Usa tu cuenta institucional o Microsoft para acceder
				</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-4">
				<form onSubmit={handleEmailLogin} className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor="email">Correo electrónico</Label>
						<Input
							id="email"
							type="email"
							placeholder="tu@correo.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							disabled={isLoading}
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="password">Contraseña</Label>
						<Input
							id="password"
							type="password"
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							disabled={isLoading}
						/>
					</div>
					{error && (
						<p className="text-sm text-destructive">{error}</p>
					)}
					<Button type="submit" disabled={isLoading}>
						{isLoading ? "Iniciando sesión..." : "Entrar"}
					</Button>
				</form>

				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<span className="w-full border-t" />
					</div>
					<div className="relative flex justify-center text-xs uppercase">
						<span className="bg-card px-2 text-muted-foreground">
							O continúa con
						</span>
					</div>
				</div>

				<Button
					type="button"
					variant="outline"
					disabled={isLoading}
					onClick={handleMicrosoftLogin}
				>
					<MicrosoftIcon className="mr-2 h-4 w-4" />
					Microsoft
				</Button>
			</CardContent>
		</Card>
	);
}

function MicrosoftIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
			<rect x="1" y="1" width="9" height="9" fill="#f25022" />
			<rect x="11" y="1" width="9" height="9" fill="#00a4ef" />
			<rect x="1" y="11" width="9" height="9" fill="#7fba00" />
			<rect x="11" y="11" width="9" height="9" fill="#ffb900" />
		</svg>
	);
}
