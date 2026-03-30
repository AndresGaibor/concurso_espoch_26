// PortalLogin — Página de login estilo institucional Norbert Wiener EX

import { useAuth } from "#/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MicrosoftIcon = ({ className }: { className?: string }) => (
	<svg
		className={className}
		viewBox="0 0 21 21"
		xmlns="http://www.w3.org/2000/svg"
	>
		<rect x="1" y="1" width="9" height="9" fill="#f25022" />
		<rect x="11" y="1" width="9" height="9" fill="#00a4ef" />
		<rect x="1" y="11" width="9" height="9" fill="#7fba00" />
		<rect x="11" y="11" width="9" height="9" fill="#ffb900" />
	</svg>
);

const Icon = ({
	name,
	className,
}: {
	name:
		| "school"
		| "verified_user"
		| "speed"
		| "account_balance"
		| "help_outline"
		| "lock_reset"
		| "language"
		| "keyboard_arrow_down"
		| "arrow_forward";
	className?: string;
}) => (
	<span className={cn("material-symbols-outlined", className)}>{name}</span>
);

export function PortalLogin() {
	const { signInWithMicrosoft } = useAuth();

	return (
		<div className="min-h-screen flex flex-col relative overflow-hidden bg-background">
			{/* Background Decoration */}
			<div className="absolute inset-0 -z-10 overflow-hidden">
				<div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full blur-[120px] bg-blue-100/50" />
				<div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full blur-[150px] bg-sky-100/40" />
			</div>

			{/* Main Content */}
			<main className="flex-grow flex items-center justify-center p-6 sm:p-12">
				<div className="w-full max-w-[1100px] grid lg:grid-cols-2 gap-0 overflow-hidden rounded-xl shadow-2xl bg-white">
					{/* Left Side: Institutional Branding */}
					<div className="hidden lg:flex flex-col justify-between p-12 from-blue-900 to-blue-800 text-white relative">
						{/* Gradient Background */}
						<div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-blue-800" />

						{/* Abstract Shape Decor */}
						<div className="absolute bottom-0 right-0 w-64 h-64 opacity-10 pointer-events-none">
							<svg viewBox="0 0 200 200" className="w-full h-full">
								<defs>
									<linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
										<stop offset="0%" stopColor="white" />
										<stop offset="100%" stopColor="white" stopOpacity="0" />
									</linearGradient>
								</defs>
								<polygon points="200,0 200,200 0,200" fill="url(#grad)" />
								<line
									x1="200"
									y1="0"
									x2="0"
									y2="200"
									stroke="white"
									strokeWidth="0.5"
								/>
								<line
									x1="150"
									y1="0"
									x2="0"
									y2="150"
									stroke="white"
									strokeWidth="0.5"
								/>
								<line
									x1="100"
									y1="0"
									x2="0"
									y2="100"
									stroke="white"
									strokeWidth="0.5"
								/>
							</svg>
						</div>

						<div className="relative z-10">
							<div className="flex items-center gap-3 mb-16">
								<div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg">
									<Icon name="school" className="text-blue-900 text-2xl" />
								</div>
								<span className="font-headline font-extrabold text-xl tracking-tight">
									Norbert Wiener EX
								</span>
							</div>
							<h1 className="font-headline text-4xl font-extrabold leading-tight mb-6">
								Academic Precision &<br />
								Professional Excellence.
							</h1>
							<p className="text-blue-100/80 text-lg font-light leading-relaxed max-w-md">
								Bienvenido al ecosistema digital diseñado para potenciar el
								talento y la gestión de nuestra comunidad universitaria.
							</p>
						</div>

						<div className="relative z-10 mt-12 grid grid-cols-2 gap-4">
							<div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
								<Icon
									name="verified_user"
									className="text-blue-100 block mb-2"
								/>
								<span className="block text-xs font-medium uppercase tracking-widest text-blue-100/60 mb-1">
									Seguridad
								</span>
								<span className="text-sm font-medium">Protocolos M365</span>
							</div>
							<div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
								<Icon name="speed" className="text-blue-100 block mb-2" />
								<span className="block text-xs font-medium uppercase tracking-widest text-blue-100/60 mb-1">
									Rendimiento
								</span>
								<span className="text-sm font-medium">Acceso Inmediato</span>
							</div>
						</div>
					</div>

					{/* Right Side: Login Interaction */}
					<div className="p-8 sm:p-16 flex flex-col justify-center bg-white">
						{/* Mobile Logo */}
						<div className="lg:hidden flex justify-center mb-10">
							<div className="flex flex-col items-center">
								<Icon
									name="account_balance"
									className="text-blue-900 text-5xl mb-2"
								/>
								<span className="font-headline font-extrabold text-2xl tracking-tight text-blue-900">
									Norbert Wiener EX
								</span>
							</div>
						</div>

						<div className="max-w-md mx-auto w-full">
							<div className="mb-10 text-center lg:text-left">
								<h2 className="font-headline text-2xl font-bold text-blue-900 mb-2">
									Portal Colaborador
								</h2>
								<p className="text-slate-600 font-body">
									Inicie sesión con su cuenta institucional para continuar.
								</p>
							</div>

							{/* M365 Login Button */}
							<div className="space-y-6">
								<Button
									onClick={() => signInWithMicrosoft()}
									className="w-full flex items-center justify-center gap-4 bg-blue-900 text-white py-4 px-6 rounded-xl hover:bg-blue-800 transition-all active:scale-[0.98] group shadow-md shadow-blue-900/10"
								>
									<MicrosoftIcon className="w-5 h-5" />
									<span className="font-semibold text-sm">
										Iniciar Sesión con Microsoft 365
									</span>
									<Icon
										name="arrow_forward"
										className="text-sm group-hover:translate-x-1 transition-transform"
									/>
								</Button>

								<div className="relative flex py-4 items-center">
									<div className="flex-grow border-t border-slate-200" />
									<span className="flex-shrink mx-4 text-xs uppercase tracking-widest text-slate-400">
										Información
									</span>
									<div className="flex-grow border-t border-slate-200" />
								</div>

								{/* Secondary Links Grid */}
								<div className="grid grid-cols-1 gap-4">
									<a
										href="#"
										className="flex items-center gap-3 p-4 rounded-xl hover:bg-slate-50 transition-colors group"
									>
										<div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 group-hover:bg-blue-100 transition-colors">
											<Icon name="help_outline" className="text-xl" />
										</div>
										<div>
											<p className="text-sm font-semibold text-slate-900">
												Centro de Ayuda
											</p>
											<p className="text-xs text-slate-500">
												Guías y soporte técnico
											</p>
										</div>
									</a>

									<a
										href="#"
										className="flex items-center gap-3 p-4 rounded-xl hover:bg-slate-50 transition-colors group"
									>
										<div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 group-hover:bg-blue-100 transition-colors">
											<Icon name="lock_reset" className="text-xl" />
										</div>
										<div>
											<p className="text-sm font-semibold text-slate-900">
												Recuperar Acceso
											</p>
											<p className="text-xs text-slate-500">
												Restablecer contraseña institucional
											</p>
										</div>
									</a>
								</div>
							</div>

							{/* Footer Options */}
							<div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-200 pt-8">
								<div className="flex items-center gap-2 group cursor-pointer">
									<Icon name="language" className="text-slate-400 text-lg" />
									<span className="text-sm font-medium text-slate-500 group-hover:text-blue-700 transition-colors">
										Español (Perú)
									</span>
									<Icon
										name="keyboard_arrow_down"
										className="text-slate-400 text-sm"
									/>
								</div>
								<div className="flex items-center gap-4">
									<a
										href="#"
										className="text-xs font-medium text-slate-400 hover:text-blue-700 transition-colors underline underline-offset-4 decoration-slate-200"
									>
										Privacidad
									</a>
									<a
										href="#"
										className="text-xs font-medium text-slate-400 hover:text-blue-700 transition-colors underline underline-offset-4 decoration-slate-200"
									>
										Términos
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>

			{/* Global Footer Branding */}
			<footer className="p-8 text-center">
				<p className="text-xs uppercase tracking-widest text-slate-400">
					© 2024 Universidad Norbert Wiener | Todos los derechos reservados.
				</p>
				<div className="mt-2 flex justify-center gap-6">
					<span className="text-[10px] text-slate-300">
						Versión 2.4.0-Academic
					</span>
					<span className="text-[10px] text-slate-300">
						Precisión y Servicio
					</span>
				</div>
			</footer>
		</div>
	);
}
