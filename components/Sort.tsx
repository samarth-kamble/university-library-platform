"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { sorts } from "@/constants";

const Sort = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Select onValueChange={handleSort}>
      <SelectTrigger className="select-trigger">
        <SelectValue placeholder="Sort By" />
      </SelectTrigger>

      <SelectContent className="select-content">
        {sorts.map((sort) => (
          <SelectItem
            key={sort.value}
            value={sort.value}
            className="select-item"
          >
            {sort.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default Sort;
