import { auth, signOut } from "@/auth";
import Avatar from "@/components/Avatar";
import BookList from "@/components/BookList";
import { Button } from "@/components/ui/button";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { getBorrowedBooks } from "@/lib/actions/book";
import config from "@/lib/config";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { redirect } from "next/navigation";
import React, { use } from "react";

interface BorrowedBookProps {
  data: BorrowedBook[];
  success: boolean;
}
const MyProfilePage = async () => {
  const session = await auth();
  if (!session?.user?.id) return;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session?.user?.id))
    .limit(1);

  if (!user) redirect("/404");

  const { data: borrowedBooks, success } = (await getBorrowedBooks(
    session?.user?.id
  )) as BorrowedBookProps;

  if (!success) redirect("/404");

  return (
    <>
      <section className="profile">
        <div className="id-card">
          <div className="inner">
            <div className="badge">
              <div className="badge-inner" />
            </div>
            <div>
              <Image
                src="/icons/verified.svg"
                alt="Verified Icon"
                width={50}
                height={50}
                className="absolute right-5 top-5"
              />
            </div>
            <div className="mt-20 flex flex-row items-center gap-3">
              <Avatar name={user.fullName} size="lg" />
              <div>
                <p className="text-2xl font-semibold text-white">
                  {user.fullName}
                </p>
                <p className="text-base text-light-100">{user.email}</p>
              </div>
            </div>
            <div className="mt-10">
              <p className="text-lg text-light-100">University</p>
              <p className="text-2xl font-semibold text-white">
                Vishwakarma Institute of Technology
              </p>
            </div>

            <div className="mt-10 ">
              <p className="text-lg text-light-100">Student ID</p>
              <p className="text-2xl font-semibold text-white">
                {user.universityId}
              </p>
            </div>

            <div className="relative mt-10 h-72 w-full">
              <Image
                src={`${config.env.imagekit.urlEndpoint}${user.universityCard}`}
                alt="University Card"
                fill
                className="size-full rounded-xl"
              />
            </div>
            <div className="validity">
              <p>
                Valid for {new Date().getFullYear()} -{" "}
                {new Date().getFullYear() + 1}
              </p>
            </div>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut();
              redirect("/sign-in");
            }}
          >
            <Button type="submit" variant="destructive" className="logout">
              Logout
            </Button>
          </form>
        </div>
        <div className="flex-1">
          {success && borrowedBooks.length > 0 ? (
            <BookList
              title="Borrowed Books"
              books={borrowedBooks}
              isBorrowed={true}
            />
          ) : (
            <div className="flex-1">No borrowed books</div>
          )}
        </div>
      </section>
    </>
  );
};

export default MyProfilePage;
