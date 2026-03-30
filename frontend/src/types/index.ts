// src/types/index.ts
import type { Database, Tables } from "./database";

// Rows (leer)
export type Profile = Tables<"profiles">;
export type Blog = Tables<"blogs">;
export type Post = Tables<"posts">;
export type Usuario = Tables<"USUARIOS">;
export type Rol = Tables<"ROLES">;

// (crear)
export type NewBlog = Database["public"]["Tables"]["blogs"]["Insert"];
export type NewPost = Database["public"]["Tables"]["posts"]["Insert"];

// Update (editar)
export type UpdatePost = Database["public"]["Tables"]["posts"]["Update"];

// Con relaciones (las defines tú encima de los tipos base)
export type PostWithAuthor = Post & { profiles: Profile };
// export type PostWithDetails = Post & { profiles: Profile; comments: Comment[] };
