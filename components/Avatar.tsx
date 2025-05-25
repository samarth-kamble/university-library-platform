import { cn, getInitials } from "@/lib/utils";
import React from "react";

interface Props {
  name: string;
  size?: "xs" | "sm" | "md" | "lg";
  bgColor?: string;
  textColor?: string;
}

const sizeClasses = {
  xs: "size-5 text-[8px]",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-20 text-3xl",
};

const Avatar = ({
  name,
  size = "md",
  bgColor = "bg-blue-500",
  textColor = "text-white",
}: Props) => {
  const initials = getInitials(name);

  return (
    <div
      className={cn(
        sizeClasses[size],
        bgColor,
        textColor,
        "rounded-full flex items-center justify-center font-semibold"
      )}
    >
      {initials}
    </div>
  );
};

export default Avatar;
