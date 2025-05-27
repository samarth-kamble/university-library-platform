import Link from "next/link";
import React from "react";
import BookCover from "./BookCover";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "./ui/button";

const BookCard = ({ id, title, genre, coverColor, coverUrl }: Book) => (
  <li className="xs:w-52 w-full">
    <Link href={`/books/${id}`} className="w-full flex flex-col items-center">
      <BookCover coverColor={coverColor} coverUrl={coverUrl} />

      <div className="mt-4 w-full xs:w-44">
        <p className="book-title">{title}</p>
        <p className="book-genre">{genre}</p>
      </div>
    </Link>
  </li>
);

export default BookCard;
