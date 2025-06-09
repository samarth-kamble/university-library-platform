import dayjs from "dayjs";
import { and, eq } from "drizzle-orm";
import { serve } from "@upstash/workflow/nextjs";

import { db } from "@/database/drizzle";
import { sendEmail } from "@/lib/workflow";
import { borrowRecords, users, books } from "@/database/schema";
import BookBorrowedEmailTemplate from "@/components/admin/email/BookBorrowedEmailTemplate";

type BorrowEventData = {
  userId: string;
  bookId: string;
  borrowDate: string;
  dueDate: string;
};

async function getBookDetails(bookId: string) {
  const bookDetails = await db
    .select()
    .from(books)
    .where(eq(books.id, bookId))
    .limit(1);

  return bookDetails[0];
}

async function getUserDetails(userId: string) {
  const userDetails = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return userDetails[0];
}

async function isBookReturned(userId: string, bookId: string) {
  const borrowRecord = await db
    .select()
    .from(borrowRecords)
    .where(
      and(eq(borrowRecords.userId, userId), eq(borrowRecords.bookId, bookId))
    )
    .limit(1);

  if (borrowRecord[0].status === "RETURNED") return true;

  return false;
}

export const { POST } = serve<BorrowEventData>(async (context) => {
  const { userId, bookId, borrowDate, dueDate } = context.requestPayload;

  console.log("BORROWING BOOK:", userId, bookId, borrowDate, dueDate);

  const book = await getBookDetails(bookId);
  const user = await getUserDetails(userId);

  const { fullName, email } = user;
  const { title } = book;

  // calculate difference between borrow date and due date
  const diff = dayjs(dueDate).diff(dayjs(borrowDate), "day");

  // Send initial borrow confirmation email
  await context.run("send-borrowed-email", async () => {
    await sendEmail({
      email,
      subject: `You borrowed "${title}"!`,
      message: BookBorrowedEmailTemplate({
        fullName,
        bookTitle: title,
        borrowDate,
        dueDate,
      }),
    });
  });

  // Wait until 1 day before due date to send reminder
  await context.sleep("wait-for-1-day-before-due", 60 * 60 * 24 * (diff - 1));

  // Send 1 day before due date reminder email
  await context.run("send-reminder-before-due", async () => {
    await sendEmail({
      email,
      subject: `Reminder: "${title}" is due tomorrow!`,
      message: `Hi ${fullName},\n\nThis is a reminder that the book "${title}" is due tomorrow. Please return it on time to avoid late fees.`,
    });
  });

  // Wait until the due date to send the "last day" reminder
  await context.sleep("wait-for-due-date", 60 * 60 * 24 * diff);

  // Send final day reminder email
  await context.run("send-final-reminder", async () => {
    await sendEmail({
      email,
      subject: `Today is the last day to return "${title}"!`,
      message: `Hi ${fullName},\n\nThis is the final reminder that today is the last day to return the book "${title}". Please return it today.`,
    });
  });

  // Wait until after due date to check if the book has been returned
  await context.sleep("wait-for-check-if-returned", 60 * 60 * 24 * (diff + 1));

  // Check if the book has been returned, if not, send overdue email
  const isReturned = await isBookReturned(userId, bookId);

  if (!isReturned) {
    await context.run("send-overdue-email", async () => {
      await sendEmail({
        email,
        subject: `🚨 Overdue. Return the book "${title}" to avoid charges.`,
        message: `Hi ${fullName},\n\nThe book "${title}" is overdue. If you don't return it soon, you will be charged for the late return. Please return it as soon as possible.`,
      });
    });
  }
});
