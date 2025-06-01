import AllBooksClient from "@/components/AllBooksClient";
import { getBooks } from "@/lib/admin/book";

interface PageProps {
  searchParams: {
    query?: string;
    sort?: string;
    page?: number;
  };
}

const AllBooks = async ({ searchParams }: PageProps) => {
  const { query, sort, page } = await searchParams;

  const { data: allBooks, metadata } = await getBooks({
    query,
    sort,
    page,
  });

  const formattedBooks = (allBooks || []).map((book) => ({
    ...book,
    createdAt: book.createdAt ? book.createdAt.toISOString() : "",
  }));

  return (
    <AllBooksClient
      initialBooks={formattedBooks}
      metadata={metadata}
      searchParams={{ query, sort, page }}
    />
  );
};

export default AllBooks;
