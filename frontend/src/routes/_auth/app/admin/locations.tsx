import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MapPin,
  Radar,
  Save,
  X,
  MapPinCheck,
  AlertCircle,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_auth/app/admin/locations")({
  component: LocationsPage,
});

interface Location {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  radius: number;
  isActive: boolean;
}

const initialLocations: Location[] = [
  {
    id: "1",
    name: "Campus Principal - Av. Arequipa",
    address: "Av. Arequipa 1234, Lima",
    latitude: -12.07342,
    longitude: -77.03451,
    radius: 200,
    isActive: true,
  },
  {
    id: "2",
    name: "Sede Lince - Facultad de Salud",
    address: "Av. Brasil 456, Lince",
    latitude: -12.08125,
    longitude: -77.03212,
    radius: 150,
    isActive: true,
  },
  {
    id: "3",
    name: "Centro de Idiomas - Petit Thouars",
    address: "Av. Petit Thouars 789, Lima",
    latitude: -12.07554,
    longitude: -77.03333,
    radius: 100,
    isActive: true,
  },
  {
    id: "4",
    name: "Laboratorio de Cómputo - Sede Sur",
    address: "Calle Los Pinos 321, Surco",
    latitude: -12.09542,
    longitude: -77.02891,
    radius: 80,
    isActive: false,
  },
];

function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [deleteLocationId, setDeleteLocationId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    radius: "",
  });

  const filteredLocations = locations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (location?: Location) => {
    if (location) {
      setEditingLocation(location);
      setFormData({
        name: location.name,
        address: location.address,
        latitude: location.latitude.toString(),
        longitude: location.longitude.toString(),
        radius: location.radius.toString(),
      });
    } else {
      setEditingLocation(null);
      setFormData({
        name: "",
        address: "",
        latitude: "",
        longitude: "",
        radius: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingLocation) {
      // Update existing
      setLocations(
        locations.map((loc) =>
          loc.id === editingLocation.id
            ? {
                ...loc,
                name: formData.name,
                address: formData.address,
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude),
                radius: parseInt(formData.radius),
              }
            : loc
        )
      );
    } else {
      // Create new
      const newLocation: Location = {
        id: Date.now().toString(),
        name: formData.name,
        address: formData.address,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        radius: parseInt(formData.radius),
        isActive: true,
      };
      setLocations([...locations, newLocation]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteLocationId) {
      setLocations(locations.filter((loc) => loc.id !== deleteLocationId));
      setDeleteLocationId(null);
    }
  };

  const toggleLocationStatus = (id: string) => {
    setLocations(
      locations.map((loc) =>
        loc.id === id ? { ...loc, isActive: !loc.isActive } : loc
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestión de Ubicaciones
          </h1>
          <p className="text-muted-foreground mt-1">
            Configura geovallas y radio GPS para los campus y sedes.
          </p>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Buscar ubicación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} className="gap-2">
                <Plus className="h-4 w-4" />
                Agregar Ubicación
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingLocation ? "Editar Ubicación" : "Nueva Ubicación"}
                </DialogTitle>
                <DialogDescription>
                  {editingLocation
                    ? "Modifica la configuración de la ubicación existente."
                    : "Ingresa los datos para registrar una nueva ubicación con su geovalla GPS."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre de la Ubicación</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ej: Campus Principal - Av. Arequipa"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Ej: Av. Arequipa 1234, Lima"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="latitude">Latitud</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="0.000001"
                      value={formData.latitude}
                      onChange={(e) =>
                        setFormData({ ...formData, latitude: e.target.value })
                      }
                      placeholder="-12.073420"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="longitude">Longitud</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="0.000001"
                      value={formData.longitude}
                      onChange={(e) =>
                        setFormData({ ...formData, longitude: e.target.value })
                      }
                      placeholder="-77.034510"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="radius">Radio de Geovalla (metros)</Label>
                  <Input
                    id="radius"
                    type="number"
                    value={formData.radius}
                    onChange={(e) =>
                      setFormData({ ...formData, radius: e.target.value })
                    }
                    placeholder="200"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} className="gap-2">
                  <Save className="h-4 w-4" />
                  {editingLocation ? "Actualizar" : "Guardar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Locations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Ubicaciones Registradas</CardTitle>
          <CardDescription>
            Lista de todas las ubicaciones con su configuración de geovalla GPS.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ubicación</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Coordenadas</TableHead>
                <TableHead>Radio</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLocations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell className="font-medium">
                    {location.name}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {location.address}
                  </TableCell>
                  <TableCell className="text-sm font-mono">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Radar className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">
                        {location.radius}m
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={location.isActive ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => toggleLocationStatus(location.id)}
                    >
                      {location.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(location)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteLocationId(location.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="bg-muted/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPinCheck className="h-4 w-4 text-primary" />
            <span>
              {locations.filter((l) => l.isActive).length} ubicaciones activas
              de {locations.length} totales
            </span>
          </div>
        </CardFooter>
      </Card>

      {/* Map Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Vista de Mapa</CardTitle>
          <CardDescription>
            Visualización de ubicaciones en el mapa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl overflow-hidden relative bg-muted/50 min-h-[400px] flex items-center justify-center">
            <div className="text-center text-muted-foreground p-6">
              <MapPin className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Vista de Mapa</p>
              <p className="text-sm mt-1">
                Integración con Google Maps o Leaflet
              </p>
              <p className="text-xs mt-4 text-muted-foreground">
                Muestra las geovallas circulares alrededor de cada ubicación
                registrada
              </p>
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur-md p-4 rounded-lg flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs font-bold uppercase">
                    Modo Precisión Activo
                  </span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <AlertCircle className="h-4 w-4" />
                Recalibrar GPS
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteLocationId}
        onOpenChange={() => setDeleteLocationId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar ubicación?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La ubicación será eliminada
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
