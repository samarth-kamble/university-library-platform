import React from "react";
import { notFound } from "next/navigation";
import UserInfoDisplay from "@/components/UserInfoDisplay";
import { getUserById } from "@/lib/admin/user";
import dayjs from "dayjs";

interface PageProps {
  params: Promise<{ id: string }>;
}

const UserIdPage = async ({ params }: PageProps) => {
  const { id } = await params;

  const result = await getUserById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const { user, totalBorrowedBooks, borrowingHistory } = result.data;

  const userWithUpdatedAt = {
    ...user,
    createdAt: user.createdAt
      ? user.createdAt.toISOString()
      : new Date().toISOString(),
    updatedAt: user.createdAt
      ? user.createdAt.toISOString()
      : new Date().toISOString(),
    role: user.role ?? "USER",
    status: user.status ?? "PENDING",
  };

  // Transform borrowingHistory to ensure proper types
  const transformedBorrowingHistory = borrowingHistory.map((record) => ({
    ...record,
    borrowDate: dayjs(record.borrowDate).toDate(),
    dueDate:
      typeof record.dueDate === "string"
        ? record.dueDate
        : dayjs(record.dueDate).format(), // ISO format
    returnDate: record.returnDate ? dayjs(record.returnDate).toDate() : null,
    // Also handle bookTitle.createdAt if it exists and needs conversion
    bookTitle: record.bookTitle
      ? {
          ...record.bookTitle,
          createdAt: record.bookTitle.createdAt
            ? dayjs(record.bookTitle.createdAt).toDate()
            : null,
        }
      : null,
  }));

  return (
    <UserInfoDisplay
      user={userWithUpdatedAt}
      totalBorrowedBooks={totalBorrowedBooks}
      borrowingHistory={transformedBorrowingHistory}
    />
  );
};

export default UserIdPage;
