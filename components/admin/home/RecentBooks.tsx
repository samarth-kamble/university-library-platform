import { Button } from "@/components/ui/button";
import { getBooks } from "@/lib/admin/book";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import BookStripe from "./BookStripe";

const RecentBooks = async () => {
  const { data: recentBooks } = await getBooks({
    sort: "newest",
    page: 1,
    limit: 8,
  });

  if (!recentBooks) {
    throw new Error("Failed to fetch recent books");
  }

  return (
    <section className="flex-1 bg-white p-4 rounded-xl">
      <div className="flex justify-between">
        <h3 className="font-semibold text-dark-400 text-xl">
          Recently Added Books
        </h3>
        <Button asChild className="view-btn">
          <Link href="/admin/books">View All</Link>
        </Button>
      </div>
      <Link href="/admin/books/new" className="add-new-book_btn">
        <div>
          <Image
            src="/icons/admin/plus.svg"
            width={18}
            height={18}
            alt="plus"
            className="object-contain"
          />
        </div>
        <p>Add New Book</p>
      </Link>
      <div className="space-y-3">
        {recentBooks?.length! > 0 &&
          recentBooks?.map((book) => (
            <BookStripe key={book.id} book={book as Book} />
          ))}
      </div>
    </section>
  );
};

export default RecentBooks;
