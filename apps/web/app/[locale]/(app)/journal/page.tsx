import { setRequestLocale } from 'next-intl/server';

import { Composer } from '@/features/journal/components/composer';
import { JournalList } from '@/features/journal/components/journal-list';

type JournalPageProps = {
	params: Promise<{ locale: string }>;
};

export default async function JournalPage({ params }: JournalPageProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	return (
		<main className="flex flex-1 flex-col pb-16 md:pb-0">
			<Composer showVisibilityToggle={false} />
			<JournalList />
		</main>
	);
}
