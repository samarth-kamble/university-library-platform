import { eq, ne } from "drizzle-orm";
import { redirect } from "next/navigation";

import BookList from "@/components/BookList";
import BookVideo from "@/components/BookVideo";
import BookOverview from "@/components/BookOverview";

import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";

const Page = async ({ params }: PageProps) => {
  const id = (await params).id;
  const session = await auth();

  const [[book], similarBooks] = await Promise.all([
    db.select().from(books).where(eq(books.id, id)).limit(1) as Promise<Book[]>,
    db.select().from(books).where(ne(books.id, id)).limit(4) as Promise<Book[]>,
  ]);

  if (!book) redirect("/404");

  return (
    <>
      <BookOverview {...book} userId={session?.user?.id as string} />

      <div className="book-details">
        <div className="flex-[1.5]">
          <section className="flex flex-col gap-7">
            <h3>Video</h3>
            <BookVideo videoUrl={book.videoUrl} />
          </section>

          <section className="mt-10 flex flex-col gap-7">
            <h3>Summary</h3>
            <div className="space-y-5 text-xl text-light-100">
              {book.summary
                ?.split("\n")
                .map((line, index) => <p key={index}>{line}</p>)}
            </div>
          </section>
        </div>

        <section className="sticky top-5 h-fit flex-1">
          {similarBooks.length > 0 && (
            <BookList title="More Similar Books" books={similarBooks} />
          )}
        </section>
      </div>
    </>
  );
};

export default Page;
