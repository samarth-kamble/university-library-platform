import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getBorrowRecords } from "@/lib/admin/book";
import BookStripe from "./BookStripe";

const BorrowRequests = async () => {
  const { data: borrowRecords } = await getBorrowRecords({
    sort: "newest",
    page: 1,
    limit: 5,
  });

  if (!borrowRecords) {
    throw new Error("Failed to fetch borrow records");
  }

  return (
    <section className="bg-white p-4 rounded-xl">
      <div className="flex justify-between">
        <h3 className="font-semibold text-dark-400  text-xl">
          Borrow Requests
        </h3>

        <Button asChild className="view-btn">
          <Link href="/admin/borrow-records">View All</Link>
        </Button>
      </div>

      <div className="mt-7 space-y-3">
        {borrowRecords?.length! > 0 &&
          borrowRecords?.map((book) => (
            <BookStripe key={book.borrow.id} book={book as BorrowedBook} />
          ))}
      </div>
    </section>
  );
};

export default BorrowRequests;
