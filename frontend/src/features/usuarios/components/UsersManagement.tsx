import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Avatar,
	AvatarFallback,
	AvatarGroup,
	AvatarGroupCount,
} from "@/components/ui/avatar";
import {
	Ban,
	CheckCircle,
	Edit,
	MoreHorizontal,
	Plus,
	Search,
	ShieldUser,
	TrendingUp,
	Upload,
	Users,
} from "lucide-react";
import { useState } from "react";
import { useUsuarios, type UsuarioEnriched } from "../hooks/useUsuarios";

type StatusFilter = "all" | "active" | "inactive";
type RoleFilter = "all" | string;

type Usuario = UsuarioEnriched[number];

function getInitials(name: string): string {
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
}

function getStatusBadge(estado: string | null) {
	const status = estado?.toLowerCase();
	if (status === "activo" || status === "aprobado") {
		return (
			<Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
				Aprobado
			</Badge>
		);
	}
	if (status === "rechazado") {
		return (
			<Badge className="bg-red-100 text-red-800 hover:bg-red-100">
				Rechazado
			</Badge>
		);
	}
	return (
		<Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
			Pendiente
		</Badge>
	);
}

function isActiveUser(estado: string | null): boolean {
	const status = estado?.toLowerCase();
	return status === "activo" || status === "aprobado";
}

function UserTableRow({
	usuario,
	onEdit,
	onAssignManager,
	onToggleStatus,
}: {
	usuario: Usuario;
	onEdit?: () => void;
	onAssignManager?: () => void;
	onToggleStatus?: () => void;
}) {
	const initials = getInitials(usuario.NombreCompleto ?? usuario.CorreoInstitucional ?? "U");
	const jefeDirecto = usuario.JefeDirecto?.[0];

	return (
		<TableRow className="group">
			<TableCell>
				<div className="flex items-center gap-3">
					<Avatar size="lg">
						<AvatarFallback className="bg-primary/10 text-primary font-bold">
							{initials}
						</AvatarFallback>
					</Avatar>
					<span className="font-semibold text-primary">
						{usuario.NombreCompleto ?? usuario.CorreoInstitucional?.split("@")[0]}
					</span>
				</div>
			</TableCell>
			<TableCell className="text-sm text-muted-foreground">
				{usuario.CorreoInstitucional}
			</TableCell>
			<TableCell>
				<Badge variant="secondary">{usuario.ROLES?.NombreRol ?? "Sin rol"}</Badge>
			</TableCell>
			<TableCell className="text-sm text-muted-foreground">
				{jefeDirecto?.NombreCompleto ?? "Sin asignar"}
			</TableCell>
			<TableCell className="text-xs text-muted-foreground">
				Horario no definido
			</TableCell>
			<TableCell>{getStatusBadge(usuario.Estado)}</TableCell>
			<TableCell className="text-right">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon-xs" className="h-8 w-8">
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={onEdit}>
							<Edit className="mr-2 h-4 w-4" />
							Editar
						</DropdownMenuItem>
						<DropdownMenuItem onClick={onAssignManager}>
							<Users className="mr-2 h-4 w-4" />
							Asignar jefe
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={onToggleStatus}
							className="text-destructive focus:text-destructive"
						>
							{isActiveUser(usuario.Estado) ? (
								<>
									<Ban className="mr-2 h-4 w-4" />
									Desactivar
								</>
							) : (
								<>
									<CheckCircle className="mr-2 h-4 w-4" />
									Activar
								</>
							)}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</TableCell>
		</TableRow>
	);
}

