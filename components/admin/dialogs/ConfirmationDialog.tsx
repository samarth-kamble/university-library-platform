"use client";

import Image from "next/image";
import { useState, useTransition } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Button } from "../../ui/button";

import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface ConfirmationDialogProps {
  variant: "approve" | "deny";
  title: string;
  description: string;
  triggerLabel: string;
  onConfirm: () => void;
  confirmLabel: string;
  iconSrc?: string;
}

const ConfirmationDialog = ({
  variant,
  title,
  description,
  triggerLabel,
  onConfirm,
  confirmLabel,
  iconSrc = "/icons/admin/info.svg",
}: ConfirmationDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isApprove = variant === "approve";

  const handleConfirm = () => {
    startTransition(() => {
      try {
        onConfirm();
        toast({
          title: "Success",
          description: "Your request has been processed successfully.",
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while processing your request.",
          variant: "destructive",
        });
        console.log(error);
      } finally {
        setIsOpen(false);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger asChild>
        <Button
          className={cn(
            "confirm-trigger",
            isApprove ? "confirm-approve" : "confirm-reject"
          )}
        >
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="confirm-content">
        <DialogHeader className="w-full">
          <div
            className={cn(
              "confirm-illustration",
              isApprove ? "bg-green-400/10" : "bg-red-400/10"
            )}
          >
            <div className={cn(isApprove ? "bg-green-400" : "bg-red-400")}>
              <Image
                src={iconSrc}
                width={30}
                height={30}
                alt="info"
                className="object-contain"
              />
            </div>
          </div>

          <DialogTitle className="text-center pt-5 font-semibold text-xl text-dark-400">
            {title}
          </DialogTitle>
          <DialogDescription className="text-center pt-2.5 text-light-500">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="w-full mt-5">
          <Button
            type="button"
            disabled={isPending}
            className={cn(
              "confirm-btn",
              isApprove
                ? "bg-green-400 hover:bg-green-400/90"
                : "bg-red-400 hover:bg-red-400/90"
            )}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
