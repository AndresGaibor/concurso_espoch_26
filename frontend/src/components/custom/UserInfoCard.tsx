import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface UserInfoCardProps {
	name: string;
	email?: string | null;
	role?: string | null;
	scheduleLabel?: string | null;
	status?: string | null;
	className?: string;
	compact?: boolean;
}

function getInitials(name: string) {
	return name
		.split(" ")
		.slice(0, 2)
		.map((n) => n[0]?.toUpperCase() ?? "")
		.join("");
}

function getRoleBadgeClass(role?: string | null) {
	const r = role?.toUpperCase();
	if (r === "ADMIN")
		return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
	if (r === "MANAGER" || r === "JEFE")
		return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
	return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
}

export function UserInfoCard({
	name,
	email,
	role,
	scheduleLabel,
	status,
	className,
	compact = false,
}: UserInfoCardProps) {
	if (compact) {
		return (
			<div className={cn("flex items-center gap-3", className)}>
				<Avatar className="size-9 border border-border">
					<AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
						{getInitials(name)}
					</AvatarFallback>
				</Avatar>
				<div className="flex-1 min-w-0">
					<p className="text-sm font-medium text-foreground truncate">{name}</p>
					{email && (
						<p className="text-xs text-muted-foreground truncate">{email}</p>
					)}
				</div>
				{role && (
					<Badge
						variant="outline"
						className={cn("text-xs border-0 shrink-0", getRoleBadgeClass(role))}
					>
						{role}
					</Badge>
				)}
			</div>
		);
	}

	return (
		<Card className={cn("gap-4", className)}>
			<CardContent className="pt-5 px-5 pb-5">
				<div className="flex flex-col items-center text-center gap-3">
					<Avatar className="size-16 border-2 border-primary/20">
						<AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
							{getInitials(name)}
						</AvatarFallback>
					</Avatar>
					<div>
						<p className="font-semibold text-foreground">{name}</p>
						{email && <p className="text-sm text-muted-foreground">{email}</p>}
					</div>
					<div className="flex gap-2 flex-wrap justify-center">
						{role && (
							<Badge
								variant="outline"
								className={cn("text-xs border-0", getRoleBadgeClass(role))}
							>
								{role}
							</Badge>
						)}
						{status && (
							<Badge
								variant="outline"
								className="text-xs border-0 status-present"
							>
								{status}
							</Badge>
						)}
					</div>
					{scheduleLabel && (
						<p className="text-xs text-muted-foreground">
							Horario:{" "}
							<span className="font-medium text-foreground">
								{scheduleLabel}
							</span>
						</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
