"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState, type ComponentProps } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PasswordInputProps = Omit<ComponentProps<typeof Input>, "type"> & {
  showLabel: string;
  hideLabel: string;
};

export function PasswordInput({
  className,
  showLabel,
  hideLabel,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        type={visible ? "text" : "password"}
        className={cn("pr-10", className)}
        {...props}
      />
      <button
        type="button"
        tabIndex={-1}
        className="absolute inset-y-0 right-0 flex items-center px-2.5 text-muted-foreground transition-colors hover:text-foreground"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? hideLabel : showLabel}
        aria-pressed={visible}
      >
        {visible ? (
          <EyeOffIcon className="size-4" aria-hidden />
        ) : (
          <EyeIcon className="size-4" aria-hidden />
        )}
      </button>
    </div>
  );
}
