import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Clock,
  Calendar,
  Save,
  Copy,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_auth/app/admin/schedules")({
  component: SchedulesPage,
});

interface ShiftTemplate {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  days: string[];
  description: string;
  color: string;
  isActive: boolean;
}

const daysOfWeek = [
  { id: "monday", label: "Lunes", short: "L" },
  { id: "tuesday", label: "Martes", short: "M" },
  { id: "wednesday", label: "Miércoles", short: "M" },
  { id: "thursday", label: "Jueves", short: "J" },
  { id: "friday", label: "Viernes", short: "V" },
  { id: "saturday", label: "Sábado", short: "S" },
  { id: "sunday", label: "Domingo", short: "D" },
];

const colorOptions = [
  { value: "border-primary", label: "Azul", class: "border-primary" },
  { value: "border-secondary", label: "Gris", class: "border-secondary" },
  { value: "border-blue-500", label: "Celeste", class: "border-blue-500" },
  { value: "border-green-500", label: "Verde", class: "border-green-500" },
  { value: "border-orange-500", label: "Naranja", class: "border-orange-500" },
  { value: "border-purple-500", label: "Morado", class: "border-purple-500" },
];

const initialSchedules: ShiftTemplate[] = [
  {
    id: "1",
    name: "DOCENCIA MAÑANA",
    startTime: "07:00",
    endTime: "13:00",
    days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
    description: "Turno matutino para personal docente",
    color: "border-primary",
    isActive: true,
  },
  {
    id: "2",
    name: "ADMINISTRATIVO FULL",
    startTime: "08:30",
    endTime: "18:00",
    days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    description: "Turno completo para personal administrativo",
    color: "border-secondary",
    isActive: true,
  },
  {
    id: "3",
    name: "DOCENCIA NOCHE",
    startTime: "18:00",
    endTime: "22:30",
    days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    description: "Turno nocturno para personal docente",
    color: "border-blue-500",
    isActive: true,
  },
  {
    id: "4",
    name: "FIN DE SEMANA",
    startTime: "08:00",
    endTime: "14:00",
    days: ["saturday", "sunday"],
    description: "Turno especial para fin de semana",
    color: "border-orange-500",
    isActive: false,
  },
];

