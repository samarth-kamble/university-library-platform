"use server";

import { revalidatePath } from "next/cache";
import { or, desc, asc, count, eq, ilike } from "drizzle-orm";

import { db } from "@/database/drizzle";
import { auth } from "@/auth";
import { borrowRecords, users, books } from "@/database/schema";

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

export async function changeUserRole(params: ChangeUserRoleParams) {
  const { userId, newRole } = params;

  try {
    // Get the current user's session
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Authentication required",
      };
    }

    // Check if the current user is an admin
    const currentUser = await db
      .select({
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!currentUser.length || currentUser[0].role !== "ADMIN") {
      return {
        success: false,
        error: "Unauthorized: Only admins can change user roles",
      };
    }

    // Prevent admin from changing their own role (optional security measure)
    if (userId === session.user.id) {
      return {
        success: false,
        error: "You cannot change your own role",
      };
    }

    // Check if target user exists
    const targetUser = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!targetUser.length) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Update the user's role
    const updatedUser = await db
      .update(users)
      .set({
        role: newRole,
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        role: users.role,
      });

    // Revalidate relevant paths
    revalidatePath("/admin/users");
    revalidatePath("/admin/account-requests");

    return {
      success: true,
      data: updatedUser[0],
      message: `Successfully changed ${targetUser[0].fullName}'s role to ${newRole.toLowerCase()}`,
    };
  } catch (error) {
    console.error("Error changing user role:", error);
    return {
      success: false,
      error: "An error occurred while changing user role",
    };
  }
}

export async function getUserById(userId: string) {
  try {
    const userData = await db
      .select({
        user: users,
        totalBorrowedBooks: count(borrowRecords.id).as("totalBorrowedBooks"),
      })
      .from(users)
      .leftJoin(borrowRecords, eq(borrowRecords.userId, users.id))
      .where(eq(users.id, userId))
      .groupBy(users.id)
      .limit(1);

    if (!userData.length) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Import the books table from your schema

    // Get user's borrowing history with book titles
    const borrowingHistory = await db
      .select({
        id: borrowRecords.id,
        bookTitle: books, // Get title from books table
        borrowDate: borrowRecords.borrowDate,
        dueDate: borrowRecords.dueDate,
        returnDate: borrowRecords.returnDate,
        status: borrowRecords.status,
      })
      .from(borrowRecords)
      .leftJoin(books, eq(borrowRecords.bookId, books.id))
      .where(eq(borrowRecords.userId, userId))
      .orderBy(desc(borrowRecords.borrowDate))
      .limit(10);

    return {
      success: true,
      data: {
        ...userData[0],
        borrowingHistory,
      },
    };
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return {
      success: false,
      error: "An error occurred while fetching user details",
    };
  }
}
