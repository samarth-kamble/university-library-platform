import BookList from "@/components/BookList";
import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import { searchBooks } from "@/lib/actions/book";
import React from "react";

const LibraryPage = async ({ searchParams }: PageProps) => {
  const { query, sort, page } = await searchParams;

  const { data: allBooks, metadata } = await searchBooks({
    query,
    sort,
    page,
  });

  return (
    <>
      <section className="library">
        <p className="library-subtitle">Discover Your Next Great Read</p>
        <h2 className="library-title">
          Explore and Search for{" "}
          <span className="font-semibold text-primary">Any Book</span> In Our
          Library
        </h2>
        <Search />
      </section>
      <BookList
        title="All Library Books"
        books={allBooks}
        containerClassName="mt-16"
        showSorts
        showNoResultBtn
      />
      <div className="mt-12 border-t border-dark-300/50 pt-12">
        <Pagination variant="dark" hasNextPage={metadata?.hasNextPage} />
      </div>
    </>
  );
};

export default LibraryPage;
