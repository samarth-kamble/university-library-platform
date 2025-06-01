import Avatar from "@/components/Avatar";
import BookCover from "@/components/BookCover";
import BookReceipt from "@/components/BookReceipt";
import dayjs from "dayjs";
import Image from "next/image";
import React from "react";

const BookStripe = ({ book }: { book: BorrowedBook | Book }) => {
  const { coverColor, coverUrl, title, author, genre, createdAt } = book;

  return (
    <div className="book-stripe">
      <BookCover variant="small" coverColor={coverColor} coverUrl={coverUrl} />
      <div className="flex-1">
        <p className="title">{title}</p>
        <div className="author">
          <p>By {author}</p>
          <div />
          <p>{genre}</p>
        </div>
        <div className="user">
          {"user" in book && book.user && (
            <div className="avatar">
              <Avatar size="xs" name={book.user.fullName} />
              <p>{book.user.fullName}</p>
            </div>
          )}
          <div className="borrow-date">
            <Image
              src="/icons/admin/calendar.svg"
              alt="user"
              width={20}
              height={20}
              className="object-contain"
            />
            <p>{dayjs(createdAt).format("DD-MM-YYYY")}</p>
          </div>
        </div>
      </div>
      {"borrow" in book && book.borrow! && (
        <BookReceipt {...(book as BorrowedBook)} btnVariant="preview" />
      )}
    </div>
  );
};

export default BookStripe;
