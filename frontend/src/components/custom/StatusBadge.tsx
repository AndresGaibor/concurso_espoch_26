import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type AttendanceStatus = "PUNTUAL" | "TARDANZA" | "AUSENTE" | null | undefined;
type ApprovalStatus = "PENDIENTE" | "APROBADO" | "RECHAZADO" | null | undefined;

interface StatusBadgeProps {
	status?: AttendanceStatus | ApprovalStatus | string | null | undefined;
	variant?: "success" | "warning" | "destructive" | "secondary" | "default";
	children?: ReactNode;
	className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
	PUNTUAL: { label: "Puntual", className: "status-present" },
	TARDANZA: { label: "Tardanza", className: "status-late" },
	AUSENTE: { label: "Ausente", className: "status-absent" },
	PENDIENTE: { label: "Pendiente", className: "status-pending" },
	APROBADO: { label: "Aprobado", className: "status-approved" },
	RECHAZADO: { label: "Rechazado", className: "status-rejected" },
	ACTIVO: { label: "Activo", className: "status-present" },
	INACTIVO: { label: "Inactivo", className: "status-absent" },
};

const variantConfig: Record<string, { label: string; className: string }> = {
	success: { label: "", className: "status-present" },
	warning: { label: "", className: "status-late" },
	destructive: { label: "", className: "status-rejected" },
	secondary: { label: "", className: "status-pending" },
	default: { label: "", className: "bg-muted text-muted-foreground" },
};

export function StatusBadge({
	status,
	variant,
	children,
	className,
}: StatusBadgeProps) {
	let config;
	if (variant && variantConfig[variant]) {
		config = variantConfig[variant];
	} else {
		const key = status?.toUpperCase() ?? "";
		config = statusConfig[key] ?? {
			label: status ?? "—",
			className: "bg-muted text-muted-foreground",
		};
	}

	const label = children?.toString() ?? config.label;

	return (
		<Badge
			variant="outline"
			className={cn(
				"border-0 font-medium text-xs px-2 py-0.5 rounded-full",
				config.className,
				className,
			)}
		>
			{label}
		</Badge>
	);
}
