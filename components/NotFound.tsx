import Link from "next/link";
import Image from "next/image";

import { Button } from "./ui/button";

interface Props {
  title?: string;
  description?: string;
  linkBtn?: boolean;
}

const NotFound = ({
  title = "No Results Found",
  description = "We couldn’t find any books matching your search. Try using different keywords or check for typos.",
  linkBtn = false,
}: Props) => {
  return (
    <div id="not-found">
      <Image
        src="/images/no-books.png"
        alt="no-books"
        width={200}
        height={200}
        className="object-contain"
      />

      <h4>{title}</h4>
      <p>{description}</p>

      {linkBtn && (
        <Button asChild className="not-found-btn">
          <Link href="/library">Clear Search</Link>
        </Button>
      )}
    </div>
  );
};

export default NotFound;
