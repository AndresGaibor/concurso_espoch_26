import { useEffect, useState } from "react";
import { supabase } from "#/lib/supabase";
import type { Database } from "#/types/database";

type AsistenciaRow = Database["public"]["Tables"]["ASISTENCIAS"]["Row"];
type AsistenciaInsert = Database["public"]["Tables"]["ASISTENCIAS"]["Insert"];
type AsistenciaUpdate = Database["public"]["Tables"]["ASISTENCIAS"]["Update"];

export function useAsistencias() {
  const [asistencias, setAsistencias] = useState<AsistenciaRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data, error } = await supabase.from("ASISTENCIAS").select("*");
      if (error) throw error;
      setAsistencias(data ?? []);
      setLoading(false);
    }
    fetch();
  }, []);

  return { asistencias, loading };
}

export function useCreateAsistencia() {
  const [loading, setLoading] = useState(false);

  async function createAsistencia(data: Omit<AsistenciaInsert, "IdAsistencia">) {
    setLoading(true);
    const { error } = await supabase.from("ASISTENCIAS").insert(data);
    setLoading(false);
    if (error) throw error;
  }

  return { createAsistencia, loading };
}

export function useUpdateAsistencia() {
  async function updateAsistencia(id: number, data: AsistenciaUpdate) {
    const { error } = await supabase
      .from("ASISTENCIAS")
      .update(data)
      .eq("IdAsistencia", id);
    if (error) throw error;
  }

  return { updateAsistencia };
}

export function useDeleteAsistencia() {
  async function deleteAsistencia(id: number) {
    const { error } = await supabase
      .from("ASISTENCIAS")
      .delete()
      .eq("IdAsistencia", id);
    if (error) throw error;
  }

  return { deleteAsistencia };
}