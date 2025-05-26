import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const CreateBookPage = () => {
  return (
    <>
      <Button asChild className="back-btn">
        <Link href="/admin/books">Go Back</Link>
      </Button>
    </>
  );
};

export default CreateBookPage;
