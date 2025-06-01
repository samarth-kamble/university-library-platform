"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useDebounce } from "react-use";
import { Input } from "./ui/input";

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
    <div className="search">
      <Image
        src={"/icons/search-fill.svg"}
        alt="Search Icon"
        width={21}
        height={21}
        className="cursor-pointer"
      />
      <Input
        type="text"
        value={search}
        placeholder="Search for books..."
        onChange={(e) => setSearch(e.target.value)}
        className="search-input w-full"
      />
    </div>
  );
};

export default Search;
