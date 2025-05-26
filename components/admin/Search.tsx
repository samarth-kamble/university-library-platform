"use client";

import Image from "next/image";
import { useDebounce } from "react-use";
import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { Input } from "../ui/input";

const Search = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("query") || "");
  const [initialSearch, setInitialSearch] = useState(search);

  const updateQuery = useCallback(() => {
    const params = new URLSearchParams(searchParams);

    if (search && search !== initialSearch) {
      params.set("query", search);
    } else if (!search) {
      params.delete("query");
    }

    if (search !== initialSearch)
      router.push(`${pathname}?${params.toString()}`);
  }, [search, initialSearch, searchParams, pathname]);

  useEffect(() => {
    setInitialSearch(searchParams.get("query") || "");
  }, [searchParams]);

  useDebounce(updateQuery, 500, [search]);

  return (
    <div className="admin-search">
      <Image
        src="/icons/admin/search.svg"
        alt="search"
        width={21}
        height={21}
        className="cursor-pointer"
      />

      <Input
        type="text"
        value={search}
        placeholder="Search users, books by title, author, or genre."
        onChange={(e) => setSearch(e.target.value)}
        className="admin-search_input"
      />
    </div>
  );
};

export default Search;
