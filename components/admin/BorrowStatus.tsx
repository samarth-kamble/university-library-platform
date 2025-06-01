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
  onStatusChange?: () => void;
}

const BorrowStatusMenu = ({
  label,
  initialValue,
  items,
  borrowRecordId,
  onStatusChange,
}: Props) => {
  const { toast } = useToast();
  const [activeItem, setActiveItem] = useState(initialValue);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Updated status colors
  const getStatusColors = (value: string) => {
    switch (value.toLowerCase()) {
      case "borrowed":
        return { bgColor: "#3B82F6", textColor: "#FFFFFF" }; // Blue background
      case "returned":
        return { bgColor: "#10B981", textColor: "#FFFFFF" }; // Green background
      case "overdue":
        return { bgColor: "#EF4444", textColor: "#FFFFFF" }; // Red background
      default:
        return { bgColor: "#6B7280", textColor: "#FFFFFF" }; // Gray background
    }
  };

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
  const activeColors = getStatusColors(activeItem);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="capitalize w-fit text-center text-sm font-medium px-5 py-1 rounded-full outline-none ring-0 focus:ring-0 disabled:opacity-50"
          style={{
            backgroundColor: activeColors.bgColor,
            color: activeColors.textColor,
          }}
          disabled={isPending}
        >
          {isPending ? "Updating..." : activeMenuItem.label}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator className="mb-2" />
        {items.map((item) => {
          const itemColors = getStatusColors(item.value);
          return (
            <DropdownMenuItem
              key={item.value}
              onClick={() => handleItemClick(item.value)}
              disabled={isPending || item.value === activeItem}
            >
              <p
                className="capitalize w-fit text-center text-sm font-medium px-5 py-1 rounded-full"
                style={{
                  backgroundColor: itemColors.bgColor,
                  color: itemColors.textColor,
                }}
              >
                {item.label}
              </p>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BorrowStatusMenu;
