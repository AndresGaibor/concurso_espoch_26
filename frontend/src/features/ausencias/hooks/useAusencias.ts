import { useEffect, useState } from "react";
import { supabase } from "#/lib/supabase";
import type { Database } from "#/types/database";

type AusenciaRow = Database["public"]["Tables"]["AUSENCIAS"]["Row"];
type AusenciaInsert = Database["public"]["Tables"]["AUSENCIAS"]["Insert"];
type AusenciaUpdate = Database["public"]["Tables"]["AUSENCIAS"]["Update"];

export function useAusencias() {
  const [ausencias, setAusencias] = useState<AusenciaRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data, error } = await supabase
        .from("AUSENCIAS")
        .select("*, IdUsuario(id, NombreCompleto), IdAprobador(id, NombreCompleto)");
      if (error) throw error;
      setAusencias(data ?? []);
      setLoading(false);
    }
    fetch();
  }, []);

  return { ausencias, loading };
}

export function useCreateAusencia() {
  const [loading, setLoading] = useState(false);

  async function createAusencia(data: Omit<AusenciaInsert, "IdAusencia">) {
    setLoading(true);
    const { error } = await supabase.from("AUSENCIAS").insert(data);
    setLoading(false);
    if (error) throw error;
  }

  return { createAusencia, loading };
}

export function useUpdateAusencia() {
  async function updateAusencia(id: number, data: AusenciaUpdate) {
    const { error } = await supabase
      .from("AUSENCIAS")
      .update(data)
      .eq("IdAusencia", id);
    if (error) throw error;
  }

  return { updateAusencia };
}

export function useDeleteAusencia() {
  async function deleteAusencia(id: number) {
    const { error } = await supabase
      .from("AUSENCIAS")
      .delete()
      .eq("IdAusencia", id);
    if (error) throw error;
  }

  return { deleteAusencia };
}