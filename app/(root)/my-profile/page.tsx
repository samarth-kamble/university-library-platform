import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import React from "react";

const MyProfilePage = () => {
  return (
    <>
      <form
        action={async () => {
          "use server";

          await signOut();
        }}
        className="mb-10"
      >
        <Button>Logout</Button>
      </form>
    </>
  );
};

export default MyProfilePage;
