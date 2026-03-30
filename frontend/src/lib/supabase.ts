import { createClient } from "@supabase/supabase-js";
import type { Database } from "#/types/database";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl) {
	throw new Error("Falta VITE_SUPABASE_URL en las variables de entorno.");
}

if (!supabaseKey) {
	throw new Error(
		"Falta VITE_SUPABASE_KEY o VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY en las variables de entorno.",
	);
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
