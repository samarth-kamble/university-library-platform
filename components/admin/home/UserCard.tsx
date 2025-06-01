import Avatar from "@/components/Avatar";
import React from "react";

interface Props {
  name: string;
  email: string;
}

const UserCard = ({ name, email }: Props) => {
  return (
    <div className="user-card">
      <Avatar name={name} />
      <p className="name">{name}</p>
      <p className="email">{email}</p>
    </div>
  );
};

export default UserCard;
