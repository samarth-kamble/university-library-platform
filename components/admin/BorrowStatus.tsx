"use client";

import { useState, useTransition } from "react";
import { updateBorrowStatus } from "@/lib/actions/book";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface MenuItem {
  value: string;
  label: string;
  bgColor: string;
  textColor: string;
}

interface Props {
  label: string;
  initialValue: string;
  items: MenuItem[];
  borrowRecordId: string;
  onStatusChange?: () => void; // ADD THIS LINE - optional callback prop
}

const BorrowStatusMenu = ({
  label,
  initialValue,
  items,
  borrowRecordId,
  onStatusChange, // ADD THIS LINE - destructure the new prop
}: Props) => {
  const { toast } = useToast();
  const [activeItem, setActiveItem] = useState(initialValue);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleItemClick = (value: string) => {
    if (value === activeItem) return;

    startTransition(async () => {
      try {
        const result = await updateBorrowStatus({
          borrowRecordId,
          status: value.toUpperCase() as "BORROWED" | "RETURNED" | "OVERDUE",
        });

        if (result.success) {
          setActiveItem(value);
          toast({
            title: "Status Updated",
            description: `Borrow status changed to ${value}`,
          });

          // MODIFY THIS SECTION - Call callback if provided, otherwise use router.refresh
          if (onStatusChange) {
            onStatusChange();
          } else {
            router.refresh();
          }
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to update status",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error updating status:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred while updating status",
          variant: "destructive",
        });
      }
    });
  };

  const activeMenuItem =
    items.find((item) => item.value === activeItem) || items[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="capitalize w-fit text-center text-sm font-medium px-5 py-1 rounded-full outline-none ring-0 focus:ring-0 disabled:opacity-50"
          style={{
            backgroundColor: activeMenuItem.bgColor,
            color: activeMenuItem.textColor,
          }}
          disabled={isPending}
        >
          {isPending ? "Updating..." : activeMenuItem.label}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator className="mb-2" />
        {items.map((item) => (
          <DropdownMenuItem
            key={item.value}
            onClick={() => handleItemClick(item.value)}
            disabled={isPending || item.value === activeItem}
          >
            <p
              className="capitalize w-fit text-center text-sm font-medium px-5 py-1 rounded-full"
              style={{
                backgroundColor: item.bgColor,
                color: item.textColor,
              }}
            >
              {item.label}
            </p>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BorrowStatusMenu;
