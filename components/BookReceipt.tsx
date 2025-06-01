"use client";

import dayjs from "dayjs";
import Image from "next/image";
import html2canvas from "html2canvas";
import { jsPDF as JsPDF } from "jspdf";

import { Button } from "./ui/button";

interface Props extends BorrowedBook {
  btnVariant?: "user" | "admin" | "preview";
}

const BookReceipt = (props: Props) => {
  const {
    id,
    title,
    author,
    genre,
    coverColor,
    borrow,
    btnVariant = "user",
  } = props;
  const { borrowDate, dueDate } = borrow;

  const formattedDueDate = dayjs(dueDate).format("MMM DD, YYYY");
  const formattedBorrowDate = dayjs(borrowDate).format("MMM DD, YYYY");

  const totalDays = dayjs(dueDate).diff(dayjs(borrowDate), "day");

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();

    const ticket = document.getElementById("book-ticket");
    if (ticket) {
      // Temporarily make the section visible off-screen
      ticket.style.position = "absolute";
      ticket.style.left = "-9999px";
      ticket.style.display = "block";

      // Capture the section as a canvas
      const canvas = await html2canvas(ticket, {
        scale: 2,
        backgroundColor: "#000000",
      });

      // Convert canvas to PDF
      const imgData = canvas.toDataURL("image/png");
      const pdf = new JsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

      // Save the PDF
      pdf.save("BookWise_Ticket.pdf");

      // Re-hide the section
      ticket.style.display = "none";
      ticket.style.position = "";
      ticket.style.left = "";
    }
  };

  return (
    <>
      {btnVariant === "user" ? (
        <Button
          className="p-2 rounded-md flex justify-center items-center"
          style={{ backgroundColor: `${coverColor}4d` }}
          onClick={handleDownload}
        >
          <Image
            src="/icons/receipt.svg"
            alt="receipt"
            width={16}
            height={16}
            className="object-contain"
          />
        </Button>
      ) : btnVariant === "admin" ? (
        <Button className="book-receipt_admin-btn" onClick={handleDownload}>
          <Image
            src="/icons/admin/receipt.svg"
            width={16}
            height={16}
            className="object-contain"
            alt="receipt"
          />
          Generate
        </Button>
      ) : (
        <button
          type="button"
          onClick={handleDownload}
          className="size-8 bg-white rounded-md flex justify-center items-center"
        >
          <Image
            src="/icons/admin/eye.svg"
            alt="eye"
            width={20}
            height={20}
            className="object-contain"
          />
        </button>
      )}

      <section id="book-ticket">
        <div className="flex items-center gap-2 px-8">
          <Image
            src="/icons/logo.svg"
            alt="logo"
            width={40}
            height={32}
            className="object-contain"
          />
          <p className="text-2xl font-semibold text-white">BookWise</p>
        </div>

        <div className="mt-9 px-8">
          <h3 className="text-2xl font-bold text-white">Borrow Receipt</h3>

          <p className="mt-3 text-base text-light-700">
            Receipt ID: <span className="font-bold text-light-200">#{id}</span>
          </p>
          <p className="mt-1 text-base text-light-700">
            Date Issued:{" "}
            <span className="font-bold text-light-200">
              {formattedBorrowDate}
            </span>
          </p>
        </div>

        <div className="my-10 h-px w-full border-dotted bg-light-100/10" />

        <div className="px-8">
          <h4 className="text-lg font-bold text-white">Book Details</h4>

          <div className="mt-5 grid grid-cols-2 gap-5" id="book-details">
            <div>
              <p>Title</p>
              <p>{title}</p>
            </div>

            <div>
              <p>Author</p>
              <p>{author}</p>
            </div>

            <div>
              <p>Category</p>
              <p>{genre}</p>
            </div>

            <div>
              <p>Borrowed on</p>
              <p>{formattedBorrowDate}</p>
            </div>

            <div>
              <p>Due Date</p>
              <p>{formattedDueDate}</p>
            </div>

            <div>
              <p>Duration</p>
              <p>{totalDays} days</p>
            </div>
          </div>
        </div>

        <div className="relative" id="book-divider">
          <div />
          <div className="my-10 h-px w-full bg-light-100/10 " />
          <div />
        </div>

        <div className="px-8">
          <h4 className="text-lg font-bold text-white">Terms</h4>
          <ul className="mt-2 list-disc pl-5">
            <li className="text-base text-light-700">
              Please return the book by the due date.
            </li>
            <li className="text-base text-light-700">
              Lost or damaged books may incur replacement costs.
            </li>
          </ul>
        </div>

        <div className="my-10 h-px w-full bg-light-100/10" />

        <div className="px-8 text-center text-light-700">
          <p>
            Thank you for using{" "}
            <span className="font-semibold text-light-200">BookWise</span>. For
            any questions or concerns, please contact us at{" "}
            <span className="font-semibold text-light-200">
              support@bookwise.com
            </span>
          </p>
        </div>

        <div className="book-ticket-circles">
          {[...Array(17)].map((_, index) => (
            <div key={index} className="size-7 rounded-full bg-black" />
          ))}
        </div>
      </section>
    </>
  );
};

export default BookReceipt;
