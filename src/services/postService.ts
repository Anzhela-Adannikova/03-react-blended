import axios from "axios";
import type { Post, NewPost } from "../types/post";

axios.defaults.baseURL = "https://jsonplaceholder.typicode.com";

// отримання
export interface FetchPostsResponse {
  posts: Post[];
  totalPages: number;
}

export const fetchPosts = async (
  page: number = 1,
  searchText: string = "",
  perPage: number = 8
): Promise<FetchPostsResponse> => {
  const res = await axios.get(`/posts?q=${searchText}`);
  const allPost = res.data;

  const start = (page - 1) * perPage;
  const paginatedPosts = allPost.slice(start, start + perPage);
  const totalPages = Math.ceil(allPost.length / perPage);

  return {
    posts: paginatedPosts,
    totalPages,
  };
};

// створення
export const createPost = async (newPost: NewPost) => {
  const res = await axios.post<Post>("/posts", newPost);
  return res.data;
};

// редагування
interface EditPostData {
  id: number;
  title: string;
}

export const editPost = async ({ id, title }: EditPostData) => {
  const res = await axios.put<Post>(`/posts/${id}`, { title });
  return res.data;
};

// видалення
export const deletePost = async (postId: number) => {
  const res = await axios.delete(`/posts/${postId}`);
  return res.data;
};
