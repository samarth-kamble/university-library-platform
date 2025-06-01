"use client";

import Link from "next/link";
import Image from "next/image";
import { Session } from "next-auth";
import { usePathname } from "next/navigation";

import Avatar from "./Avatar";
import { cn } from "@/lib/utils";

const Header = ({ session }: { session: Session }) => {
  const pathname = usePathname();

  return (
    <header className="my-10 flex items-center justify-between gap-5">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/icons/logo.svg" width={40} height={40} alt="site-logo" />
        <span className="font-bold text-2xl text-gray-50">BookWise</span>
      </Link>

      <ul className="flex flex-row items-center gap-8 font-bold">
        <li>
          <Link
            href="/"
            className={cn(
              "text-base cursor-pointer capitalize",
              pathname === "/" ? "text-light-200" : "text-light-100"
            )}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            href="/library"
            className={cn(
              "text-base cursor-pointer capitalize",
              pathname === "/library" ? "text-light-200" : "text-light-100"
            )}
          >
            Library
          </Link>
        </li>

        <li>
          <Link href="/my-profile">
            <Avatar name={session?.user?.name || ""} />
          </Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;
