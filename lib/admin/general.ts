"use server";

import { count, sql } from "drizzle-orm";

import { db } from "@/database/drizzle";
import { books, borrowRecords, users } from "@/database/schema";

export async function getStatistics() {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  try {
    const [userState] = await db
      .select({
        total: count(),
        currentWeek: sql<number>`count(*) FILTER (WHERE ${users.createdAt} >= ${oneWeekAgo})`,
        previousWeek: sql<number>`count(*) FILTER (WHERE ${users.createdAt} < ${oneWeekAgo} AND ${users.createdAt} >= ${twoWeeksAgo})`,
      })
      .from(users);

    const [bookState] = await db
      .select({
        total: count(),
        currentWeek: sql<number>`count(*) FILTER (WHERE ${books.createdAt} >= ${oneWeekAgo})`,
        previousWeek: sql<number>`count(*) FILTER (WHERE ${books.createdAt} < ${oneWeekAgo} AND ${books.createdAt} >= ${twoWeeksAgo})`,
      })
      .from(books);

    const [borrowRecordState] = await db
      .select({
        total: count(),
        currentWeek: sql<number>`count(*) FILTER (WHERE ${borrowRecords.createdAt} >= ${oneWeekAgo})`,
        previousWeek: sql<number>`count(*) FILTER (WHERE ${borrowRecords.createdAt} < ${oneWeekAgo} AND ${borrowRecords.createdAt} >= ${twoWeeksAgo})`,
      })
      .from(borrowRecords);

    return {
      success: true,
      data: {
        user: {
          total: userState.total || 0,
          currentWeek: userState.currentWeek || 0,
          previousWeek: userState.previousWeek || 0,
          change: userState.currentWeek - userState.previousWeek || 0,
        },
        book: {
          total: bookState.total || 0,
          currentWeek: bookState.currentWeek || 0,
          previousWeek: bookState.previousWeek || 0,
          change: bookState.currentWeek - bookState.previousWeek || 0,
        },
        borrowRecord: {
          total: borrowRecordState.total || 0,
          currentWeek: borrowRecordState.currentWeek || 0,
          previousWeek: borrowRecordState.previousWeek || 0,
          change:
            borrowRecordState.currentWeek - borrowRecordState.previousWeek || 0,
        },
      },
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Error creating book",
    };
  }
}