function SchedulesPage() {
  const [schedules, setSchedules] = useState<ShiftTemplate[]>(initialSchedules);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ShiftTemplate | null>(null);
  const [deleteScheduleId, setDeleteScheduleId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"templates" | "assign">("templates");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    startTime: "",
    endTime: "",
    days: [] as string[],
    description: "",
    color: "border-primary",
  });

  const filteredSchedules = schedules.filter(
    (schedule) =>
      schedule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (schedule?: ShiftTemplate) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setFormData({
        name: schedule.name,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        days: schedule.days,
        description: schedule.description,
        color: schedule.color,
      });
    } else {
      setEditingSchedule(null);
      setFormData({
        name: "",
        startTime: "",
        endTime: "",
        days: [],
        description: "",
        color: "border-primary",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingSchedule) {
      // Update existing
      setSchedules(
        schedules.map((sch) =>
          sch.id === editingSchedule.id
            ? {
                ...sch,
                name: formData.name,
                startTime: formData.startTime,
                endTime: formData.endTime,
                days: formData.days,
                description: formData.description,
                color: formData.color,
              }
            : sch
        )
      );
    } else {
      // Create new
      const newSchedule: ShiftTemplate = {
        id: Date.now().toString(),
        name: formData.name,
        startTime: formData.startTime,
        endTime: formData.endTime,
        days: formData.days,
        description: formData.description,
        color: formData.color,
        isActive: true,
      };
      setSchedules([...schedules, newSchedule]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteScheduleId) {
      setSchedules(schedules.filter((sch) => sch.id !== deleteScheduleId));
      setDeleteScheduleId(null);
    }
  };

  const toggleScheduleStatus = (id: string) => {
    setSchedules(
      schedules.map((sch) =>
        sch.id === id ? { ...sch, isActive: !sch.isActive } : sch
      )
    );
  };

  const toggleDay = (dayId: string) => {
    setFormData({
      ...formData,
      days: formData.days.includes(dayId)
        ? formData.days.filter((d) => d !== dayId)
        : [...formData.days, dayId],
    });
  };

  const getDaysDisplay = (days: string[]) => {
    return days
      .map((day) => daysOfWeek.find((d) => d.id === day)?.short)
      .join(" - ");
  };

  const duplicateSchedule = (schedule: ShiftTemplate) => {
    const newSchedule: ShiftTemplate = {
      ...schedule,
      id: Date.now().toString(),
      name: `${schedule.name} (Copia)`,
      isActive: false,
    };
    setSchedules([...schedules, newSchedule]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestión de Horarios
          </h1>
          <p className="text-muted-foreground mt-1">
            Define plantillas de turnos y horarios de trabajo para los diferentes roles.
          </p>
        </div>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid">
            <TabsTrigger value="templates">Plantillas</TabsTrigger>
            <TabsTrigger value="assign">Asignar Turnos</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Templates Tab */}
      <TabsContent value="templates" className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Buscar plantilla..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} className="gap-2">
                <Plus className="h-4 w-4" />
                Nueva Plantilla
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {editingSchedule ? "Editar Plantilla" : "Nueva Plantilla de Turno"}
                </DialogTitle>
                <DialogDescription>
                  {editingSchedule
                    ? "Modifica la configuración de la plantilla existente."
                    : "Crea una nueva plantilla de turno con horarios y días específicos."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre del Turno</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ej: DOCENCIA MAÑANA"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Ej: Turno matutino para personal docente"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startTime">Hora de Inicio</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) =>
                        setFormData({ ...formData, startTime: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endTime">Hora de Fin</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) =>
                        setFormData({ ...formData, endTime: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Días de la Semana</Label>
                  <div className="flex gap-2 flex-wrap">
                    {daysOfWeek.map((day) => (
                      <div
                        key={day.id}
                        className="flex items-center space-x-2 border rounded-md px-3 py-2"
                      >
                        <Checkbox
                          id={day.id}
                          checked={formData.days.includes(day.id)}
                          onCheckedChange={() => toggleDay(day.id)}
                        />
                        <Label
                          htmlFor={day.id}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {day.short}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Color de la Plantilla</Label>
                  <div className="flex gap-2 flex-wrap">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setFormData({ ...formData, color: color.value })}
                        className={`h-10 px-4 rounded-md border-2 text-sm font-medium transition-colors ${
                          formData.color === color.value
                            ? "border-primary bg-primary/10"
                            : "border-transparent bg-muted hover:bg-muted/80"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full ${color.class} bg-current`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} className="gap-2">
                  <Save className="h-4 w-4" />
                  {editingSchedule ? "Actualizar" : "Guardar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Schedule Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSchedules.map((schedule) => (
            <Card key={schedule.id} className="relative overflow-hidden">
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${schedule.color}`} />
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-sm font-bold uppercase">
                      {schedule.name}
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {schedule.description}
                    </CardDescription>
                  </div>
                  <Badge variant={schedule.isActive ? "default" : "secondary"}>
                    {schedule.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">
                    {schedule.startTime} - {schedule.endTime}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{getDaysDisplay(schedule.days)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between gap-2 pt-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleScheduleStatus(schedule.id)}
                >
                  {schedule.isActive ? "Desactivar" : "Activar"}
                </Button>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleOpenDialog(schedule)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => duplicateSchedule(schedule)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setDeleteScheduleId(schedule.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <Card>
          <CardFooter className="bg-muted/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>
                {schedules.filter((s) => s.isActive).length} plantillas activas
                de {schedules.length} totales
              </span>
            </div>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* Assign Tab */}
      <TabsContent value="assign" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Asignar Turnos a Empleados</CardTitle>
            <CardDescription>
              Asigna plantillas de turnos a empleados específicos o departamentos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-dashed p-8 text-center">
              <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium">Asignación de Turnos</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Esta funcionalidad permite asignar turnos a empleados individuales
                o departamentos completos.
              </p>
              <Button className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                Comenzar Asignación
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteScheduleId}
        onOpenChange={() => setDeleteScheduleId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar plantilla?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La plantilla de turno será eliminada
              permanentemente del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
