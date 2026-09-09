'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { AccountForm } from '@/features/account/components/account-form';
import { useLogoutAllMutation } from '@/features/auth/session/hooks/use-logout-all-mutation';

export function AccountView() {
	const t = useTranslations('account');
	const logoutAllMutation = useLogoutAllMutation();

	return (
		<div className="flex flex-col gap-8 px-4 py-6 sm:px-6">
			<h1 className="font-heading text-2xl font-medium tracking-tight">{t('title')}</h1>
			<AccountForm />

			<section className="flex flex-col gap-3 border-t border-border pt-6">
				<div className="flex flex-col gap-1">
					<p className="font-heading text-base font-medium tracking-tight">
						{t('logoutAllTitle')}
					</p>
					<p className="text-sm text-muted-foreground">
						{t('logoutAllDescription')}
					</p>
				</div>
				<Button
					type="button"
					variant="destructive"
					size="sm"
					className="cursor-pointer self-start"
					disabled={logoutAllMutation.isPending}
					onClick={() => logoutAllMutation.mutate()}
				>
					{t('logoutAll')}
				</Button>
			</section>
		</div>
	);
}
