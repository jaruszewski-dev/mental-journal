'use client';

import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { logoutAllSessions } from '@/features/auth/session/api/logout';
import { useRouter } from '@/i18n/navigation';
import { resolveApiErrorMessage } from '@/lib/api-error';
import { useAuthMeStore } from '@/store/auth-me.store';

export function useLogoutAllMutation() {
	const router = useRouter();
	const clearMe = useAuthMeStore((s) => s.clearMe);
	const tApi = useTranslations('apiErrors');

	return useMutation({
		mutationFn: logoutAllSessions,
		onSuccess: () => {
			clearMe();
			router.replace('/login');
		},
		onError: (error) => {
			toast.error(resolveApiErrorMessage(error, tApi));
		},
	});
}
