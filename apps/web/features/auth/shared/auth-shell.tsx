import type { ReactNode } from "react";

import { AuthVideo } from "./auth-video";

type AuthShellProps = {
  children: ReactNode;
};

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <div className="pointer-events-none absolute inset-0 md:hidden">
        <AuthVideo className="motion-reduce:hidden" />
        <div
          className="absolute inset-0 hidden bg-cover bg-center motion-reduce:block"
          style={{
            backgroundImage: "url(/auth/mental-journal-auth-poster.webp)",
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-background/80" />
      </div>

      <div className="relative z-10 flex min-h-full flex-1 flex-col md:flex-row">
        {children}
      </div>
    </div>
  );
}
