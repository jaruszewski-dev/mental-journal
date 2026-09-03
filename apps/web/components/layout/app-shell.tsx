import type { ReactNode } from "react";

import { BottomNav } from "@/components/layout/bottom-nav";
import { Sidebar } from "@/components/layout/sidebar";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-full flex-1">
      <Sidebar />

      <div className="flex flex-1 justify-center">
        <div className="flex w-full max-w-feed min-h-full flex-col border-x border-border bg-card">
          {children}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
