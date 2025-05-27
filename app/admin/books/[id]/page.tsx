import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import BookCover from "@/components/BookCover";
import BookVideo from "@/components/BookVideo";
import { Button } from "@/components/ui/button";
import { getBook } from "@/lib/admin/book";

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
  const { success, data: book } = (await getBook({ id })) as {
    success: boolean;
    data: Book;
  };

  if (!success) redirect("/404");

  return (
    <>
      <Button asChild className="back-btn">
        <Link href="/admin/books">Go Back</Link>
      </Button>

      <div className="w-full">
        <section className="flex lg:flex-row flex-col gap-12">
          <div
            className="py-10 px-20 lg:w-fit w-full rounded-md flex justify-center items-center"
            style={{
              background: `${book.coverColor}4d`,
            }}
          >
            <BookCover
              variant="regular"
              coverUrl={book.coverUrl}
              coverColor={book.coverColor}
            />
          </div>

          <div className="flex-1 flex flex-col">
            <div className="flex flex-row items-center gap-2">
              <p className="text-lg text-light-500">Created At:</p>
              <Image
                src="/icons/admin/calendar.svg"
                width={20}
                height={20}
                alt="calendar"
              />
              <p className="text-dark-200 text-base">
                {dayjs(book.createdAt).format("DD/MM/YYYY")}
              </p>
            </div>

            <h2 className="mt-5 font-semibold text-2xl text-dark-400">
              {book.title}
            </h2>
            <p className="text-dark-200 text-lg font-semibold mt-2.5">
              By {book.author}
            </p>
            <p className="text-base text-light-500 mt-2">{book.genre}</p>

            <p className="text-dark-700 text-base mt-5">{book.description}</p>

            <Button
              className="font-bold text-sm min-h-12 mt-5 bg-primary-admin hover:bg-primary-admin/70"
              asChild
            >
              <Link href={`/admin/books/${id}/edit`}>
                <Image
                  src="/icons/admin/edit.svg"
                  width={20}
                  height={20}
                  alt="edit"
                  className="brightness-0 invert"
                />
                Edit Book
              </Link>
            </Button>
          </div>
        </section>

        <div className="flex lg:flex-row flex-col gap-12 mt-10">
          <section className="flex-1">
            <h3 className="text-dark-400 font-semibold text-xl">Summary</h3>
            <div className="space-y-5 mt-5 text-slate-500">
              {book.summary
                ?.split("\n")
                .map((line, index) => <p key={index}>{line}</p>)}
            </div>
          </section>

          <section className="flex-1">
            <h3 className="text-dark-400 font-semibold text-xl mb-5">Video</h3>
            <BookVideo videoUrl={book.videoUrl} />
          </section>
        </div>
      </div>
    </>
  );
};

export default Page;
