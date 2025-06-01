import dayjs from "dayjs";
import { serve } from "@upstash/workflow/nextjs";

import { db } from "@/database/drizzle";
import { sendEmail } from "@/lib/workflow";
import { users, books } from "@/database/schema";
import { eq } from "drizzle-orm";

type ReturnEventData = {
  userId: string;
  bookId: string;
  returnDate: string;
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

export const { POST } = serve<ReturnEventData>(async (context) => {
  const { userId, bookId, returnDate, dueDate } = context.requestPayload;

  console.log("RETURNING BOOK:", userId, bookId, returnDate, dueDate);

  const book = await getBookDetails(bookId);
  const user = await getUserDetails(userId);

  const { fullName, email } = user;
  const { title } = book;

  // Check if the book was returned on time or late
  const returnDateObj = dayjs(returnDate);
  const dueDateObj = dayjs(dueDate);
  const isLate = returnDateObj.isAfter(dueDateObj);
  const daysLate = isLate ? returnDateObj.diff(dueDateObj, "day") : 0;

  // Send return confirmation email
  await context.run("send-return-confirmation", async () => {
    let subject: string;
    let message: string;

    if (isLate) {
      subject = `Book "${title}" returned - Late return notice`;
      message = `Hi ${fullName},\n\nThank you for returning the book "${title}". However, the book was returned ${daysLate} day(s) late. The due date was ${dueDate}, but you returned it on ${returnDate}.\n\nPlease note that late fees may apply. Contact the library for more information about any charges.\n\nThank you for using our library service!`;
    } else {
      subject = `Book "${title}" returned successfully!`;
      message = `Hi ${fullName},\n\nThank you for returning the book "${title}" on time! We hope you enjoyed reading it.\n\nThe book was due on ${dueDate} and was returned on ${returnDate}.\n\nThank you for using our library service!`;
    }

    await sendEmail({
      email,
      subject,
      message,
    });
  });

  // If the book was returned late, send additional late fee notification after a delay
  if (isLate) {
    // Wait 1 hour before sending late fee details (gives time for system processing)
    await context.sleep("wait-before-late-fee-notice", 60 * 60);

    await context.run("send-late-fee-notice", async () => {
      await sendEmail({
        email,
        subject: `Late fee notice for "${title}"`,
        message: `Hi ${fullName},\n\nThis is a follow-up regarding the late return of "${title}".\n\nThe book was returned ${daysLate} day(s) late. According to our library policy, a late fee may apply.\n\nPlease visit the library or contact us to settle any outstanding fees.\n\nThank you for your understanding.`,
      });
    });
  }
});
