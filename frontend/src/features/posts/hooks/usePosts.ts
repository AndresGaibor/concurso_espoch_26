import type { QueryData } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "#/lib/supabase";
import type { NewPost, UpdatePost } from "#/types";

const postQuery = (blogId: string) =>
	supabase
		.from("posts")
		.select("*, profiles(username), comments(count)")
		.eq("blog_id", blogId)
		.eq("published", true)
		.order("created_at", { ascending: false });

type PostWithDetails = QueryData<ReturnType<typeof postQuery>>;

export function usePosts(blogId: string) {
	const [posts, setPosts] = useState<PostWithDetails>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetch() {
			setLoading(true);
			const { data, error } = await postQuery(blogId);
			if (error) throw error;
			setPosts(data);
			setLoading(false);
		}

		fetch();
	}, [blogId]);

	return { posts, loading };
}

export function useCreatePost() {
	const [loading, setLoading] = useState(false);

	async function createPost(data: NewPost) {
		setLoading(true);
		const { error } = await supabase.from("posts").insert(data);
		setLoading(false);
		if (error) throw error;
	}

	return { createPost, loading };
}

export function useDeletePost() {
	async function deletePost(id: string) {
		const { error } = await supabase.from("posts").delete().eq("id", id);
		if (error) throw error;
	}

	return { deletePost };
}

export function useUpdatePost() {
	async function updatePost(id: string, data: UpdatePost) {
		const { error } = await supabase.from("posts").update(data).eq("id", id);
		if (error) throw error;
	}

	return { updatePost };
}
