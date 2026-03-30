import type { QueryData } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "#/lib/supabase";
import type { UsuarioInsert, UsuarioUpdate } from "../types/usuarios.types";

const usuariosQuery = () =>
	supabase
		.from("USUARIOS")
		.select("*, ROLES(*), JefeDirecto:USUARIOS(*)")
		.order("NombreCompleto", { ascending: true });

type UsuarioEnriched = QueryData<ReturnType<typeof usuariosQuery>>;

const usuarioQuery = (id: number) =>
	supabase
		.from("USUARIOS")
		.select("*, ROLES(*), JefeDirecto:USUARIOS(*)")
		.eq("IdUsuario", id)
		.single();

type UsuarioConRelaciones = QueryData<ReturnType<typeof usuarioQuery>>;

export function useUsuarios() {
	const [usuarios, setUsuarios] = useState<UsuarioEnriched>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const fetchUsuarios = useCallback(async () => {
		setLoading(true);
		setError(null);
		const { data, error: fetchError } = await usuariosQuery();
		if (fetchError) {
			setError(new Error(fetchError.message));
			setLoading(false);
			return;
		}
		setUsuarios(data ?? []);
		setLoading(false);
	}, []);

	useEffect(() => {
		fetchUsuarios();
	}, [fetchUsuarios]);

	const refresh = useCallback(() => {
		fetchUsuarios();
	}, [fetchUsuarios]);

	return { usuarios, loading, error, refresh };
}

export function useUsuario(id: number) {
	const [usuario, setUsuario] = useState<UsuarioConRelaciones | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		if (id === undefined || id === null) {
			setLoading(false);
			return;
		}

		async function fetchUsuario() {
			setLoading(true);
			setError(null);
			const { data, error: fetchError } = await usuarioQuery(id);
			if (fetchError) {
				setError(new Error(fetchError.message));
				setLoading(false);
				return;
			}
			setUsuario(data);
			setLoading(false);
		}

		fetchUsuario();
	}, [id]);

	return { usuario, loading, error };
}

export function useCreateUsuario() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	async function createUsuario(
		data: UsuarioInsert,
	): Promise<UsuarioConRelaciones | null> {
		setLoading(true);
		setError(null);
		const { data: created, error: createError } = await supabase
			.from("USUARIOS")
			.insert(data)
			.select("*, ROLES(*), JefeDirecto:USUARIOS(*)")
			.single();

		if (createError) {
			setError(new Error(createError.message));
			setLoading(false);
			return null;
		}

		setLoading(false);
		return created;
	}

	return { createUsuario, loading, error };
}

export function useUpdateUsuario() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	async function updateUsuario(
		id: number,
		data: UsuarioUpdate,
	): Promise<UsuarioConRelaciones | null> {
		setLoading(true);
		setError(null);
		const { data: updated, error: updateError } = await supabase
			.from("USUARIOS")
			.update(data)
			.eq("IdUsuario", id)
			.select("*, ROLES(*), JefeDirecto:USUARIOS(*)")
			.single();

		if (updateError) {
			setError(new Error(updateError.message));
			setLoading(false);
			return null;
		}

		setLoading(false);
		return updated;
	}

	return { updateUsuario, loading, error };
}

export function useDeleteUsuario() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	async function deleteUsuario(id: number): Promise<boolean> {
		setLoading(true);
		setError(null);
		const { error: deleteError } = await supabase
			.from("USUARIOS")
			.delete()
			.eq("IdUsuario", id);

		if (deleteError) {
			setError(new Error(deleteError.message));
			setLoading(false);
			return false;
		}

		setLoading(false);
		return true;
	}

	return { deleteUsuario, loading, error };
}

export type { UsuarioConRelaciones, UsuarioEnriched };
