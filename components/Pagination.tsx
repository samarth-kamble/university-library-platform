"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Props {
  variant: "dark" | "light";
  hasNextPage?: boolean;
}

const Pagination = ({ variant, hasNextPage }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") || 1);

  const handlePageNavigation = (type: "next" | "previous") => {
    const params = new URLSearchParams(searchParams);
    const newPage = type === "next" ? page + 1 : Math.max(1, page - 1);

    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div id="pagination">
      <Button
        disabled={page === 1}
        className={cn(
          "min-h-10 font-semibold text-sm",
          variant === "dark" ? "pagination-btn_dark" : "pagination-btn_light"
        )}
        onClick={() => handlePageNavigation("previous")}
      >
        Previous
      </Button>
      <p
        className={cn(
          variant === "dark"
            ? "bg-light-200 text-black"
            : "bg-primary-admin text-white"
        )}
      >
        {page}
      </p>
      <Button
        disabled={!hasNextPage}
        className={cn(
          "min-h-10 font-semibold text-sm",
          variant === "dark" ? "pagination-btn_dark" : "pagination-btn_light"
        )}
        onClick={() => handlePageNavigation("next")}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