export function UsersManagement() {
	const { usuarios, loading, error } = useUsuarios();
	const [search, setSearch] = useState("");
	const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

	const filteredUsers = usuarios.filter((user) => {
		const matchesSearch =
			!search ||
			user.NombreCompleto?.toLowerCase().includes(search.toLowerCase()) ||
			user.CorreoInstitucional?.toLowerCase().includes(search.toLowerCase());

		const matchesRole =
			roleFilter === "all" || user.ROLES?.NombreRol === roleFilter;

		const matchesStatus =
			statusFilter === "all" ||
			(statusFilter === "active" && isActiveUser(user.Estado)) ||
			(statusFilter === "inactive" && !isActiveUser(user.Estado));

		return matchesSearch && matchesRole && matchesStatus;
	});

	const activeCount = usuarios.filter((u) => isActiveUser(u.Estado)).length;
	const pendingCount = usuarios.filter((u) => !isActiveUser(u.Estado)).length;
	const uniqueRoles = [...new Set(usuarios.map((u) => u.ROLES?.NombreRol))].filter(
		Boolean,
	);

	if (error) {
		return (
			<div className="flex items-center justify-center p-8">
				<p className="text-destructive">Error al cargar usuarios: {error.message}</p>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex items-end justify-between">
				<div>
					<nav className="mb-2 flex gap-2 text-xs uppercase tracking-wider text-muted-foreground">
						<span>Administración</span>
						<span>/</span>
						<span className="font-bold text-primary">Gestión de Usuarios</span>
					</nav>
					<h1 className="text-4xl font-bold tracking-tight text-primary">
						Administrar Usuarios
					</h1>
					<p className="mt-2 max-w-lg text-muted-foreground">
						Control centralizado de personal académico y administrativo.
					</p>
				</div>
				<Button className="gap-2 shadow-lg">
					<Plus className="h-4 w-4" />
					Crear Usuario
				</Button>
			</div>

			{/* Filter Bar */}
			<div className="grid grid-cols-12 gap-4">
				<div className="col-span-12 lg:col-span-6">
					<div className="flex items-center gap-2 rounded-lg border bg-background p-1 shadow-sm">
						<div className="px-3 text-muted-foreground">
							<Search className="h-4 w-4" />
						</div>
						<Input
							className="border-0 shadow-none focus-visible:ring-0"
							placeholder="Buscar por nombre o email..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
						<kbd className="mr-2 rounded bg-muted px-2 py-1 text-[10px] text-muted-foreground">
							⌘ K
						</kbd>
					</div>
				</div>
				<div className="col-span-6 lg:col-span-3">
					<div className="flex items-center gap-2 rounded-lg border bg-background p-1 shadow-sm">
						<div className="px-3 text-muted-foreground">
							<ShieldUser className="h-4 w-4" />
						</div>
						<Select value={roleFilter} onValueChange={setRoleFilter}>
							<SelectTrigger className="border-0 shadow-none focus:ring-0">
								<SelectValue placeholder="Todos los roles" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Todos los roles</SelectItem>
								{uniqueRoles.map((role) => (
									<SelectItem key={role} value={role ?? ""}>
										{role}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
				<div className="col-span-6 lg:col-span-3">
					<div className="flex items-center gap-2 rounded-lg border bg-background p-1 shadow-sm">
						<div className="px-3 text-muted-foreground">
							<CheckCircle className="h-4 w-4" />
						</div>
						<Select
							value={statusFilter}
							onValueChange={(v) => setStatusFilter(v as StatusFilter)}
						>
							<SelectTrigger className="border-0 shadow-none focus:ring-0">
								<SelectValue placeholder="Todos los estados" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Todos los estados</SelectItem>
								<SelectItem value="active">Aprobado</SelectItem>
								<SelectItem value="inactive">Pendiente</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			{/* Data Table */}
			<div className="rounded-xl border bg-card shadow-sm overflow-hidden">
				<Table>
					<TableHeader>
						<TableRow className="bg-muted/50 hover:bg-muted/50">
							<TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
								Nombre
							</TableHead>
							<TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
								Email
							</TableHead>
							<TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
								Rol
							</TableHead>
							<TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
								Jefe Directo
							</TableHead>
							<TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
								Horario
							</TableHead>
							<TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
								Estado
							</TableHead>
							<TableHead className="text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">
								Acciones
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell colSpan={7} className="h-24 text-center">
									Cargando usuarios...
								</TableCell>
							</TableRow>
						) : filteredUsers.length === 0 ? (
							<TableRow>
								<TableCell colSpan={7} className="h-24 text-center">
									No se encontraron usuarios.
								</TableCell>
							</TableRow>
						) : (
							filteredUsers.map((user) => (
								<UserTableRow
									key={user.SupabaseUserId}
									usuario={user}
								/>
							))
						)}
					</TableBody>
				</Table>
				<div className="flex items-center justify-between border-t bg-muted/30 p-4 text-xs text-muted-foreground">
					<p>
						Mostrando {filteredUsers.length} de {usuarios.length} usuarios
					</p>
					<div className="flex gap-1">
						<Button variant="outline" size="sm" disabled>
							Anterior
						</Button>
						<Button variant="outline" size="sm" className="font-bold">
							1
						</Button>
						<Button variant="outline" size="sm" disabled>
							Siguiente
						</Button>
					</div>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-12 gap-6">
				<div className="col-span-12 md:col-span-4 relative overflow-hidden rounded-xl bg-primary p-6 text-primary-foreground shadow-lg">
					<Users className="absolute -right-2 -bottom-2 h-24 w-24 opacity-10" />
					<p className="text-xs uppercase tracking-wider opacity-70">
						Usuarios Activos
					</p>
					<h3 className="text-3xl font-bold">{activeCount}</h3>
					<p className="mt-4 flex items-center gap-1 text-xs">
						<TrendingUp className="h-3 w-3" />
						Panel de administración
					</p>
				</div>
				<div className="col-span-12 md:col-span-4 rounded-xl border bg-secondary/10 p-6 shadow-sm">
					<p className="text-xs uppercase tracking-wider text-muted-foreground">
						Pendientes de Validación
					</p>
					<h3 className="text-3xl font-bold text-primary">{pendingCount}</h3>
					<div className="mt-4 flex -space-x-2">
						<AvatarGroup>
							{filteredUsers
								.filter((u) => !isActiveUser(u.Estado))
								.slice(0, 3)
								.map((user) => (
									<Avatar key={user.SupabaseUserId} size="sm">
										<AvatarFallback className="bg-muted text-xs">
											{getInitials(user.NombreCompleto ?? user.CorreoInstitucional ?? "U")}
										</AvatarFallback>
									</Avatar>
								))}
							{pendingCount > 3 && (
								<AvatarGroupCount>
									+{pendingCount - 3}
								</AvatarGroupCount>
							)}
						</AvatarGroup>
					</div>
				</div>
				<div className="col-span-12 md:col-span-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/30 p-6 text-center transition-colors hover:bg-muted/50">
					<Upload className="mb-2 h-8 w-8 text-primary" />
					<h4 className="font-bold text-primary">Importar en lote</h4>
					<p className="text-xs text-muted-foreground">
						Subir archivo CSV o XLSX
					</p>
				</div>
			</div>
		</div>
	);
}
