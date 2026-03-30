import { useEffect, useState } from "react";
import { supabase } from "#/lib/supabase";
import type { Database } from "#/types/database";

type RolRow = Database["public"]["Tables"]["ROLES"]["Row"];
type RolInsert = Database["public"]["Tables"]["ROLES"]["Insert"];
type RolUpdate = Database["public"]["Tables"]["ROLES"]["Update"];

export function useRoles() {
  const [roles, setRoles] = useState<RolRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data, error } = await supabase.from("ROLES").select("*");
      if (error) throw error;
      setRoles(data ?? []);
      setLoading(false);
    }
    fetch();
  }, []);

  return { roles, loading };
}

export function useCreateRol() {
  const [loading, setLoading] = useState(false);

  async function createRol(data: Omit<RolInsert, "IdRol">) {
    setLoading(true);
    const { error } = await supabase.from("ROLES").insert(data);
    setLoading(false);
    if (error) throw error;
  }

  return { createRol, loading };
}

export function useUpdateRol() {
  async function updateRol(id: number, data: RolUpdate) {
    const { error } = await supabase.from("ROLES").update(data).eq("IdRol", id);
    if (error) throw error;
  }

  return { updateRol };
}

export function useDeleteRol() {
  async function deleteRol(id: number) {
    const { error } = await supabase.from("ROLES").delete().eq("IdRol", id);
    if (error) throw error;
  }

  return { deleteRol };
}