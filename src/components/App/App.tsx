import css from "./App.module.css";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import PostList from "../PostList/PostList";
import EditPostForm from "../EditPostForm/EditPostForm";
import Modal from "../Modal/Modal";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { fetchPosts } from "../../services/postService";
import type { FetchPostsResponse } from "../../services/postService";
import type { Post } from "../../types/post";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedPost, setEditedPost] = useState<Post | null>(null);
  const [currentPage, setCurrentPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceSearchTerm] = useDebounce(searchTerm, 300);
  const perPage = 8;

  const { data } = useQuery<FetchPostsResponse>({
    queryKey: ["post", currentPage, debounceSearchTerm, perPage],
    queryFn: () => fetchPosts(currentPage, debounceSearchTerm, perPage),
    placeholderData: keepPreviousData,
  });

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const toggleEditPost = (post: Post) => {
    setEditedPost(post);
    setIsModalOpen(true);
  };

  const handleSearchChange = (newTerm: string) => {
    setSearchTerm(newTerm);
    setCurrentPages(1);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditedPost(null);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchTerm} onSearch={handleSearchChange} />
        {data && data.totalPages && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPages}
          />
        )}

        <button className={css.button} onClick={toggleModal}>
          Create post
        </button>
      </header>
      {isModalOpen && editedPost && (
        <Modal onClose={handleCloseModal}>
          <EditPostForm
            post={editedPost}
            onClose={toggleModal}
            onSuccess={handleCloseModal}
          />
        </Modal>
      )}
      {data?.posts && data.posts.length > 0 && (
        <PostList
          posts={data.posts}
          toggleModal={toggleModal}
          toggleEditPost={toggleEditPost}
        />
      )}
    </div>
  );
}
