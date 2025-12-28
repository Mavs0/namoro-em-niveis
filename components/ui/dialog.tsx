"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface DialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  closeOnOutsideClick?: boolean;
}

export function Dialog({
  open,
  onOpenChange,
  children,
  closeOnOutsideClick = false,
}: DialogProps) {
  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (!closeOnOutsideClick && e.target === e.currentTarget) {
      e.preventDefault();
      e.stopPropagation();
    } else if (closeOnOutsideClick && onOpenChange) {
      onOpenChange(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className="relative z-50 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
  showCloseButton?: boolean;
}

export function DialogContent({
  className,
  children,
  onClose,
  showCloseButton = true,
  ...props
}: DialogContentProps) {
  return (
    <div
      className={cn(
        "relative bg-background border border-retro-blue/30 rounded-lg shadow-lg p-6",
        className
      )}
      {...props}
    >
      {showCloseButton && onClose && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Fechar</span>
        </Button>
      )}
      {children}
    </div>
  );
}

interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DialogHeader({ className, ...props }: DialogHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1.5 text-center sm:text-left",
        className
      )}
      {...props}
    />
  );
}

interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export function DialogTitle({ className, ...props }: DialogTitleProps) {
  return (
    <h2
      className={cn(
        "pixel-font text-lg leading-none tracking-tight",
        className
      )}
      {...props}
    />
  );
}
