"use client";

import React, { useState, useTransition } from "react";
import {
  User,
  Mail,
  Calendar,
  Book,
  Clock,
  Edit,
  ArrowLeft,
  Shield,
  CheckCircle,
  XCircle,
  RefreshCw,
  FileDigit,
  University,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { changeUserRole, getUsers } from "@/lib/admin/user";
import AccountConfirmation from "./admin/dialogs/AccountConfirmation";
import Image from "next/image";
import config from "@/lib/config";

interface UserData {
  id: string;
  fullName: string;
  email: string;
  universityId?: number;
  universityCard?: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | null;
  role: "USER" | "ADMIN" | null;
  lastActivityDate?: string | null;
  createdAt: Date | null;
}

interface BookData {
  id: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  coverUrl: string;
  coverColor: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  videoUrl: string;
  summary: string;
  createdAt: Date | null;
}

interface BorrowRecord {
  id: string;
  bookTitle: BookData | null;
  borrowDate: Date;
  dueDate: string;
  returnDate: Date | null;
  status: "BORROWED" | "RETURNED" | "OVERDUE";
}

interface UserInfoDisplayProps {
  user: UserData;
  totalBorrowedBooks: number;
  borrowingHistory: BorrowRecord[];
}

const UserInfoDisplay = ({
  user,
  totalBorrowedBooks,
  borrowingHistory,
}: UserInfoDisplayProps) => {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("profile");
  const [isPending, startTransition] = useTransition();

  const initialValue = user.role === "ADMIN" ? "ADMIN" : "USER";
  const userId = user.id;

  const [activeItem, setActiveItem] = useState(initialValue);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800 border-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "USER":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getBorrowStatusColor = (status: string) => {
    switch (status) {
      case "RETURNED":
        return "bg-green-100 text-green-800 border-green-200";
      case "BORROWED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "OVERDUE":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleRoleChange = async (value: string) => {
    // Prevent changing if already the same role
    if (value === activeItem) {
      return;
    }

    // Check if user is admin (you'll need to add role to session - see auth config below)
    if (!session?.user?.role || session.user.role !== "ADMIN") {
      toast({
        title: "Permission Denied",
        description: "You do not have permission to change user roles.",
        variant: "destructive",
      });
      return;
    }

    // Convert lowercase role to uppercase for database
    const dbRole = value.toUpperCase() as "USER" | "ADMIN";

    startTransition(async () => {
      try {
        const result = await changeUserRole({
          userId,
          newRole: dbRole,
        });

        if (result.success) {
          setActiveItem(value);
          toast({
            title: "Role Changed",
            description: `Role has been changed to ${value}.`,
          });
        } else {
          toast({
            title: "Error",
            description: result.message || "Failed to change user role.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error changing user role:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred while changing the role.",
          variant: "destructive",
        });
      }
    });
  };

  // Get the use
  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const currentlyBorrowedBooks = borrowingHistory.filter(
    (record) => record.status === "BORROWED" || record.status === "OVERDUE"
  );
  const overdueBooks = borrowingHistory.filter(
    (record) => record.status === "OVERDUE"
  );

  return (
    <div className="space-y-6">
      {/* User Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {user.fullName}
                </h2>
                <p className="text-gray-500 mb-2">{user.email}</p>
                <div className="flex items-center space-x-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(user.status || "")}`}
                  >
                    {user.status}
                  </span>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(user.role || "")}`}
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    {user.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-2">
              {user.status === "PENDING" && (
                <div className="flex space-x-2">
                  <AccountConfirmation
                    user={{
                      ...user,
                      universityId: user.universityId || 0,
                      universityCard: user.universityCard || "",
                      lastActivityDate: user.lastActivityDate || null,
                    }}
                  />
                </div>
              )}

              {user.status === "APPROVED" && (
                <div className="flex space-x-2 space-y-2 flex-col">
                  <button
                    onClick={() =>
                      handleRoleChange(user.role === "ADMIN" ? "USER" : "ADMIN")
                    }
                    disabled={isPending}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    {isPending ? (
                      <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <Shield className="w-4 h-4 mr-1" />
                    )}
                    Make {user.role === "ADMIN" ? "User" : "Admin"}
                  </button>
                  <div className="-space-x-2">
                    <AccountConfirmation
                      user={{
                        ...user,
                        universityId: user.universityId || 0,
                        universityCard: user.universityCard || "",
                        lastActivityDate: user.lastActivityDate || null,
                      }}
                    />
                  </div>
                </div>
              )}

              {user.status === "REJECTED" && (
                <div className="flex space-x-2">
                  <AccountConfirmation
                    user={{
                      ...user,
                      universityId: user.universityId || 0,
                      universityCard: user.universityCard || "",
                      lastActivityDate: user.lastActivityDate || null,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <Book className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalBorrowedBooks}
                  </p>
                  <p className="text-sm text-gray-500">Total Borrowed</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <Clock className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {currentlyBorrowedBooks.length}
                  </p>
                  <p className="text-sm text-gray-500">Currently Borrowed</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <XCircle className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {overdueBooks.length}
                  </p>
                  <p className="text-sm text-gray-500">Overdue Books</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <Calendar className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatDate(user.createdAt || "")
                      .split(",")[1]
                      ?.trim() || new Date().getFullYear()}
                  </p>
                  <p className="text-sm text-gray-500">Member Since</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {["profile", "borrowing", "history"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Account Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-500">
                          Email Address
                        </span>
                        <p className="text-gray-900">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-500">Full Name</span>
                        <p className="text-gray-900">{user.fullName}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-500">Role</span>
                        <p className="text-gray-900">{user.role}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Account Status
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-500">
                          Created At
                        </span>
                        <p className="text-gray-900">
                          {formatDate(user.createdAt || "")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-500">
                          Last Activity Date
                        </span>
                        <p className="text-gray-900">
                          {formatDate(user.lastActivityDate || "")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-500">
                          Current Status
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status || "")}`}
                        >
                          {user.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    University Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <University className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-500">
                          University Name
                        </span>
                        <p className="text-gray-900">
                          Vishwakarma Institute of Technology, Pune
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FileDigit className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-500">
                          University ID
                        </span>
                        <p className="text-gray-900">{user.universityId}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    University ID Card
                  </h3>
                  <div className="relative h-72 w-full">
                    {user.universityCard ? (
                      <Image
                        src={`${config.env.imagekit.urlEndpoint}${user.universityCard}`}
                        alt="University ID Card"
                        fill
                        className="object-cover rounded-lg"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
                        <p className="text-gray-500">No ID Card Uploaded</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "borrowing" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Currently Borrowed Books
              </h3>
              {currentlyBorrowedBooks.length > 0 ? (
                <div className="space-y-3">
                  {currentlyBorrowedBooks.map((record) => (
                    <div
                      key={record.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Book className="w-5 h-5 text-gray-400" />
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {record.bookTitle?.title || "Unknown Title"}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {record.bookTitle?.author &&
                                `by ${record.bookTitle.author} • `}
                              Borrowed: {formatDate(record.borrowDate)} | Due:{" "}
                              {formatDate(record.dueDate)}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getBorrowStatusColor(record.status)}`}
                        >
                          {record.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Book className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No books currently borrowed</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Borrowing History
              </h3>
              {borrowingHistory.length > 0 ? (
                <div className="space-y-3">
                  {borrowingHistory.map((record) => (
                    <div
                      key={record.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Book className="w-5 h-5 text-gray-400" />
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {record.bookTitle?.title || "Unknown Title"}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {record.bookTitle?.author &&
                                `by ${record.bookTitle.author} • `}
                              Borrowed: {formatDate(record.borrowDate)}
                              {record.returnDate &&
                                ` | Returned: ${formatDate(record.returnDate)}`}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getBorrowStatusColor(record.status)}`}
                        >
                          {record.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No borrowing history available
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfoDisplay;
