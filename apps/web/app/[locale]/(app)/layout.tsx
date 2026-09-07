import { setRequestLocale } from 'next-intl/server';

import { AppShell } from '@/components/layout/app-shell';
import { AuthProvider } from '@/components/providers/auth-provider';
import { RealtimeProvider } from '@/components/providers/realtime-provider';

type MainLayoutProps = {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
};

export default async function MainLayout({ children, params }: MainLayoutProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	return (
		<AuthProvider>
			<RealtimeProvider>
				<AppShell>{children}</AppShell>
			</RealtimeProvider>
		</AuthProvider>
	);
}
