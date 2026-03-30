import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type AttendanceStatus = "PUNTUAL" | "TARDANZA" | "AUSENTE" | null | undefined;
type ApprovalStatus = "PENDIENTE" | "APROBADO" | "RECHAZADO" | null | undefined;

interface StatusBadgeProps {
  status: AttendanceStatus | ApprovalStatus | string | null | undefined;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  PUNTUAL:   { label: "Puntual",   className: "status-present" },
  TARDANZA:  { label: "Tardanza",  className: "status-late" },
  AUSENTE:   { label: "Ausente",   className: "status-absent" },
  PENDIENTE: { label: "Pendiente", className: "status-pending" },
  APROBADO:  { label: "Aprobado",  className: "status-approved" },
  RECHAZADO: { label: "Rechazado", className: "status-rejected" },
  ACTIVO:    { label: "Activo",    className: "status-present" },
  INACTIVO:  { label: "Inactivo",  className: "status-absent" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const key = status?.toUpperCase() ?? "";
  const config = statusConfig[key] ?? { label: status ?? "—", className: "bg-muted text-muted-foreground" };
  return (
    <Badge
      variant="outline"
      className={cn(
        "border-0 font-medium text-xs px-2 py-0.5 rounded-full",
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
