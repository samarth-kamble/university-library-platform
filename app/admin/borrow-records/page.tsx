"use client";

import BorrowStatusMenu from "@/components/admin/BorrowStatus";
import Avatar from "@/components/Avatar";
import BookCover from "@/components/BookCover";
import BookReceipt from "@/components/BookReceipt";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { borrowStatuses } from "@/constants";
import { getBorrowRecords } from "@/lib/admin/book";
import dayjs from "dayjs";
import React, { useState, useEffect, useCallback } from "react";

// Helper function to determine status based on dates
function getActualStatus(record: any) {
  if (record.borrow.status === "RETURNED") {
    return "returned";
  }

  const today = new Date();
  const dueDate = new Date(record.borrow.dueDate);

  if (today > dueDate && record.borrow.status === "BORROWED") {
    return "overdue";
  }

  return "borrowed";
}

interface PageProps {
  searchParams: Promise<{
    query?: string;
    sort?: string;
    page?: string;
  }>;
}

const BorrowBookRecordPage = ({ searchParams }: PageProps) => {
  const [allRecords, setAllRecords] = useState<any[]>([]);
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolvedParams, setResolvedParams] = useState<{
    query?: string;
    sort?: string;
    page?: string;
  }>({});

  // Resolve the Promise-based searchParams
  useEffect(() => {
    const resolveParams = async () => {
      const params = await searchParams;
      setResolvedParams(params);
    };
    resolveParams();
  }, [searchParams]);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const { data, metadata: meta } = await getBorrowRecords({
        query: resolvedParams.query,
        sort: resolvedParams.sort,
        page: resolvedParams.page
          ? parseInt(resolvedParams.page, 10)
          : undefined,
      });
      // Sort records by newest first (most recent borrow date)
      const sortedData = (data || []).sort((a, b) => {
        const dateA = new Date(a.borrow.borrowDate);
        const dateB = new Date(b.borrow.borrowDate);
        return dateB.getTime() - dateA.getTime(); // Newest first
      });

      setAllRecords(sortedData);
      setMetadata(meta);
    } catch (err) {
      setError("Failed to fetch borrow records");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, [resolvedParams.query, resolvedParams.sort, resolvedParams.page]);

  // Initial data fetch
  useEffect(() => {
    if (
      Object.keys(resolvedParams).length > 0 ||
      resolvedParams.query === undefined
    ) {
      fetchData();
    }
  }, [fetchData, resolvedParams]);

  // Removed automatic polling - only manual refresh now

  // Handle status change callback
  const handleStatusChange = useCallback(async () => {
    // Refresh data when status changes
    await fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <section className="w-full rounded-2xl bg-white p-7">
        <h2 className="text-xl font-semibold">Borrow Book Request</h2>
        <div className="mt-7 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full rounded-2xl bg-white p-7">
        <h2 className="text-xl font-semibold">Borrow Book Request</h2>
        <div className="mt-7 text-center text-red-500">
          {error}
          <button
            onClick={fetchData}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Borrow Book Request</h2>
        <button
          onClick={fetchData}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          title="Refresh data"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="mt-7 w-full overflow-hidden">
        <Table className="overflow-hidden">
          <TableHeader>
            <TableRow className="h-14 border-none bg-light-100">
              <TableHead className="w-72">Book Title</TableHead>
              <TableHead>User Requested</TableHead>
              <TableHead>Borrowed Date</TableHead>
              <TableHead>Return Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Receipt</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {allRecords.length > 0 ? (
              allRecords.map((record) => {
                const actualStatus = getActualStatus(record);

                return (
                  <TableRow
                    key={record.borrow.id}
                    className="border-b-dark-100/5"
                  >
                    <TableCell className="py-5 font-medium">
                      <div className="flex w-72 flex-row items-center gap-2 text-sm font-semibold text-dark-400">
                        <BookCover
                          variant="extraSmall"
                          coverUrl={record.coverUrl}
                          coverColor={record.coverColor}
                        />
                        <p className="flex-1">{record.title}</p>
                      </div>
                    </TableCell>

                    <TableCell className="text-sm">
                      <div className="flex flex-row items-center gap-2">
                        <Avatar name={record.user.fullName} size="md" />
                        <div>
                          <p className="font-semibold text-dark-400">
                            {record.user.fullName}
                          </p>
                          <p className="text-dark-100">{record.user.email}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-sm font-medium text-dark-200">
                      {dayjs(record.borrow.borrowDate).format("MMM DD, YYYY")}
                    </TableCell>
                    <TableCell className="text-sm font-medium text-dark-200">
                      {record.borrow.returnDate
                        ? dayjs(record.borrow.returnDate).format("MMM DD, YYYY")
                        : "---"}
                    </TableCell>
                    <TableCell className="text-sm font-medium text-dark-200">
                      {dayjs(record.borrow.dueDate).format("MMM DD, YYYY")}
                    </TableCell>
                    <TableCell>
                      <BorrowStatusMenu
                        label="Change Status"
                        initialValue={actualStatus}
                        items={borrowStatuses}
                        borrowRecordId={record.borrow.id}
                        onStatusChange={handleStatusChange} // Pass the callback here
                      />
                    </TableCell>
                    <TableCell>
                      <BookReceipt
                        btnVariant="admin"
                        {...(record as BorrowedBook)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center pt-10">
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default BorrowBookRecordPage;
