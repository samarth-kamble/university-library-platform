"use client";

import BookCover from "@/components/BookCover";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { deleteBook } from "@/lib/admin/book";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useTransition } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  createdAt: string;
  coverUrl: string;
  coverColor: string;
}

interface AllBooksProps {
  initialBooks: Book[];
  metadata: any;
  searchParams: {
    query?: string;
    sort?: string;
    page?: number;
  };
}

const AllBooksClient = ({
  initialBooks,
  metadata,
  searchParams,
}: AllBooksProps) => {
  const { toast } = useToast();
  const [allBooks, setAllBooks] = useState<Book[]>(initialBooks);
  const [isPending, startTransition] = useTransition();
  const [deletingBookId, setDeletingBookId] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const openDeleteDialog = (book: Book) => {
    setSelectedBook(book);
    setDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedBook) return;
    setDialogOpen(false);
    await handleDelete(selectedBook.id, selectedBook.title);
    setSelectedBook(null);
  };

  const handleDelete = async (bookId: string, bookTitle: string) => {
    setDeletingBookId(bookId);

    startTransition(async () => {
      try {
        const result = await deleteBook({ id: bookId });

        if (result.success) {
          // Remove the deleted book from the local state
          setAllBooks((prev) => prev.filter((book) => book.id !== bookId));
          toast({
            title: "Book Deleted",
            description: `"${bookTitle}" has been successfully deleted.`,
          });
        } else {
          toast({
            title: "Error Deleting Book",
            description: result.error || "An unexpected error occurred.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error deleting book:", error);
        toast({
          title: "Error Deleting Book",
          description: "An unexpected error occurred. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setDeletingBookId(null);
      }
    });
  };

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">All Books</h2>
        <Button className="bg-primary-admin" asChild>
          <Link href="/admin/books/new" className="text-white">
            + Create a New Book
          </Link>
        </Button>
      </div>

      <div className="mt-7 w-full overflow-hidden">
        <Table className="overflow-hidden">
          <TableHeader>
            <TableRow className="h-14 border-none bg-light-300">
              <TableHead className="w-[450px]">Book Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead>Date Created</TableHead>
              <TableHead>View</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {allBooks?.length > 0 ? (
              allBooks.map((book) => (
                <TableRow key={book.id} className="border-b-dark-100/5">
                  <TableCell className="py-5 font-medium">
                    <div className="flex w-96 flex-row items-center gap-2 text-sm font-semibold text-dark-400">
                      <BookCover
                        variant="extraSmall"
                        coverUrl={book.coverUrl}
                        coverColor={book.coverColor}
                      />
                      <p className="flex-1">{book.title}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-dark-200">
                    {book.author}
                  </TableCell>
                  <TableCell className="text-sm font-medium text-dark-200">
                    {book.genre}
                  </TableCell>
                  <TableCell className="text-sm font-medium text-dark-200">
                    {book.createdAt ? formatDate(book.createdAt) : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Button asChild className="view-btn !shadow">
                      <Link href={`/admin/books/${book.id}`}>View</Link>
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-row items-center gap-3.5">
                      <Link
                        href={`/admin/books/${book.id}/edit`}
                        className="relative size-5 hover:opacity-70 transition-opacity"
                        title={`Edit ${book.title}`}
                      >
                        <Image
                          src="/icons/admin/edit.svg"
                          fill
                          className="object-contain"
                          alt="edit"
                        />
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(book)}
                        disabled={isPending || deletingBookId === book.id}
                        className="p-1 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={`Delete ${book.title}`}
                      >
                        {deletingBookId === book.id ? (
                          <div className="w-5 h-5 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                        ) : (
                          <Image
                            src="/icons/admin/trash.svg"
                            width={20}
                            height={20}
                            className="object-contain"
                            alt="delete"
                          />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center pt-10">
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <div className="flex items-start gap-4">
            {/* Warning Icon */}
            <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            {/* Content */}
            <div className="flex-1 mt-3">
              <DialogHeader className="text-left space-y-3 pb-0">
                <DialogTitle className="text-lg font-semibold text-gray-900 leading-6">
                  Delete "{selectedBook?.title}"?
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-600 leading-5">
                  This book will be permanently removed from your library. This
                  action cannot be undone and all associated data will be lost.
                </DialogDescription>
              </DialogHeader>

              {/* Book Info Card */}
              {selectedBook && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-10 rounded flex items-center justify-center text-white text-xs font-medium">
                      <BookCover
                        variant="extraSmall"
                        coverUrl={selectedBook.coverUrl}
                        coverColor={selectedBook.coverColor}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {selectedBook.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        by {selectedBook.author}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="mt-6 gap-3 sm:gap-2">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="flex-1 sm:flex-none"
                disabled={isPending}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isPending}
              className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 focus:ring-red-500"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Deleting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete Book
                </div>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="mt-8">
        <Pagination variant="light" hasNextPage={metadata?.hasNextPage} />
      </div>
    </section>
  );
};

export default AllBooksClient;
