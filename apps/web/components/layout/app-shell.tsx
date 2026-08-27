import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-full flex-1 justify-center">
      <div className="flex w-full max-w-feed min-h-full flex-col border-x border-border bg-card">
        {children}
      </div>
    </div>
  );
}
