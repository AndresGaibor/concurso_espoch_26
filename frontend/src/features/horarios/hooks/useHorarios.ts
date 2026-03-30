import { useEffect, useState } from "react";
import { supabase } from "#/lib/supabase";
import type { Database } from "#/types/database";

type HorarioRow = Database["public"]["Tables"]["HORARIOS"]["Row"];
type HorarioInsert = Database["public"]["Tables"]["HORARIOS"]["Insert"];
type HorarioUpdate = Database["public"]["Tables"]["HORARIOS"]["Update"];

export function useHorarios() {
  const [horarios, setHorarios] = useState<HorarioRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data, error } = await supabase.from("HORARIOS").select("*");
      if (error) throw error;
      setHorarios(data ?? []);
      setLoading(false);
    }
    fetch();
  }, []);

  return { horarios, loading };
}

export function useCreateHorario() {
  const [loading, setLoading] = useState(false);

  async function createHorario(data: Omit<HorarioInsert, "IdHorario">) {
    setLoading(true);
    const { error } = await supabase.from("HORARIOS").insert(data);
    setLoading(false);
    if (error) throw error;
  }

  return { createHorario, loading };
}

export function useUpdateHorario() {
  async function updateHorario(id: number, data: HorarioUpdate) {
    const { error } = await supabase
      .from("HORARIOS")
      .update(data)
      .eq("IdHorario", id);
    if (error) throw error;
  }

  return { updateHorario };
}

export function useDeleteHorario() {
  async function deleteHorario(id: number) {
    const { error } = await supabase
      .from("HORARIOS")
      .delete()
      .eq("IdHorario", id);
    if (error) throw error;
  }

  return { deleteHorario };
}