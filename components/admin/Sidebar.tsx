"use client";
import { adminSideBarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Avatar from "../Avatar";
import { Session } from "next-auth";

const Sidebar = ({ session }: { session: Session }) => {
  const pathname = usePathname();
  return (
    <div className="admin-sidebar">
      <div>
        <div className="logo">
          <Image
            src={"/icons/admin/logo.svg"}
            alt="logo"
            width={37}
            height={37}
          />
          <h1>Bookwise</h1>
        </div>
        <div className="mt-10 flex flex-col gap-5">
          {adminSideBarLinks.map((link) => {
            const isSelected =
              (link.route !== "/admin" &&
                pathname.includes(link.route) &&
                link.route.length > 1) ||
              pathname === link.route;
            return (
              <Link
                href={link.route}
                key={link.route}
                className={cn(
                  "link",
                  isSelected && "bg-primary-admin shadow-sm"
                )}
              >
                <div className="relative size-5 ">
                  <Image
                    src={link.img}
                    alt={link.text}
                    fill
                    className={`${isSelected ? "brightness-0 invert" : ""} object-contain`}
                  />
                </div>{" "}
                <p className={cn(isSelected ? "text-white" : "text-dark-200")}>
                  {link.text}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="user">
        <Avatar name={session?.user?.name || ""} size="md" />

        <div className="flex flex-col max-md:hidden">
          <p className="font-semibold text-dark-200">{session?.user?.name}</p>
          <p className="text-light-500 text-xs">{session?.user?.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
