import NotFound from "./NotFound";
import Sort from "./Sort";
import { BorrowedBook, NormalBook } from "./BookCard";

interface Props {
  title: string;
  books: Book[] | BorrowedBook[];
  isBorrowed?: boolean;
  containerClassName?: string;
  showSorts?: boolean;
  showNoResultBtn?: boolean;
}

const BookList = ({
  title,
  books,
  isBorrowed,
  containerClassName,
  showSorts = false,
  showNoResultBtn = false,
}: Props) => {
  return (
    <section className={containerClassName}>
      <div className="flex flex-row items-center justify-between">
        <h2 className="font-bebas-neue text-4xl text-light-100">{title}</h2>

        {showSorts && <Sort />}
      </div>

      <ul className="book-list">
        {books.length > 0 ? (
          books.map((item) =>
            !isBorrowed ? (
              <NormalBook key={item.id} {...(item as Book)} />
            ) : (
              <BorrowedBook key={item.id} {...(item as BorrowedBook)} />
            )
          )
        ) : (
          <NotFound linkBtn={showNoResultBtn} />
        )}
      </ul>
    </section>
  );
};

export default BookList;
