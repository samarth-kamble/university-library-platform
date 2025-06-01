import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import ErrorFallback from "@/components/admin/ErrorFallback";
import Loading from "@/components/admin/Loading";
import Statistics from "@/components/admin/home/Statistics";
import BorrowRequests from "@/components/admin/home/BorrowRequests";
import AccountRequests from "@/components/admin/home/AccountRequests";
import RecentBooks from "@/components/admin/home/RecentBooks";

const HomePage = () => {
  return (
    <>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<Loading />}>
          <Statistics />
        </Suspense>
      </ErrorBoundary>
      <div className="mt-5 flex gap-5">
        <div className="flex-1 flex flex-col gap-5">
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Loading />}>
              <BorrowRequests />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Loading />}>
              <AccountRequests />
            </Suspense>
          </ErrorBoundary>
        </div>
        <div className="flex-1">
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Loading />}>
              <RecentBooks />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </>
  );
};

export default HomePage;
