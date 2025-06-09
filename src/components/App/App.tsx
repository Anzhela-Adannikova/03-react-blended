import css from "./App.module.css";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import PostList from "../PostList/PostList";
import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPages] = useState(1);
  const [debounceSearchQuery] = useDebounce(searchTerm, 300);

  const { data } = useQuery({
    queryKey: [currentPage, debounceSearchQuery],
    queryFn: () => fetchPosts(currentPage, debounceSearchQuery),
    placeholderData: keepPreviousData,
  });

  const handleSearchChange = (newTerm: string) => {
    setSearchTerm(newTerm);
    setCurrentPages(1);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox />
        {data && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPages}
          />
        )}

        <button className={css.button}>Create post</button>
      </header>
      <Modal>
        {/* Передати через children компонент CreatePostForm або EditPostForm */}
      </Modal>
      <PostList />
    </div>
  );
}
