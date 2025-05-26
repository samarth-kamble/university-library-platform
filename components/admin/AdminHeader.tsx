import { Session } from "next-auth";
import React from "react";

const AdminHeader = ({ session }: { session: Session }) => {
  return (
    <header className="auth-header">
      <div>
        <h2 className="text-2xl font-semibold text-dark-400">
          {session?.user?.name}
        </h2>
        <p className="text-base text-slate-500">
          Moniter all of your books, users, and more from here.
        </p>
      </div>
      <p>Search</p>
    </header>
  );
};

export default AdminHeader;
