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
    // Check if user already has this book borrowed
    const existingBorrow = await db
      .select()
      .from(borrowRecords)
      .where(
        and(
          eq(borrowRecords.userId, userId),
          eq(borrowRecords.bookId, bookId),
          eq(borrowRecords.status, "BORROWED")
        )
      )
      .limit(1);

    if (existingBorrow.length > 0) {
      return {
        success: false,
        error: "You have already borrowed this book",
      };
    }

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
