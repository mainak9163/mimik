"use client";
import React, { useState, useEffect, FC, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

type ModalProps = {
  children: ReactNode;
};

const Modal: FC<ModalProps> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Adding event listener for 'Escape' key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCloseClick();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  function handleCloseClick() {
    setIsModalOpen(false);
  }

  return (
    <div
      className={cn(
        "fixed left-0 top-0 flex w-full h-full scroll-auto",
        isModalOpen ? "flex" : "hidden"
      )}
    >
      <div className="absolute p-8 w-full flex justify-end">
        {/* Close button */}
        <Button
          onClick={handleCloseClick}
          variant="outline"
          size="icon"
          className=" bg-black/50 cursor-pointer text-white border-white/20 hover:bg-black/70"
        >
          <X size={48} />
        </Button>
      </div>
      {children}
    </div>
  );
};

export default Modal;
