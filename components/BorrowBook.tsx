"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";

interface Props {
  userId: string;
  bookId: string;
  borrowingEligibility: {
    isEligible: boolean;
    message: string;
  };
}

const BorrowBook = ({ userId, bookId, borrowingEligibility }: Props) => {
  const router = useRouter();
  const [borrowing, setBorrowing] = useState(false);

  //   Implement the borrowing logic here
  const handleBorrowBook = async () => {};

  return (
    <Button
      className="book-overview_btn"
      onClick={handleBorrowBook}
      disabled={borrowing}
    >
      <Image
        src="/icons/book.svg"
        className="-mt-1"
        alt="book"
        width={20}
        height={20}
      />

      <p className="font-bebas-neue text-xl text-dark-100">
        {borrowing ? "Borrowing..." : "Borrow Book Request"}
      </p>
    </Button>
  );
};

export default BorrowBook;
