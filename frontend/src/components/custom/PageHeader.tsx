import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
	title: string;
	description?: string;
	icon?: LucideIcon;
	actions?: React.ReactNode;
	className?: string;
}

export function PageHeader({
	title,
	description,
	icon: Icon,
	actions,
	className,
}: PageHeaderProps) {
	return (
		<div
			className={cn("flex items-start justify-between gap-4 pb-6", className)}
		>
			<div className="flex items-center gap-3">
				{Icon && (
					<div className="p-2 rounded-lg bg-primary/10">
						<Icon className="size-5 text-primary" />
					</div>
				)}
				<div>
					<h1 className="text-xl font-semibold text-foreground">{title}</h1>
					{description && (
						<p className="text-sm text-muted-foreground mt-0.5">
							{description}
						</p>
					)}
				</div>
			</div>
			{actions && (
				<div className="flex items-center gap-2 shrink-0">{actions}</div>
			)}
		</div>
	);
}
