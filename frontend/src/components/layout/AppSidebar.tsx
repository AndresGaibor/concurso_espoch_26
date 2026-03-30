// src/components/layout/AppSidebar.tsx

import { Link, useRouter } from "@tanstack/react-router";
import {
	CalendarOff,
	ChevronUp,
	ClipboardCheck,
	Clock,
	FileCheck,
	History,
	LayoutDashboard,
	LogOut,
	MapPin,
	User,
	Users,
} from "lucide-react";
import { useAuth } from "#/features/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSeparator,
} from "@/components/ui/sidebar";

function getInitials(name: string) {
	return name
		.split(" ")
		.slice(0, 2)
		.map((n) => n[0]?.toUpperCase() ?? "")
		.join("");
}

const employeeLinks = [
	{ to: "/_auth/app/employee/", label: "Inicio", icon: LayoutDashboard },
	{
		to: "/_auth/app/employee/attendance",
		label: "Registrar Asistencia",
		icon: ClipboardCheck,
	},
	{
		to: "/_auth/app/employee/absences",
		label: "Mis Ausencias",
		icon: CalendarOff,
	},
	{ to: "/_auth/app/employee/history", label: "Mi Historial", icon: History },
];

const managerLinks = [
	{ to: "/_auth/app/manager/", label: "Inicio", icon: LayoutDashboard },
	{ to: "/_auth/app/manager/requests", label: "Solicitudes", icon: FileCheck },
	{
		to: "/_auth/app/manager/history",
		label: "Historial Equipo",
		icon: History,
	},
];

const adminLinks = [
	{ to: "/_auth/app/admin/", label: "Inicio", icon: LayoutDashboard },
	{ to: "/_auth/app/admin/users", label: "Usuarios", icon: Users },
	{ to: "/_auth/app/admin/schedules", label: "Horarios", icon: Clock },
	{ to: "/_auth/app/admin/locations", label: "Ubicaciones", icon: MapPin },
	{
		to: "/_auth/app/admin/attendances",
		label: "Asistencias",
		icon: ClipboardCheck,
	},
	{ to: "/_auth/app/admin/absences", label: "Ausencias", icon: CalendarOff },
];

export function AppSidebar() {
	const { usuarioApp, rol, signOut } = useAuth();
	const router = useRouter();

	const isAdmin = rol?.NombreRol.toUpperCase() === "ADMIN";
	const isManager = rol?.NombreRol.toUpperCase() === "MANAGER";

	const name = usuarioApp?.NombreCompleto ?? "Usuario";
	const email = usuarioApp?.CorreoInstitucional ?? "";
	const roleName = rol?.NombreRol ?? "";

	const links = isAdmin ? adminLinks : isManager ? managerLinks : employeeLinks;
	const groupLabel = isAdmin
		? "Administración"
		: isManager
			? "Gestión"
			: "Mi Espacio";

	return (
		<Sidebar variant="inset">
			<SidebarHeader className="pb-0">
				<div className="flex items-center gap-2 px-2 py-3">
					<div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold shrink-0">
						E
					</div>
					<div className="flex-1 min-w-0">
						<p className="text-sm font-semibold leading-none truncate">
							ESPOCH
						</p>
						<p className="text-xs text-muted-foreground truncate">
							Control de Asistencias
						</p>
					</div>
				</div>
			</SidebarHeader>

			<SidebarSeparator />

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>
					<SidebarMenu>
						{links.map(({ to, label, icon: Icon }) => (
							<SidebarMenuItem key={to}>
								<SidebarMenuButton asChild tooltip={label}>
									<Link
										to={to}
										activeProps={{
											className:
												"bg-sidebar-accent text-sidebar-accent-foreground font-medium",
										}}
									>
										<Icon />
										<span>{label}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>

				<SidebarGroup className="mt-auto">
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton asChild tooltip="Mi Perfil">
								<Link to="/_auth/app/profile">
									<User />
									<span>Mi Perfil</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>

			<SidebarSeparator />

			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton
									size="lg"
									className="data-[state=open]:bg-sidebar-accent"
								>
									<Avatar className="size-8 rounded-lg border border-border">
										<AvatarFallback className="rounded-lg text-xs font-semibold bg-primary/10 text-primary">
											{getInitials(name)}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1 min-w-0 text-left leading-tight">
										<p className="text-sm font-semibold truncate">{name}</p>
										<p className="text-xs text-muted-foreground truncate">
											{email}
										</p>
									</div>
									<ChevronUp className="ml-auto size-4 text-muted-foreground" />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent side="top" align="start" className="w-56">
								<div className="px-2 py-1.5">
									<p className="text-sm font-medium">{name}</p>
									<p className="text-xs text-muted-foreground">{roleName}</p>
								</div>
								<DropdownMenuSeparator />
								<DropdownMenuItem asChild>
									<Link to="/_auth/app/profile">
										<User className="size-4" />
										Mi Perfil
									</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									className="text-destructive focus:text-destructive"
									onClick={async () => {
										await signOut();
										router.navigate({ to: "/login" });
									}}
								>
									<LogOut className="size-4" />
									Cerrar Sesión
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
