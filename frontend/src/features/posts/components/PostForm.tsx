import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "#/components/ui/form";
import { Input } from "#/components/ui/input";
import { Button } from "#/components/ui/button";
import { useCreatePost } from "../hooks/usePosts";

// 1. Schema = validación + tipos automáticos
const postSchema = z.object({
  title: z.string().min(3, "Mínimo 3 caracteres"),
  content: z.string().min(10),
});

type PostForm = z.infer<typeof postSchema>; // ← tipo gratis

// 2. Componente
export function CreatePostForm() {
  const form = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: { title: "", content: "" },
  });

  async function onSubmit(values: PostForm) {
    const { createPost } = useCreatePost();

    await createPost(values); // tu hook de supabase
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage /> {/* ← errores automáticos */}
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Crear
        </Button>
      </form>
    </Form>
  );
}
