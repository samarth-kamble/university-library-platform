"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { changeUserRole } from "@/lib/admin/user";
import { DefaultSession } from "next-auth";

// Import your server action

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
  userId: string; // Add userId prop
  userName: string; // Add userName for better UX
}

const Menu = ({ label, initialValue, items, userId, userName }: Props) => {
  const { toast } = useToast();
  const [activeItem, setActiveItem] = useState(initialValue);
  const [isPending, startTransition] = useTransition();
  const { data: session } = useSession();

  const handleItemClick = async (value: string) => {
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
            description: `${userName}'s role has been changed to ${value}.`,
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
            className="disabled:opacity-50 disabled:cursor-not-allowed"
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

export default Menu;
