"use server";

import dayjs from "dayjs";
import {
  and,
  asc,
  count,
  desc,
  eq,
  getTableColumns,
  ilike,
  or,
} from "drizzle-orm";

import { db } from "@/database/drizzle";
import { books, borrowRecords, users } from "@/database/schema";
import { workflowClient } from "../workflow";
import config from "../config";

const ITEMS_PER_PAGE = 20;

export async function borrowBook(params: BorrowBookParams) {
  const { userId, bookId } = params;

  try {
    const book = await db
      .select({
        availableCopies: books.availableCopies,
      })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (!book.length || book[0].availableCopies <= 0) {
      return {
        success: false,
        error: "Book is not available",
      };
    }

    const dueDate = dayjs().add(7, "day").toDate().toDateString();

    const record = await db.insert(borrowRecords).values({
      userId,
      bookId,
      dueDate,
      status: "BORROWED",
    });

    await db
      .update(books)
      .set({
        availableCopies: book[0].availableCopies - 1,
      })
      .where(eq(books.id, bookId));

    await workflowClient.trigger({
      url: `${config.env.prodApiEndpoint}/api/workflow/borrow-book`,
      body: {
        userId,
        bookId,
        borrowDate: dayjs().toDate().toDateString(),
        dueDate,
      },
    });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(record)),
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Error borrowing book",
    };
  }
}

export async function getBorrowedBooks(userId: string) {
  try {
    const borrowedBooks = await db
      .select({
        ...getTableColumns(books),
        borrow: {
          ...getTableColumns(borrowRecords),
        },
      })
      .from(borrowRecords)
      .innerJoin(books, eq(borrowRecords.bookId, books.id))
      .innerJoin(users, eq(borrowRecords.userId, users.id))
      .where(eq(borrowRecords.userId, userId))
      .orderBy(desc(borrowRecords.borrowDate));

    return {
      success: true,
      data: JSON.parse(JSON.stringify(borrowedBooks)),
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Error getting borrowed books",
    };
  }
}

export async function returnBook(params: ReturnBookParams) {
  const { borrowRecordId } = params;

  try {
    // 1. Find the borrow record with book details
    const borrowRecord = await db
      .select({
        id: borrowRecords.id,
        bookId: borrowRecords.bookId,
        userId: borrowRecords.userId,
        dueDate: borrowRecords.dueDate,
        status: borrowRecords.status,
        returnDate: borrowRecords.returnDate,
        availableCopies: books.availableCopies,
      })
      .from(borrowRecords)
      .innerJoin(books, eq(borrowRecords.bookId, books.id))
      .where(eq(borrowRecords.id, borrowRecordId))
      .limit(1);

    if (!borrowRecord.length) {
      return {
        success: false,
        error: "Borrow record not found",
      };
    }

    const record = borrowRecord[0];

    // 2. Check if book is already returned
    if (record.status === "RETURNED") {
      return {
        success: false,
        error: "Book has already been returned",
      };
    }

    const returnDate = dayjs().toDate().toDateString();

    // 3. Update the borrow record
    await db
      .update(borrowRecords)
      .set({
        returnDate,
        status: "RETURNED",
      })
      .where(eq(borrowRecords.id, borrowRecordId));

    // 4. Update book availability
    await db
      .update(books)
      .set({
        availableCopies: record.availableCopies + 1,
      })
      .where(eq(books.id, record.bookId));

    // 5. Trigger workflow for return notification
    await workflowClient.trigger({
      url: `${config.env.prodApiEndpoint}/api/workflow/return-book`,
      body: {
        userId: record.userId,
        bookId: record.bookId,
        returnDate,
        dueDate: record.dueDate,
      },
    });

    return {
      success: true,
      data: {
        returnDate,
        status: "RETURNED",
      },
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Error returning book",
    };
  }
}

export async function updateBorrowStatus(params: UpdateBorrowStatusParams) {
  const { borrowRecordId, status } = params;

  try {
    // Get current record
    const currentRecord = await db
      .select({
        id: borrowRecords.id,
        bookId: borrowRecords.bookId,
        status: borrowRecords.status,
        returnDate: borrowRecords.returnDate,
        availableCopies: books.availableCopies,
      })
      .from(borrowRecords)
      .innerJoin(books, eq(borrowRecords.bookId, books.id))
      .where(eq(borrowRecords.id, borrowRecordId))
      .limit(1);

    if (!currentRecord.length) {
      return {
        success: false,
        error: "Borrow record not found",
      };
    }

    const record = currentRecord[0];
    const wasReturned = record.status === "RETURNED";
    const willBeReturned = status === "RETURNED";

    // Update borrow record
    const updateData: any = { status };

    // If changing from RETURNED to BORROWED, remove return date
    if (wasReturned && status === "BORROWED") {
      updateData.returnDate = null;
    }
    // If changing from BORROWED to RETURNED, add return date
    else if (!wasReturned && status === "RETURNED") {
      updateData.returnDate = dayjs().toDate().toDateString();
    }

    await db
      .update(borrowRecords)
      .set(updateData)
      .where(eq(borrowRecords.id, borrowRecordId));

    // Update book availability based on status change
    if (wasReturned && !willBeReturned) {
      // Book was returned, now borrowed again - decrease available copies
      await db
        .update(books)
        .set({
          availableCopies: record.availableCopies - 1,
        })
        .where(eq(books.id, record.bookId));
    } else if (!wasReturned && willBeReturned) {
      // Book was borrowed, now returned - increase available copies
      await db
        .update(books)
        .set({
          availableCopies: record.availableCopies + 1,
        })
        .where(eq(books.id, record.bookId));
    }

    return {
      success: true,
      data: {
        status,
        returnDate: updateData.returnDate || record.returnDate,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Error updating borrow status",
    };
  }
}

export async function searchBooks({
  query,
  sort = "available",
  page = 1,
}: {
  query?: string;
  sort?: string;
  page?: number;
}) {
  try {
    const searchConditions = query
      ? or(
          ilike(books.title, `%${query}%`),
          ilike(books.genre, `%${query}%`),
          ilike(books.author, `%${query}%`)
        )
      : undefined;

    const sortOptions: { [key: string]: any } = {
      newest: desc(books.createdAt),
      oldest: asc(books.createdAt),
      highestRated: desc(books.rating),
      available: desc(books.totalCopies),
    };

    const sortingCondition = sortOptions[sort] || desc(books.totalCopies);

    const allBooks = await db
      .select()
      .from(books)
      .where(searchConditions)
      .orderBy(sortingCondition)
      .limit(ITEMS_PER_PAGE)
      .offset((page - 1) * ITEMS_PER_PAGE);

    const totalBooks = await db
      .select({
        count: count(),
      })
      .from(books)
      .where(searchConditions);

    const totalPage = Math.ceil(totalBooks[0].count / ITEMS_PER_PAGE);
    const hasNextPage = page < totalPage;

    return {
      success: true,
      data: JSON.parse(JSON.stringify(allBooks)),
      metadata: {
        totalPage,
        hasNextPage,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Error searching books",
    };
  }
}
