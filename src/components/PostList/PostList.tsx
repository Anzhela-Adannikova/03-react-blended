import { useMutation, useQueryClient } from "@tanstack/react-query";
import css from "./PostList.module.css";
import { deletePost } from "../../services/postService";
import type { Post } from "../../types/post";

interface PostListProps {
  posts: Post[];
  toggleModal: () => void;
  toggleEditPost: (post: Post) => void;
}

export default function PostList({
  posts,
  toggleModal,
  toggleEditPost,
}: PostListProps) {
  const queryClients = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: () => {
      queryClients.invalidateQueries({ queryKey: ["postes"] });
      alert("The post has been deleted");
    },
  });

  return (
    <ul className={css.list}>
      {posts.map((post) => (
        <li className={css.listItem}>
          <h2 className={css.title}>{post.title}</h2>
          <p className={css.content}>{post.body}</p>
          <div className={css.footer}>
            <button
              type="button"
              className={css.edit}
              onClick={() => {
                toggleModal();
                toggleEditPost(post);
              }}
            >
              Edit
            </button>
            <button
              type="button"
              className={css.delete}
              onClick={() => mutation.mutate(post.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
