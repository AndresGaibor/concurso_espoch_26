// Página de registro de asistencias del empleado
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_auth/app/employee/attendance")({
	component: EmployeeAttendancePage,
});

function EmployeeAttendancePage() {
	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="icon" asChild>
					<Link to="/_auth/app/employee">
						<ArrowLeft className="h-5 w-5" />
					</Link>
				</Button>
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Registrar Asistencia
					</h1>
					<p className="text-muted-foreground">
						Registra tu entrada y salida diaria
					</p>
				</div>
			</div>

			<div className="text-center py-12">
				<p className="text-muted-foreground mb-4">
					Para registrar tu asistencia, utiliza el panel principal del empleado.
				</p>
				<Button asChild>
					<Link to="/_auth/app/employee">Ir al Panel Principal</Link>
				</Button>
			</div>
		</div>
	);
}
