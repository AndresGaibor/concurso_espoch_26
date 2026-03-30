import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface Column<T> {
	key: string;
	header: string;
	cell?: (row: T) => React.ReactNode;
	className?: string;
	headerClassName?: string;
}

interface DataTableProps<T extends Record<string, unknown>> {
	columns: Column<T>[];
	data: T[];
	isLoading?: boolean;
	emptyMessage?: string;
	className?: string;
	rowClassName?: (row: T) => string;
	onRowClick?: (row: T) => void;
}

export function DataTable<T extends Record<string, unknown>>({
	columns,
	data,
	isLoading = false,
	emptyMessage = "No hay datos disponibles.",
	className,
	rowClassName,
	onRowClick,
}: DataTableProps<T>) {
	return (
		<div
			className={cn(
				"rounded-lg border border-border overflow-hidden",
				className,
			)}
		>
			<Table>
				<TableHeader>
					<TableRow className="bg-muted/50 hover:bg-muted/50">
						{columns.map((col) => (
							<TableHead
								key={col.key}
								className={cn(
									"text-xs font-semibold text-muted-foreground uppercase tracking-wide",
									col.headerClassName,
								)}
							>
								{col.header}
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{isLoading ? (
						Array.from({ length: 5 }).map((_, i) => (
							<TableRow key={i}>
								{columns.map((col) => (
									<TableCell key={col.key}>
										<Skeleton className="h-4 w-full" />
									</TableCell>
								))}
							</TableRow>
						))
					) : data.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={columns.length}
								className="h-24 text-center text-muted-foreground text-sm"
							>
								{emptyMessage}
							</TableCell>
						</TableRow>
					) : (
						data.map((row, i) => (
							<TableRow
								key={i}
								className={cn(
									onRowClick && "cursor-pointer",
									rowClassName?.(row),
								)}
								onClick={() => onRowClick?.(row)}
							>
								{columns.map((col) => (
									<TableCell
										key={col.key}
										className={cn("text-sm", col.className)}
									>
										{col.cell ? col.cell(row) : String(row[col.key] ?? "—")}
									</TableCell>
								))}
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}
