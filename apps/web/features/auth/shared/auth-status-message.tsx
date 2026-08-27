import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AuthStatusTone = "pending" | "success" | "error" | "muted";

type AuthStatusMessageProps = {
  icon: LucideIcon;
  tone?: AuthStatusTone;
  title: string;
  body: string;
  spin?: boolean;
  action?: ReactNode;
};

const toneClassName: Record<AuthStatusTone, string> = {
  pending: "text-foreground",
  success: "text-sand",
  error: "text-destructive",
  muted: "text-muted-foreground",
};

export function AuthStatusMessage({
  icon: Icon,
  tone = "muted",
  title,
  body,
  spin = false,
  action,
}: AuthStatusMessageProps) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <Icon
        aria-hidden
        className={cn(
          "size-12 stroke-[1.25]",
          toneClassName[tone],
          spin && "animate-spin",
        )}
      />
      <div className="flex flex-col gap-2">
        <p className="font-heading text-xl font-medium tracking-tight">
          {title}
        </p>
        <p className="text-sm text-muted-foreground">{body}</p>
      </div>
      {action ? <div className="flex justify-center pt-1">{action}</div> : null}
    </div>
  );
}
