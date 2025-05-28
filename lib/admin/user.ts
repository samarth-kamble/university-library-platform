"use server";

import { revalidatePath } from "next/cache";
import { or, desc, asc, count, eq, ilike } from "drizzle-orm";

import { db } from "@/database/drizzle";
import { borrowRecords, users } from "@/database/schema";

const ITEMS_PER_PAGE = 20;

export async function getUsers({
  query,
  sort = "available",
  page = 1,
  limit = ITEMS_PER_PAGE,
}: QueryParams) {
  try {
    const searchConditions = query
      ? or(
          ilike(users.fullName, `%${query}%`),
          ilike(users.email, `%${query}%`)
        )
      : undefined;

    const sortOptions: Record<string, any> = {
      newest: desc(users.createdAt),
      oldest: asc(users.createdAt),
    };

    const sortingCondition = sortOptions[sort] || desc(users.createdAt);

    const usersData = await db
      .select({
        user: users,
        totalBorrowedBooks: count(borrowRecords.id).as("totalBorrowedBooks"),
      })
      .from(users)
      .leftJoin(
        borrowRecords,
        eq(borrowRecords.userId, users.id) // Match borrow records to users.
      )
      .where(searchConditions)
      .groupBy(users.id) // Group by user to get borrow counts.
      .orderBy(sortingCondition)
      .limit(limit)
      .offset((page - 1) * limit);

    const totalItems = await db
      .select({
        count: count(users.id),
      })
      .from(users)
      .where(searchConditions);

    const totalPages = Math.ceil(totalItems[0].count / ITEMS_PER_PAGE);
    const hasNextPage = page < totalPages;

    return {
      success: true,
      data: usersData,
      metadata: {
        totalPages,
        hasNextPage,
      },
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      success: false,
      error: "An error occurred while fetching users",
    };
  }
}

export async function updateAccountStatus(params: UpdateAccountStatusParams) {
  const { userId, status } = params;

  try {
    const updatedUser = await db
      .update(users)
      .set({ status })
      .where(eq(users.id, userId))
      .returning();

    revalidatePath("/admin/account-requests");
    return {
      success: true,
      data: updatedUser,
    };
  } catch (error) {
    console.error("Error updating user status:", error);
    return {
      success: false,
      error: "An error occurred while updating user status",
    };
  }
}
