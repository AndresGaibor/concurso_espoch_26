import type { Database } from "#/types/database";

export type UsuarioRow = Database["public"]["Tables"]["USUARIOS"]["Row"];
export type UsuarioInsert = Database["public"]["Tables"]["USUARIOS"]["Insert"];
export type UsuarioUpdate = Database["public"]["Tables"]["USUARIOS"]["Update"];

export const ESTADO_USUARIO_ACTIVO = "ACTIVO" as const;
export const ESTADO_USUARIO_INACTIVO = "INACTIVO" as const;
