import { createFileRoute } from "@tanstack/react-router";
import {
	Calendar,
	Download,
	Filter,
	Gauge,
	List,
	MapPin,
	MapPinCheck,
	Search,
	TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
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

export const Route = createFileRoute("/_auth/app/admin/attendances")({
	component: AttendancesPage,
});

interface AttendanceRecord {
	id: string;
	employeeId: string;
	employeeName: string;
	initials: string;
	date: string;
	entryTime: string;
	exitTime: string;
	location: string;
	latitude: number;
	longitude: number;
	accuracy: number;
	status: "punctual" | "late" | "out-of-bounds";
}

const mockData: AttendanceRecord[] = [
	{
		id: "1",
		employeeId: "44920",
		employeeName: "Julian Ramirez",
		initials: "JR",
		date: "Oct 19, 2023",
		entryTime: "08:02",
		exitTime: "17:15",
		location: "Lima Norte - Block B",
		latitude: -12.0464,
		longitude: -77.0428,
		accuracy: 14,
		status: "punctual",
	},
	{
		id: "2",
		employeeId: "39811",
		employeeName: "Maria Alva",
		initials: "MA",
		date: "Oct 19, 2023",
		entryTime: "08:45",
		exitTime: "17:00",
		location: "Lima Sur - Main Gate",
		latitude: -12.1147,
		longitude: -77.0282,
		accuracy: 82,
		status: "late",
	},
	{
		id: "3",
		employeeId: "55219",
		employeeName: "Eduardo Tello",
		initials: "ET",
		date: "Oct 18, 2023",
		entryTime: "07:55",
		exitTime: "16:30",
		location: "Arequipa Central",
		latitude: -16.409,
		longitude: -71.5375,
		accuracy: 342,
		status: "out-of-bounds",
	},
	{
		id: "4",
		employeeId: "41002",
		employeeName: "Sofia Castro",
		initials: "SC",
		date: "Oct 18, 2023",
		entryTime: "08:00",
		exitTime: "17:05",
		location: "Lima Norte - Lab 4",
		latitude: -12.0465,
		longitude: -77.043,
		accuracy: 4,
		status: "punctual",
	},
];

function AttendancesPage() {
	const [dateRange, setDateRange] = useState("Oct 12 - Oct 19, 2023");
	const [employeeSearch, setEmployeeSearch] = useState("");
	const [campus, setCampus] = useState("all");

	const getStatusBadge = (status: AttendanceRecord["status"]) => {
		switch (status) {
			case "punctual":
				return (
					<Badge variant="secondary" className="bg-primary/10 text-primary">
						Punctual
					</Badge>
				);
			case "late":
				return (
					<Badge variant="secondary" className="bg-secondary/10 text-secondary">
						Late
					</Badge>
				);
			case "out-of-bounds":
				return (
					<Badge
						variant="destructive"
						className="bg-error-container text-error"
					>
						Out of Bounds
					</Badge>
				);
		}
	};

	const getAccuracyBadge = (accuracy: number) => {
		if (accuracy < 100) {
			return (
				<div className="flex items-center gap-1.5 text-primary">
					<MapPinCheck className="h-4 w-4" />
					<span className="text-xs font-bold">{accuracy}m</span>
					<span className="text-[9px] bg-primary/10 px-1.5 rounded-full uppercase tracking-tighter">
						&lt;100m
					</span>
				</div>
			);
		}
		return (
			<div className="flex items-center gap-1.5 text-error">
				<Filter className="h-4 w-4" />
				<span className="text-xs font-bold">{accuracy}m</span>
				<span className="text-[9px] bg-error/10 px-1.5 rounded-full uppercase tracking-tighter">
					Out of Bounds
				</span>
			</div>
		);
	};

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
				<div>
					<div className="flex items-center gap-2 text-xs font-bold text-muted-foreground tracking-widest uppercase mb-2">
						<span>Admin</span>
						<span className="text-muted-foreground">›</span>
						<span>Audits</span>
					</div>
					<h1 className="text-4xl font-extrabold text-primary tracking-tight">
						Attendance Audit
					</h1>
					<p className="text-muted-foreground mt-1">
						Global verification log for multi-campus GPS entries.
					</p>
				</div>
				<div className="flex gap-3">
					<Button variant="outline" className="gap-2">
						<Filter className="h-4 w-4" />
						Clear Filters
					</Button>
					<Button className="gap-2 shadow-lg">
						<Download className="h-4 w-4" />
						Export to Excel
					</Button>
				</div>
			</div>

			{/* Bento Filter Grid */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card className="bg-card">
					<CardHeader className="pb-2">
						<CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
							Date Range
						</CardTitle>
					</CardHeader>
					<CardContent className="pt-0">
						<div className="flex items-center gap-2">
							<Calendar className="h-4 w-4 text-muted-foreground" />
							<Input
								className="border-0 p-0 text-sm font-semibold focus-visible:ring-0"
								value={dateRange}
								onChange={(e) => setDateRange(e.target.value)}
							/>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-card">
					<CardHeader className="pb-2">
						<CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
							Employee
						</CardTitle>
					</CardHeader>
					<CardContent className="pt-0">
						<div className="flex items-center gap-2">
							<Search className="h-4 w-4 text-muted-foreground" />
							<Input
								className="border-0 p-0 text-sm font-semibold focus-visible:ring-0"
								placeholder="Search by name or ID"
								value={employeeSearch}
								onChange={(e) => setEmployeeSearch(e.target.value)}
							/>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-card">
					<CardHeader className="pb-2">
						<CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
							Campus
						</CardTitle>
					</CardHeader>
					<CardContent className="pt-0">
						<Select value={campus} onValueChange={setCampus}>
							<SelectTrigger className="border-0 p-0 text-sm font-semibold focus-visible:ring-0 h-auto">
								<SelectValue placeholder="All Campuses" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Campuses</SelectItem>
								<SelectItem value="lima-norte">Lima Norte</SelectItem>
								<SelectItem value="lima-sur">Lima Sur</SelectItem>
								<SelectItem value="arequipa-central">
									Arequipa Central
								</SelectItem>
							</SelectContent>
						</Select>
					</CardContent>
				</Card>

				<Card className="bg-primary text-primary-foreground shadow-lg">
					<CardHeader className="pb-2">
						<CardTitle className="text-[10px] uppercase font-bold tracking-widest opacity-70">
							Total Audited
						</CardTitle>
					</CardHeader>
					<CardContent className="pt-0 flex items-center justify-between">
						<div>
							<p className="text-2xl font-bold">1,482</p>
						</div>
						<MapPinCheck className="h-10 w-10 opacity-20" />
					</CardContent>
				</Card>
			</div>

			{/* Audit Table */}
			<Card>
				<CardHeader className="pb-4">
					<div className="flex justify-between items-center">
						<CardTitle className="flex items-center gap-2">
							<List className="h-5 w-5" />
							Verification Log
						</CardTitle>
						<span className="text-xs text-muted-foreground italic">
							Showing 10 of 1,482 entries
						</span>
					</div>
				</CardHeader>
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow className="bg-muted/50 text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
								<TableHead className="px-6 py-4">Employee</TableHead>
								<TableHead className="px-6 py-4">Date</TableHead>
								<TableHead className="px-6 py-4">Entry / Exit</TableHead>
								<TableHead className="px-6 py-4">Location</TableHead>
								<TableHead className="px-6 py-4">Lat/Lon</TableHead>
								<TableHead className="px-6 py-4">Accuracy</TableHead>
								<TableHead className="px-6 py-4">Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{mockData.map((record) => (
								<TableRow key={record.id} className="hover:bg-muted/50">
									<TableCell className="px-6 py-4">
										<div className="flex items-center gap-3">
											<div className="h-9 w-9 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold text-xs">
												{record.initials}
											</div>
											<div>
												<p className="text-sm font-bold text-primary">
													{record.employeeName}
												</p>
												<p className="text-[10px] text-muted-foreground">
													ID: {record.employeeId}
												</p>
											</div>
										</div>
									</TableCell>
									<TableCell className="px-6 py-4">
										<p className="text-sm text-primary font-medium">
											{record.date}
										</p>
									</TableCell>
									<TableCell className="px-6 py-4">
										<div className="flex items-center gap-2">
											<span className="text-xs font-semibold bg-muted px-2 py-0.5 rounded text-primary">
												{record.entryTime}
											</span>
											<span className="text-muted-foreground">—</span>
											<span className="text-xs font-semibold bg-muted px-2 py-0.5 rounded text-primary">
												{record.exitTime}
											</span>
										</div>
									</TableCell>
									<TableCell className="px-6 py-4 text-sm text-muted-foreground">
										<div className="flex items-center gap-1">
											<MapPin className="h-3 w-3" />
											{record.location}
										</div>
									</TableCell>
									<TableCell className="px-6 py-4 font-mono text-[11px] text-muted-foreground">
										{record.latitude}, {record.longitude}
									</TableCell>
									<TableCell className="px-6 py-4">
										{getAccuracyBadge(record.accuracy)}
									</TableCell>
									<TableCell className="px-6 py-4">
										{getStatusBadge(record.status)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
				<div className="p-4 bg-muted/50 flex items-center justify-between">
					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious href="#" className="disabled:opacity-50" />
							</PaginationItem>
							<PaginationItem>
								<PaginationLink href="#" isActive>
									1
								</PaginationLink>
							</PaginationItem>
							<PaginationItem>
								<PaginationLink href="#">2</PaginationLink>
							</PaginationItem>
							<PaginationItem>
								<PaginationLink href="#">3</PaginationLink>
							</PaginationItem>
							<PaginationItem>
								<PaginationEllipsis />
							</PaginationItem>
							<PaginationItem>
								<PaginationLink href="#">42</PaginationLink>
							</PaginationItem>
							<PaginationItem>
								<PaginationNext href="#" />
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			</Card>

			{/* Visualization Section */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<Card className="lg:col-span-2 relative overflow-hidden h-80">
					<CardHeader>
						<CardTitle>Geographic Concentration</CardTitle>
						<p className="text-xs text-muted-foreground">
							Real-time check-in heat map across all faculty buildings.
						</p>
					</CardHeader>
					<CardContent className="absolute inset-0 pt-20">
						<div className="w-full h-full bg-muted/50 rounded-lg flex items-center justify-center">
							<div className="text-center text-muted-foreground">
								<MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
								<p className="text-sm">Map visualization placeholder</p>
								<p className="text-xs">
									Integrate with Google Maps or Leaflet for real heatmap
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Auditor Insights</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="flex items-start gap-4">
							<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
								<TrendingUp className="h-5 w-5 text-primary" />
							</div>
							<div>
								<p className="text-sm font-bold text-primary">
									94% Verification Accuracy
								</p>
								<p className="text-xs text-muted-foreground">
									Check-ins within 100m of assigned GPS coordinates have
									increased by 12% this month.
								</p>
							</div>
						</div>

						<div className="flex items-start gap-4">
							<div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
								<Gauge className="h-5 w-5 text-secondary" />
							</div>
							<div>
								<p className="text-sm font-bold text-primary">
									Avg. Entry Delay
								</p>
								<p className="text-xs text-muted-foreground">
									Current average delay across Lima Norte is 4.2 minutes, which
									is within the acceptable threshold.
								</p>
							</div>
						</div>

						<div className="pt-4">
							<Button
								variant="secondary"
								className="w-full uppercase tracking-widest text-xs"
							>
								Generate Weekly Report
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
