import type { ReactNode } from 'react';

import { BottomNav } from '@/components/layout/bottom-nav';
import { Sidebar } from '@/components/layout/sidebar';

type AppShellProps = {
	children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
	return (
		<div className="flex min-h-full flex-1 justify-center">
			<div className="flex min-h-full w-full max-w-[var(--max-width-shell)]">
				<Sidebar />
				<div className="flex min-h-full min-w-0 flex-1 flex-col border-x border-border bg-card md:border-l-0">
					{children}
				</div>
			</div>

			<BottomNav />
		</div>
	);
}
