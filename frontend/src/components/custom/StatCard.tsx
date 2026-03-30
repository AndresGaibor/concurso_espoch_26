import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
  variant?: "default" | "primary" | "success" | "warning" | "danger";
  className?: string;
}

const variantStyles: Record<string, string> = {
  default:  "border-border",
  primary:  "border-primary/30 bg-primary/5",
  success:  "border-green-200 bg-green-50 dark:border-green-800/40 dark:bg-green-950/20",
  warning:  "border-yellow-200 bg-yellow-50 dark:border-yellow-800/40 dark:bg-yellow-950/20",
  danger:   "border-red-200 bg-red-50 dark:border-red-800/40 dark:bg-red-950/20",
};

const iconVariantStyles: Record<string, string> = {
  default:  "text-muted-foreground bg-muted",
  primary:  "text-primary bg-primary/10",
  success:  "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30",
  warning:  "text-yellow-700 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30",
  danger:   "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30",
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trendLabel,
  variant = "default",
  className,
}: StatCardProps) {
  return (
    <Card className={cn("gap-3 py-5", variantStyles[variant], className)}>
      <CardContent className="px-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide truncate">
              {title}
            </p>
            <p className="mt-1 text-2xl font-bold text-foreground tabular-nums">
              {value}
            </p>
            {(subtitle || trendLabel) && (
              <p className="mt-1 text-xs text-muted-foreground">
                {trendLabel ?? subtitle}
              </p>
            )}
          </div>
          {Icon && (
            <div className={cn("p-2.5 rounded-lg shrink-0", iconVariantStyles[variant])}>
              <Icon className="size-5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
